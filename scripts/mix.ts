/**
 * Final audio master.
 *
 * Reads the recorded voice and the per-cue SFX written by `npm run sfx`, runs
 * them through the mix bus in `src/engine/mix.ts`, then masters the result to
 * -14.0 LUFS / -1.5 dBTP. Writes a report with the measured loudness, the gain
 * and limiter the master used, and the input hashes.
 *
 * usage: npm run mix -- films/understudy/score.json
 */
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { FilmScoreSchema, resolveFilm } from "../src/engine/treatment.js";
import { LIMITER_MAX_REDUCTION, MASTER_MAX_GAIN, measureLoudness, measureWithFilters, runFfmpeg } from "../src/engine/loudness.js";
import { cueBand, cueDuckDb, cueSend, mixFilm } from "../src/engine/mix.js";
import { cueSetText, cueSpec, cueTargetDb, kindLength, loudMoment } from "../src/engine/sfx.js";

const TARGET_LUFS = -14;
const TARGET_TP = -1.5;
/**
 * The limiter's sample ceiling, in linear full scale. -2 dBFS leaves room for
 * the inter-sample peaks that `ebur128` measures as true peak, so the limit
 * lands under -1.5 dBTP rather than pinning at it.
 *
 * The master is not mastered to the *delivery* ceiling, because the delivery is
 * an AAC encode and AAC overshoots (this film: -1.9 dBTP master → -0.6 dBTP
 * file, 1.3 dB of overshoot). `npm run deliver` holds the delivered file to
 * -1.5 dBTP with a peak limiter that touches only the loudest samples, so the
 * film keeps its loudness instead of being turned down to pay for the encoder.
 */
const LIMITER_CEILING = 0.794;
/** How many gain/limit passes the master may take to land on the target. */
const MASTER_PASSES = 6;
/**
 * The most a declared silence may carry. A phone in a quiet room has a noise
 * floor near -60 dBFS; -50 leaves room for the encoder's own hiss and nothing
 * else. A window the score calls silent that measures above this is a window
 * the score is wrong about.
 */
const SILENCE_CEILING = -50;
/** The film's last 0.5 s is a slope down to nothing, and the end is inside this. */
const TAIL_CEILING = -60;

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith("--"));
if (!file) {
  console.error("usage: npm run mix -- <score.json>");
  process.exit(2);
}

const root = process.cwd();
const score = FilmScoreSchema.parse(JSON.parse(readFileSync(resolve(root, file), "utf8")));
const { plan, errors } = resolveFilm(score, resolve(root, `styles/${score.style}`), root);
if (errors.length > 0) {
  for (const error of errors) console.error(`error: ${error.message}`);
  process.exit(1);
}

const ffmpeg = findFfmpeg();
const sr = 48_000;

const outDir = resolve(root, "build", score.id, "mix");
mkdirSync(outDir, { recursive: true });

const voicePath = plan.audio.narration?.voice ? resolve(root, plan.audio.narration.voice) : null;
const voice = voicePath && existsSync(voicePath) ? mono(voicePath) : null;

/**
 * The per-cue WAVs are only trusted when `sfx.json` says this exact cue
 * rendered them. A kind, a length or a time that changed after `npm run sfx`
 * must fail the mix, not be mixed from yesterday's file.
 */
type SfxRecord = { id: string; spec: string; wav: string; ok: boolean };
const sfxPath = resolve(root, "build", score.id, "sfx", "sfx.json");
const sfxReport = existsSync(sfxPath)
  ? (JSON.parse(readFileSync(sfxPath, "utf8")) as { cues: SfxRecord[] })
  : null;
const records = new Map((sfxReport?.cues ?? []).map((record) => [record.id, record]));

