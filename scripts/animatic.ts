import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { FilmScoreSchema, resolveFilm } from "../src/engine/treatment.js";

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith("--"));
if (!file) {
  console.error("usage: npm run animatic -- <score.json>");
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
if (!ffmpeg) {
  console.error("error: ffmpeg not found; set FFMPEG_PATH or install ffmpeg-static");
  process.exit(1);
}

const outDir = resolve(root, "build", score.id, "animatic");
const segDir = resolve(outDir, "segments");
const segRel = `build/${score.id}/animatic/segments`;
rmSync(segDir, { recursive: true, force: true });
mkdirSync(segDir, { recursive: true });

const fontDisplay = "proofs/s2-paper/assets/fonts/Anton-Regular.ttf";
const fontMono = "proofs/s2-paper/assets/fonts/DMMono-Regular.ttf";
const segments: string[] = [];

plan.shots.forEach((shot, index) => {
  const n = String(index + 1).padStart(2, "0");
  const title = `${shot.id}  ${shot.recipe.toUpperCase()}`;
  const time = `${shot.start.toFixed(2)} – ${(shot.start + shot.duration).toFixed(2)} s`;
  const slots = Object.values(shot.slots).join("   /   ");
  const spine = shot.direction.spine;
  const files = {
    title: `${segRel}/${n}-title.txt`,
    time: `${segRel}/${n}-time.txt`,
    slots: `${segRel}/${n}-slots.txt`,
    spine: `${segRel}/${n}-spine.txt`,
  };
  writeFileSync(resolve(root, files.title), title, "utf8");
  writeFileSync(resolve(root, files.time), time, "utf8");
  writeFileSync(resolve(root, files.slots), slots, "utf8");
  writeFileSync(resolve(root, files.spine), spine, "utf8");

  const out = `${segRel}/${n}.mp4`;
  const filter = [
    `drawtext=fontfile='${fontMono}':textfile='${files.time}':fontcolor=0x171310:fontsize=26:x=96:y=96`,
    `drawtext=fontfile='${fontDisplay}':textfile='${files.title}':fontcolor=0x171310:fontsize=86:x=96:y=170`,
    `drawtext=fontfile='${fontMono}':textfile='${files.slots}':fontcolor=0xE8452A:fontsize=32:x=96:y=300`,
    `drawtext=fontfile='${fontMono}':textfile='${files.spine}':fontcolor=0x382D25:fontsize=26:x=96:y=380`,
    `drawbox=x=96:y=460:w=1728:h=3:color=0x171310@0.25:t=fill`,
    `drawtext=fontfile='${fontMono}':text=BOARD ANIMATIC  /  ${score.id.toUpperCase()}:fontcolor=0x171310@0.5:fontsize=18:x=96:y=1000`,
  ].join(",");
  const result = spawnSync(
    ffmpeg,
    [
      "-y",
      "-hide_banner",
      "-loglevel", "error",
      "-f", "lavfi",
      "-i", `color=c=0xF2E8D5:s=1920x1080:r=30:d=${shot.duration}`,
      "-vf", filter,
      "-t", String(shot.duration),
      "-r", "30",
      "-c:v", "libx264",
      "-pix_fmt", "yuv420p",
      "-preset", "veryfast",
      out,
    ],
    { stdio: "inherit", timeout: 120_000 },
  );
  if (result.status !== 0) {
    console.error(`error: segment ${shot.id} failed`);
    process.exit(1);
  }
  segments.push(out);
});

const list = resolve(segDir, "list.txt");
writeFileSync(
  list,
  segments.map((segment) => `file '${resolve(root, segment).replace(/\\/g, "/")}'`).join("\n") + "\n",
  "utf8",
);
const silent = resolve(outDir, "silent.mp4");
let result = spawnSync(
  ffmpeg,
  ["-y", "-hide_banner", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", list, "-c", "copy", silent],
  { stdio: "inherit", timeout: 120_000 },
);
if (result.status !== 0) {
  console.error("error: concat failed");
  process.exit(1);
}

const captionFiles = plan.captions.lines.map((caption, index) => {
  const rel = `${segRel}/caption-${index + 1}.txt`;
  writeFileSync(resolve(root, rel), caption.text, "utf8");
  return { rel, caption };
});
const captionFilters = captionFiles
  .map(
    ({ rel, caption }) =>
      `drawtext=fontfile='${fontMono}':textfile='${rel}':fontcolor=0xFBF4E6:fontsize=40:x=(w-text_w)/2:y=h-150:box=1:boxcolor=0x171310@0.82:boxborderw=18:enable='between(t\\,${caption.start}\\,${caption.end})'`,
  )
  .join(",");
const captioned = resolve(outDir, "captioned.mp4");
result = spawnSync(
  ffmpeg,
  [
    "-y", "-hide_banner", "-loglevel", "error",
    "-i", silent,
    "-vf", captionFilters,
    "-t", String(plan.duration),
    "-r", "30",
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "veryfast",
    captioned,
  ],
  { stdio: "inherit", timeout: 120_000 },
);
if (result.status !== 0) {
  console.error("error: caption burn failed");
  process.exit(1);
}

const voice = plan.audio.narration?.voice ? resolve(root, plan.audio.narration.voice) : null;
const sfx = resolve(root, "build", score.id, "sfx", "mix.wav");
const hasVoice = Boolean(voice && existsSync(voice));
const needsVoice =
  plan.audio.mode === "narration" ||
  plan.audio.mode === "hybrid" ||
  (plan.audio.narration?.source !== undefined && plan.audio.narration.source !== "none");
const hasSfx = (plan.audio.sfx?.cues.length ?? 0) > 0;
if (needsVoice && !hasVoice) {
  console.error("error: narration is declared but the voice file is missing");
  process.exit(1);
}
if (!hasVoice && !hasSfx) {
  console.error("error: animatic has no audio; add a voice or SFX cues");
  process.exit(1);
}
if (hasSfx && !existsSync(sfx)) {
  console.error("error: SFX cues are declared but build/<id>/sfx/mix.wav is missing");
  console.error("       run: npm run sfx -- " + file);
  process.exit(1);
}

const output = resolve(outDir, "animatic.mp4");
const muxArgs = ["-y", "-hide_banner", "-loglevel", "error", "-i", captioned];
const audioInputs: string[] = [];
if (hasVoice && voice) {
  muxArgs.push("-i", voice);
  audioInputs.push("1:a");
}
if (hasSfx) {
  muxArgs.push("-i", sfx);
  audioInputs.push(`${audioInputs.length + 1}:a`);
}
muxArgs.push("-map", "0:v");
if (audioInputs.length === 1) {
  muxArgs.push(
    "-map", audioInputs[0] ?? "1:a",
    "-af", "loudnorm=I=-11.5:TP=-1.5:LRA=11,alimiter=limit=0.72:level=0",
    "-c:a", "aac", "-b:a", "192k",
  );
} else {
  const inputs = audioInputs.map((input) => `[${input}]`).join("");
  muxArgs.push(
    "-filter_complex",
    `${inputs}amix=inputs=${audioInputs.length}:duration=longest:normalize=0,alimiter=limit=0.95,loudnorm=I=-11.5:TP=-1.5:LRA=11,alimiter=limit=0.72:level=0[a]`,
    "-map", "[a]",
    "-c:a", "aac", "-b:a", "192k",
  );
}
muxArgs.push("-c:v", "copy", "-t", String(plan.duration), output);
result = spawnSync(ffmpeg, muxArgs, { stdio: "inherit", timeout: 120_000 });
if (result.status !== 0) {
  console.error("error: mux failed");
  process.exit(1);
}

const cueCount = plan.audio.sfx?.cues.length ?? 0;
const probe = findFfprobe();
if (probe) {
  const result = spawnSync(probe, ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", output], { encoding: "utf8" });
  const duration = Number(result.stdout.trim());
  if (!Number.isFinite(duration) || Math.abs(duration - plan.duration) > 0.05) {
    console.error(`error: output duration ${duration}s, expected ${plan.duration}s`);
    process.exit(1);
  }
}
const audioProbe = spawnSync(
  ffmpeg,
  ["-hide_banner", "-i", output, "-map", "0:a", "-af", "volumedetect", "-f", "null", "-"],
  { encoding: "utf8" },
);
const maxVolume = audioProbe.stderr.match(/max_volume: (-?[\d.]+) dB/)?.[1];
if (maxVolume === undefined || Number(maxVolume) <= -60) {
  console.error("error: output has no audible audio stream");
  process.exit(1);
}

console.log(`animatic: ${segments.length} shots, ${plan.duration}s → build/${score.id}/animatic/animatic.mp4`);
console.log(`audio: ${hasVoice ? "voice" : ""}${hasVoice && hasSfx ? " + " : ""}${hasSfx ? `${cueCount} generated SFX` : ""} (peak ${maxVolume} dB)`);
console.log(`captions: burned from score; srt at ${plan.captions.source}`);

function findFfmpeg(): string | undefined {
  const candidates = [
    process.env.FFMPEG_PATH,
    "Y:/NewVideoTest/node_modules/ffmpeg-static/ffmpeg.exe",
    "ffmpeg",
  ].filter((value): value is string => Boolean(value));
  return candidates.find((candidate) => candidate === "ffmpeg" || existsSync(candidate));
}

function findFfprobe(): string | undefined {
  const candidates = [
    process.env.FFPROBE_PATH,
    "Y:/NewVideoTest/studio/node_modules/ffprobe-static/bin/win32/x64/ffprobe.exe",
    "ffprobe",
  ].filter((value): value is string => Boolean(value));
  return candidates.find((candidate) => candidate === "ffprobe" || existsSync(candidate));
}