const cues = plan.cues.map((cue) => {
  const path = resolve(root, "build", score.id, "sfx", `${cue.id}.wav`);
  if (!existsSync(path)) {
    console.error(`error: cue "${cue.id}" has no audio at build/${score.id}/sfx/${cue.id}.wav`);
    console.error("       run: npm run sfx -- " + file);
    process.exit(1);
  }
  const record = records.get(cue.id);
  if (!record) {
    console.error(`error: cue "${cue.id}" is not in build/${score.id}/sfx/sfx.json`);
    console.error("       the WAVs and the score disagree; run: npm run sfx -- " + file);
    process.exit(1);
  }
  if (record.spec !== sha256(cueSpec(cue))) {
    console.error(`error: cue "${cue.id}" changed after it was rendered (kind, time, length, layers, gain, pan or band)`);
    console.error("       run: npm run sfx -- " + file);
    process.exit(1);
  }
  if (record.wav !== `sha256:${hashFile(path)}`) {
    console.error(`error: cue "${cue.id}" WAV was written by a different run than its record`);
    console.error("       run: npm run sfx -- " + file);
    process.exit(1);
  }
  const samples = mono(path);
  return {
    id: cue.id,
    kind: cue.kind,
    at: cue.at,
    samples,
    send: cueSend(cue),
    duckDb: cueDuckDb(cue),
    band: cueBand(cue),
    pan: cue.pan,
    /** Its own length on the film's clock, for the room-under-a-line check. */
    duration: cue.duration ?? kindLength(cue.kind),
    /** The level the score's gain asks for: the kit's target for that kind. */
    levelDb: cueTargetDb(cue.kind, cue.gain),
  };
});

if (!voice && cues.length === 0) {
  console.error("error: nothing to mix; add a voice or SFX cues");
  process.exit(1);
}

const voiceGains =
  score.clock.mode === "narration"
    ? score.clock.lines
        .filter((line) => typeof line.gainDb === "number" && line.gainDb !== 0)
        .map((line) => ({ start: line.start, duration: line.duration, gainDb: line.gainDb as number }))
    : [];

const mixed = mixFilm({ sampleRate: sr, duration: plan.duration, voice, voiceGains, cues });
const premaster = resolve(outDir, "premaster48.wav");
writeWavFloat32(premaster, mixed.left, mixed.right, sr);

const master = resolve(outDir, "master.wav");
const mastered = masterToTarget(ffmpeg, premaster, master);
const measured = mastered.measured;

/**
 * Did every cue that plays under speech actually get the duck its score asked
 * for? The mix reports what it applied; this is the row that refuses a report
 * where a declared duck did not arrive. 1 dB of slack is the knee of the
 * presence gate, not a licence.
 */
const DUCK_SLACK = 1;
const underSpeech = mixed.cues.filter((cue) => cue.appliedDb > 0 || cue.overVoiceDb !== null);
const shortDuck = mixed.cues.filter(
  (cue) => cue.overVoiceDb !== null && cue.appliedDb < Math.max(0, cue.declaredDb - DUCK_SLACK),
);
const overVoice = mixed.cues.filter((cue) => (cue.overVoiceDb ?? -99) > 0);
const duckOk = shortDuck.length === 0 && overVoice.length === 0;

/** The level a cue's own record claims, against the level the bus gave it. */
const levels = mixed.cues.map((cue) => {
  const samples = cues.find((input) => input.id === cue.id)?.samples;
  const fileDb = samples ? 20 * Math.log10(loudMoment(samples, sr) + 1e-9) : null;
  return { id: cue.id, fileDb: fileDb === null ? null : Number(fileDb.toFixed(1)), busDb: cue.busPeakDb };
});
const levelDrift = levels
  .filter((level) => level.fileDb !== null)
  .map((level) => ({ id: level.id, drift: level.busDb - (level.fileDb as number) }))
  .sort((a, b) => Math.abs(b.drift) - Math.abs(a.drift));
const worstDrift = levelDrift[0] ?? { id: null, drift: 0 };
/**
 * How far the bus's band placement may move a cue's own level. The band is two
 * unity edges, so anything inside it passes unchanged; a cue with real energy
 * outside its band is the case this catches, and it should be rare and small.
 */
const LEVEL_DRIFT = 1;
const levelsOk = Math.abs(worstDrift.drift) <= LEVEL_DRIFT;

/**
 * The silence the score declares, measured on the file that ships. A
 * declaration is a claim about the master, and only the master can settle it.
 */
const masterAudio = readWav(master);
const declared = plan.audio.sfx?.silences ?? [];
const silences = declared.map((silence) => {
  const from = Math.round(silence.from * sr);
  const to = Math.round(silence.to * sr);
  let peak = 0;
  let energy = 0;
  let counted = 0;
  for (let i = from; i < to; i++) {
    for (const channel of masterAudio.channels) {
      const value = channel[i] ?? 0;
      peak = Math.max(peak, Math.abs(value));
      energy += value * value;
      counted += 1;
    }
  }
  const peakDb = Number((20 * Math.log10(peak + 1e-9)).toFixed(1));
  return {
    from: silence.from,
    to: silence.to,
    why: silence.why,
    peakDb,
    rmsDb: Number((20 * Math.log10(Math.sqrt(energy / Math.max(1, counted)) + 1e-9)).toFixed(1)),
    ok: peakDb <= SILENCE_CEILING,
  };
});
const silenceOk = silences.every((silence) => silence.ok);

/**
 * The other direction: silence the score did **not** declare.
 *
 * `silences` only ever measured the windows the director wrote down, so a
 * 270 ms hole at a cut — one foley cue decaying before the next arrives — shipped
 * with no artifact able to see it, in the master and in the delivered MP4. The
 * rule the repo states is that a hole in the foley is either a decision or a
 * defect; this is the measurement behind it. Declared windows and the tail fade
 * are exempt, because both are decisions already written down.
 */
const SILENCE_MIN_HOLE = 0.15;
const holes = (() => {
  const step = Math.max(1, Math.round(0.05 * sr));
  const length = masterAudio.channels[0]?.length ?? 0;
  const tailFrom = plan.duration - 0.5;
  // A breath inside a spoken line is not a hole in the foley: the viewer still
  // hears the line continuing. Only silence between lines (or after the last
  // word) is a decision the film has to declare.
  const lines = plan.clock.mode === "narration" ? plan.clock.lines : [];
  const found: { from: number; to: number; seconds: number; peakDb: number }[] = [];
  let runStart: number | null = null;
  let runPeak = 0;
  const close = (endSample: number) => {
    if (runStart === null) return;
    const from = runStart / sr;
    const to = endSample / sr;
    const peak = runPeak;
    runStart = null;
    runPeak = 0;
    if (to - from < SILENCE_MIN_HOLE - 1e-6) return;
    if (from >= tailFrom) return;
    if (lines.some((line) => from < line.start + line.duration + (line.hold ?? 0) && to > line.start)) return;
    if (declared.some((window) => from >= window.from - 0.02 && to <= window.to + 0.02)) return;
    found.push({
      from: Number(from.toFixed(3)),
      to: Number(to.toFixed(3)),
      seconds: Number((to - from).toFixed(3)),
      peakDb: Number((20 * Math.log10(peak + 1e-9)).toFixed(1)),
    });
  };
  for (let i = 0; i + step <= length; i += step) {
    let peak = 0;
    for (const channel of masterAudio.channels) {
      for (let j = i; j < i + step; j++) peak = Math.max(peak, Math.abs(channel[j] ?? 0));
    }
    if (20 * Math.log10(peak + 1e-9) <= SILENCE_CEILING) {
      if (runStart === null) runStart = i;
      runPeak = Math.max(runPeak, peak);
    } else {
      close(i);
    }
  }
  close(length);
  return found;
})();
const holesOk = holes.length === 0;

/**
 * A room bed that stops while a line is still being spoken.
 *
 * The bed leaving mid-word is a mix decision nobody hears as one: the voice is
 * alone under its most important sentence and no report says so. Either the bed
 * runs under the line or the film declares that stretch silent.
 */
const roomEndsInLine = cues
  .filter((cue) => cue.kind === "room")
  .flatMap((cue) => {
    const end = cue.at + (cue.duration ?? 0);
    const lines = score.clock.mode === "narration" ? score.clock.lines : [];
    const line = lines.find(
      (entry) => cue.at < entry.start + entry.duration && end > entry.start && end < entry.start + entry.duration,
    );
    return line
      ? [
          {
            cue: cue.id,
            line: line.id,
            endsAt: Number(end.toFixed(3)),
            lineEndsAt: Number((line.start + line.duration).toFixed(3)),
          },
        ]
      : [];
  });
const roomOk = roomEndsInLine.length === 0;

/**
 * The film ends on a fade to nothing rather than on a cut: the last 0.5 s must
 * come down and stay down, and the final sample must be under `TAIL_CEILING`.
 */
const fadeFrom = Math.round((plan.duration - 0.5) * sr);
const fade = (() => {
  const window: number[] = [];
  const step = Math.max(1, Math.round(0.05 * sr));
  for (let i = fadeFrom; i < masterAudio.channels[0]?.length!; i += step) {
    let peak = 0;
    for (const channel of masterAudio.channels) {
      for (let j = i; j < Math.min(i + step, channel.length); j++) peak = Math.max(peak, Math.abs(channel[j] ?? 0));
    }
    window.push(peak);
  }
  const monotonic = window.every((value, index) => index === 0 || value <= (window[index - 1] ?? 0) * 1.02 + 1e-4);
  const last = 20 * Math.log10((window[window.length - 1] ?? 0) + 1e-9);
  return {
    fromDb: Number((20 * Math.log10((window[0] ?? 0) + 1e-9)).toFixed(1)),
    endDb: Number(last.toFixed(1)),
    ceilingDb: TAIL_CEILING,
    monotonic,
    ok: monotonic && last <= TAIL_CEILING,
  };
})();
const tailOk = fade.ok;
const pass =
  Math.abs(measured.lufs - TARGET_LUFS) <= 0.5 &&
  measured.truePeak <= TARGET_TP + 0.1 &&
  mastered.gainReductionDb <= LIMITER_MAX_REDUCTION &&
  duckOk &&
  levelsOk &&
  silenceOk &&
  holesOk &&
  roomOk &&
  tailOk;
/**
 * 3 s short-term contrast on the master, in LU.
 *
 * Each window is a real `ebur128` integrated loudness of a 3 s PCM slice, not
 * an RMS proxy. The last window is dropped so the tail fade cannot make the
 * loudest/quietest gap look wide by measuring silence.
 */
function shortTermContrast(
  ffmpeg: string,
  master: string,
  duration: number,
): { contrastLu: number; loudest: number; quietest: number; windows: number } {
  const dir = mkdtempSync(join(tmpdir(), "paper-st-"));
  const values: number[] = [];
  try {
    for (let start = 0; start + 3 <= duration; start += 3) {
      const segment = join(dir, `w-${start}.wav`);
      runFfmpeg(ffmpeg, [
        "-hide_banner",
        "-y",
        "-ss",
        String(start),
        "-t",
        "3",
        "-i",
        master,
        segment,
      ]);
      const measured = measureLoudness(ffmpeg, segment);
      if (Number.isFinite(measured.lufs)) values.push(measured.lufs);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
  const usable = values.length > 1 ? values.slice(0, -1) : values;
  if (usable.length === 0) {
    return { contrastLu: Number.NaN, loudest: Number.NaN, quietest: Number.NaN, windows: 0 };
  }
  const loudest = Math.max(...usable);
  const quietest = Math.min(...usable);
  return {
    contrastLu: Number((loudest - quietest).toFixed(2)),
    loudest: Number(loudest.toFixed(2)),
    quietest: Number(quietest.toFixed(2)),
    windows: usable.length,
  };
}

const report = {
  film: score.id,
  target: { lufs: TARGET_LUFS, truePeak: TARGET_TP },
  measured: { lufs: measured.lufs, truePeak: measured.truePeak, lra: measured.lra },
  /** The quietest and loudest 3 s window, measured on the master. */
  shortTerm: shortTermContrast(ffmpeg, master, plan.duration),
  master: {
    gainDb: mastered.gainDb,
    limiterCeiling: Number((20 * Math.log10(mastered.ceiling)).toFixed(2)),
    /** What the limiter took off the loudest sample, so the gain is not a fiction. */
    limiterGainReductionDb: mastered.gainReductionDb,
    /**
     * The same reduction read as a distribution over the film, in 100 ms
     * windows. The peak number alone reads as if the master squashed the whole
     * programme; this says how much of it was actually touched.
     */
    limiterWindows: limiterWindows(premaster, master, mastered.gainDb),
    passes: mastered.passes,
    usedAllPasses: mastered.passes >= MASTER_PASSES,
    /** The render reached the target; it is not "close enough on the last pass". */
    converged: Math.abs(measured.lufs - TARGET_LUFS) <= 0.2 && measured.truePeak <= TARGET_TP + 0.2,
  },
  /** What the mix bus did to its own headroom before the master saw it. */
  bus: { headroomDb: mixed.busGainDb },
  cues: cues.length,
  voice: voicePath ? relative(voicePath) : null,
  /** The score's deliberate quiet, in dB, applied to the voice before the bus. */
  lineGains: voiceGains,
  duckDb: average(cues.map((cue) => cue.duckDb)),
  /**
   * What the duck actually did, per cue: a score that declares 8 dB and a mix
   * that applies 2.6 dB is a film where the declaration is decoration.
   */
  duck: {
    ok: duckOk,
    slackDb: DUCK_SLACK,
    underSpeech: underSpeech.length,
    short: shortDuck.map((cue) => ({
      id: cue.id,
      declaredDb: cue.declaredDb,
      appliedDb: cue.appliedDb,
      at: cue.at,
    })),
    overVoice: overVoice.map((cue) => ({ id: cue.id, overVoiceDb: cue.overVoiceDb })),
    worst: mixed.cues
      .filter((cue) => cue.appliedDb > 0)
      .sort((a, b) => b.appliedDb - a.appliedDb)
      .slice(0, 3)
      .map((cue) => ({ id: cue.id, declaredDb: cue.declaredDb, appliedDb: cue.appliedDb, at: cue.at })),
  },
  /** The cue's level in the file against the level it reaches on the bus. */
  cueLevels: {
    ok: levelsOk,
    toleranceDb: LEVEL_DRIFT,
    worst: worstDrift.id
      ? { id: worstDrift.id, driftDb: Number(worstDrift.drift.toFixed(2)) }
      : null,
    cues: levels,
  },
  /** The score's silence claims, measured on the master that ships. */
  silence: { ok: silenceOk, ceilingDb: SILENCE_CEILING, windows: silences },
  /** Silence the score did not declare: a decision not taken is a defect. */
  undeclaredHoles: { ok: holesOk, minSeconds: SILENCE_MIN_HOLE, ceilingDb: SILENCE_CEILING, found: holes },
  /** A room bed that stops under a line is a mix decision nobody hears as one. */
  roomUnderLines: { ok: roomOk, endedInLine: roomEndsInLine },
  tail: fade,
  reverb: { room: 0.82, damp: 0.2, wet: 0.32 },
  passes: pass,
  inputs: {
    score: `sha256:${hashFile(resolve(root, file))}`,
    sfx: sfxReport ? `sha256:${sha256(cueSetText(sfxReport.cues))}` : null,
    voice: voicePath && existsSync(voicePath) ? `sha256:${hashFile(voicePath)}` : null,
  },
  files: {
    master: relative(master),
    hash: `sha256:${hashFile(master)}`,
    premaster: relative(premaster),
  },
  generatedAt: new Date().toISOString(),
};
writeFileSync(resolve(outDir, "mix-report.json"), JSON.stringify(report, null, 2) + "\n", "utf8");

console.log(`mix: ${cues.length} cues + ${voice ? "voice" : "no voice"} → build/${score.id}/mix/master.wav`);
if (mixed.busGainDb !== 0) {
  console.log(`bus: ${mixed.busGainDb.toFixed(1)} dB of headroom taken so the premaster peaks at -1 dBFS`);
}
console.log(
  `master: ${measured.lufs.toFixed(1)} LUFS · ${measured.truePeak.toFixed(1)} dBTP ` +
    `(target ${TARGET_LUFS} / ${TARGET_TP} · gain ${mastered.gainDb >= 0 ? "+" : ""}${mastered.gainDb.toFixed(1)} dB · ` +
    `limiter ${(20 * Math.log10(mastered.ceiling)).toFixed(1)} dBFS, taking ${mastered.gainReductionDb.toFixed(1)} dB off the loudest sample`,
);
const windows = report.master.limiterWindows;
console.log(
  `       limiter over the film: median window ${windows.p50.toFixed(2)} dB · p90 ${windows.p90.toFixed(2)} · ` +
    `p99 ${windows.p99.toFixed(2)} · ${windows.over3Db}/${windows.windows} windows over 3 dB)`,
);
if (mastered.gainReductionDb > LIMITER_MAX_REDUCTION) {
  console.error(
    `error: the limiter took ${mastered.gainReductionDb.toFixed(1)} dB off the loudest sample; ` +
      `more than ${LIMITER_MAX_REDUCTION} dB is the master compressing the film, so fix the mix`,
  );
}
console.log(
  `duck: ${underSpeech.length}/${mixed.cues.length} cues meet speech · ` +
    (shortDuck.length === 0
      ? `every one reached its declared depth (worst: ${report.duck.worst[0]?.id ?? "none"} ${report.duck.worst[0]?.appliedDb ?? 0} of ${report.duck.worst[0]?.declaredDb ?? 0} dB)`
      : `${shortDuck.length} short: ` +
        shortDuck.map((cue) => `${cue.id} ${cue.appliedDb} of ${cue.declaredDb} dB at ${cue.at}s`).join(", ")),
);
if (overVoice.length > 0) {
  console.error(
    `error: ${overVoice.length} cue(s) sit above the voice in 1-4 kHz where a word is in the air: ` +
      overVoice.map((cue) => `${cue.id} +${cue.overVoiceDb} dB`).join(", "),
  );
}
if (worstDrift.id) {
  console.log(
    `levels: a cue's loudest 50 ms lands within ${Math.abs(worstDrift.drift).toFixed(2)} dB of its own record ` +
      `(worst: ${worstDrift.id})`,
  );
}
console.log(
  `silence: ${silences.length} declared window(s) measured on the master · ` +
    (silences.length === 0
      ? "none declared"
      : silences
          .map((silence) => `${silence.from}–${silence.to}s peak ${silence.peakDb} dBFS ${silence.ok ? "ok" : "TOO LOUD"}`)
          .join(" · ")),
);
console.log(
  `tail: fade from ${fade.fromDb} dBFS to ${fade.endDb} dBFS over 0.5 s ` +
    `(${fade.monotonic ? "monotonic" : "RISES"}, ceiling ${TAIL_CEILING} dBFS)`,
);
if (!holesOk) {
  console.error(
    `error: ${holes.length} stretch(es) of silence the score does not declare ` +
      `(>= ${SILENCE_MIN_HOLE}s at <= ${SILENCE_CEILING} dBFS): ` +
      holes.map((hole) => `${hole.from}-${hole.to}s (${hole.seconds}s, peak ${hole.peakDb})`).join(", ") +
      " — a hole in the foley is a decision or a defect, so declare it or fill it",
  );
}
if (!roomOk) {
  console.error(
    `error: a room bed stops while a line is still being spoken: ` +
      roomEndsInLine.map((entry) => `${entry.cue} ends ${entry.endsAt}s, ${entry.line} runs to ${entry.lineEndsAt}s`).join(", "),
  );
}
if (!silenceOk) {
  console.error(
    `error: a declared silence carries sound above ${SILENCE_CEILING} dBFS; ` +
      `either narrow the window to what is silent or remove the sound`,
  );
}
if (!tailOk) {
  console.error(`error: the film does not fade to silence; the last 0.5 s must come down to ${TAIL_CEILING} dBFS`);
}
// The loudness and true-peak conditions used to be part of `pass` and print
// nothing, so a master that landed 0.6 LU outside tolerance failed with no
// sentence saying which number was wrong. A check that can fail silently is a
// check the next person debugs by reading the source.
if (Math.abs(measured.lufs - TARGET_LUFS) > 0.5) {
  console.error(
    `error: the master measures ${measured.lufs.toFixed(1)} LUFS; the target is ${TARGET_LUFS} ± 0.5 ` +
      `(the master gain stopped at ${mastered.gainDb >= 0 ? "+" : ""}${mastered.gainDb} dB of a ±${MASTER_MAX_GAIN} dB bound)`,
  );
}
if (measured.truePeak > TARGET_TP + 0.1) {
  console.error(
    `error: the master's true peak is ${measured.truePeak.toFixed(1)} dBTP; it must stay under ${TARGET_TP + 0.1} dBTP`,
  );
}
if (!pass) process.exit(1);

function mono(path: string): Float32Array {
  const wav = readWav(path);
  const frames = wav.channels[0]?.length ?? 0;
  if (wav.channels.length === 1) return wav.channels[0] ?? new Float32Array(0);
  const out = new Float32Array(frames);
  for (const channel of wav.channels) {
    for (let i = 0; i < frames; i++) out[i] = (out[i] ?? 0) + (channel[i] ?? 0) / wav.channels.length;
  }
  return out;
}

type Wav = { sampleRate: number; channels: Float32Array[] };

function readWav(path: string): Wav {
  const buffer = readFileSync(path);
  if (buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WAVE") {
    throw new Error(`${path} is not a RIFF/WAVE file`);
  }
  let offset = 12;
  let format = 1;
  let channels = 1;
  let sampleRate = 48_000;
  let bits = 16;
  let dataStart = -1;
  let dataLength = 0;
  while (offset + 8 <= buffer.length) {
    const id = buffer.toString("ascii", offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    const body = offset + 8;
    if (id === "fmt ") {
      format = buffer.readUInt16LE(body);
      channels = buffer.readUInt16LE(body + 2);
      sampleRate = buffer.readUInt32LE(body + 4);
      bits = buffer.readUInt16LE(body + 14);
      if (format === 0xfffe && size >= 40) format = buffer.readUInt16LE(body + 24);
    } else if (id === "data") {
      dataStart = body;
      dataLength = Math.min(size, buffer.length - body);
    }
    offset = body + size + (size % 2);
  }
  if (dataStart < 0) throw new Error(`${path} has no data chunk`);
  const bytesPerSample = bits / 8;
  const frames = Math.floor(dataLength / (bytesPerSample * channels));
  const out: Float32Array[] = Array.from({ length: channels }, () => new Float32Array(frames));
  for (let frame = 0; frame < frames; frame++) {
    for (let channel = 0; channel < channels; channel++) {
      const at = dataStart + (frame * channels + channel) * bytesPerSample;
      let value: number;
      if (format === 3) value = buffer.readFloatLE(at);
      else if (bits === 16) value = buffer.readInt16LE(at) / 32768;
      else if (bits === 24) value = (buffer.readIntLE(at, 3) << 8) / 2147483648;
      else if (bits === 32) value = buffer.readInt32LE(at) / 2147483648;
      else value = 0;
      out[channel]![frame] = value;
    }
  }
  return { sampleRate, channels: out };
}

function writeWavFloat32(path: string, left: Float32Array, right: Float32Array, sampleRate: number): void {
  const frames = Math.min(left.length, right.length);
  const dataLength = frames * 2 * 4;
  const buffer = Buffer.alloc(44 + dataLength);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataLength, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(3, 20);
  buffer.writeUInt16LE(2, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 8, 28);
  buffer.writeUInt16LE(8, 32);
  buffer.writeUInt16LE(32, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataLength, 40);
  let offset = 44;
  for (let i = 0; i < frames; i++) {
    buffer.writeFloatLE(left[i] ?? 0, offset); offset += 4;
    buffer.writeFloatLE(right[i] ?? 0, offset); offset += 4;
  }
  writeFileSync(path, buffer);
}

/**
 * The master chain: one gain, then a true-peak limiter.
 *
 * The mix decides how the film sounds; the master only sets its level. It adds
 * one constant gain towards -14 LUFS and holds the true peak under -1.5 dBTP
 * with a limiter, and the report records both numbers, so nothing is hidden
 * behind a normaliser. The gain is measured, not guessed: each pass measures
 * what the last render actually reached and adds the residual, because the
 * limiter takes back some of every gain increase. `MASTER_MAX_GAIN` bounds it —
 * a film that would need more than that to reach -14 is a quiet mix, and a
 * quiet mix is fixed in the mix, not squashed on the master.
 */
type Mastered = {
  gainDb: number;
  ceiling: number;
  passes: number;
  /** dB the limiter took off the loudest sample, at the master's final gain. */
  gainReductionDb: number;
  measured: ReturnType<typeof measure>;
};

function masterToTarget(ffmpeg: string, input: string, output: string): Mastered {
  let gainDb = 0;
  let ceiling = LIMITER_CEILING;
  let measured = measure(ffmpeg, input);
  let passes = 0;

  for (let pass = 0; pass < MASTER_PASSES; pass += 1) {
    const needed = TARGET_LUFS - measured.lufs;
    const tooPeaky = measured.truePeak > TARGET_TP;
    if (pass > 0 && Math.abs(needed) < 0.15 && !tooPeaky) break;

    gainDb = clamp(gainDb + needed, -MASTER_MAX_GAIN, MASTER_MAX_GAIN);
    if (pass > 0 && tooPeaky) ceiling = Math.max(0.5, ceiling * 0.94);
    run(ffmpeg, [
      "-y", "-hide_banner", "-loglevel", "error", "-i", input,
      "-af", `volume=${gainDb.toFixed(2)}dB,alimiter=limit=${ceiling.toFixed(3)}:attack=5:release=50:level=disabled`,
      "-ar", "48000", output,
    ]);
    measured = measure(ffmpeg, output);
    passes = pass + 1;
  }

  // The gain is measured, so the report has to say what the limiter did with it:
  // a master that adds 6 dB and takes 3 of them back off the voice is a
  // different master from one that does not, and the difference is audible.
  // Both peaks come from the same true-peak meter that sets the delivery target;
  // `volumedetect` reads its samples as 16-bit, so a signal lifted over 0 dBFS
  // reports as 0 dB and the reduction reads as a fifth of what it is.
  const peakIn = truePeakAfterGain(ffmpeg, input, gainDb);
  const peakOut = measured.truePeak;
  return {
    gainDb: Number(gainDb.toFixed(2)),
    ceiling,
    passes,
    gainReductionDb: Number((peakIn - peakOut).toFixed(2)),
    measured,
  };
}

/**
 * The true peak of `input` after `gainDb`, in dBTP, from the same meter as the
 * target. The parse lives in `loudness.ts`, because one meter with two parsers
 * is one parser too many — and this one used to default a missed match to 0,
 * which turned the limiter bound into a passing number.
 */
function truePeakAfterGain(ffmpeg: string, input: string, gainDb: number): number {
  return measureWithFilters(ffmpeg, input, [`volume=${gainDb.toFixed(2)}dB`]).truePeak;
}

/**
 * How the limiter's reduction is spread over the film: the level lost per 100 ms
 * window, between the premaster raised by the master's gain and the master.
 *
 * One sample number cannot be judged — a single clamped hit and a squashed
 * programme look the same in `limiterGainReductionDb`. This is the same
 * measurement as a distribution, so the report can say "the median window lost
 * 0.03 dB" next to "the loudest sample lost 7.5".
 */
function limiterWindows(
  premaster: string,
  master: string,
  gainDb: number,
): { p50: number; p90: number; p99: number; max: number; over3Db: number; windows: number } {
  const before = readWav(premaster);
  const after = readWav(master);
  const sr = before.sampleRate;
  const span = Math.max(1, Math.round(0.1 * sr));
  const scale = 10 ** (gainDb / 20);
  const frames = Math.min(before.channels[0]?.length ?? 0, after.channels[0]?.length ?? 0);
  const drops: number[] = [];
  for (let start = 0; start + span <= frames; start += span) {
    let inEnergy = 0;
    let outEnergy = 0;
    for (let i = start; i < start + span; i++) {
      const x = (((before.channels[0]?.[i] ?? 0) + (before.channels[1]?.[i] ?? 0)) / 2) * scale;
      const y = ((after.channels[0]?.[i] ?? 0) + (after.channels[1]?.[i] ?? 0)) / 2;
      inEnergy += x * x;
      outEnergy += y * y;
    }
    if (inEnergy < 1e-6) continue;
    drops.push(10 * Math.log10(inEnergy / Math.max(outEnergy, 1e-12)));
  }
  drops.sort((a, b) => a - b);
  const pick = (percent: number) => Number((drops[Math.min(drops.length - 1, Math.floor((percent / 100) * drops.length))] ?? 0).toFixed(2));
  return {
    p50: pick(50),
    p90: pick(90),
    p99: pick(99),
    max: Number((drops[drops.length - 1] ?? 0).toFixed(2)),
    over3Db: drops.filter((drop) => drop > 3).length,
    windows: drops.length,
  };
}

function clamp(value: number, low: number, high: number): number {
  return Math.min(high, Math.max(low, value));
}

function measure(ffmpeg: string, input: string): { lufs: number; truePeak: number; lra: number } {
  return measureLoudness(ffmpeg, input);
}

function run(binary: string, args: string[]): string {
  const result = spawnSync(binary, args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (result.status !== 0) {
    console.error(result.stderr?.slice(-1500) ?? "");
    throw new Error(`${binary} exited ${result.status}`);
  }
  return `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
}

function hashFile(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function sha256(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

function relative(path: string): string {
  return path.replace(root + "\\", "").replace(root + "/", "").replace(/\\/g, "/");
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2));
}

function findFfmpeg(): string {
  const candidates = [
    process.env.FFMPEG_PATH,
    resolve(root, "node_modules", "ffmpeg-static", "ffmpeg.exe"),
    resolve(root, "..", "node_modules", "ffmpeg-static", "ffmpeg.exe"),
    "ffmpeg",
  ].filter((value): value is string => Boolean(value));
  const found = candidates.find((candidate) => candidate === "ffmpeg" || existsSync(candidate));
  if (!found) throw new Error("ffmpeg not found");
  return found;
}
