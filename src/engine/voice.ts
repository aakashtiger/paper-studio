/**
 * Speech tools: local, external, pinned — and never npm dependencies.
 *
 * Narration is either a supplied recording or spoken locally by Kokoro. Word
 * timings and the final gate come from local Whisper. Both are Python tools
 * resolved the way ffmpeg is: looked up on this machine, recorded by version,
 * and never bundled. Nothing here runs at render time. Speech happens once, at
 * authoring time, and its output is pinned as a WAV plus a transcript.
 *
 * The words themselves are attached in `words.ts`; this file only finds the
 * tools, states their install, and probes what this machine is missing.
 */
import { existsSync } from "node:fs";
import { relative, resolve, sep } from "node:path";
import { spawnSync } from "node:child_process";

export type SpeechToolName = "kokoro" | "whisper";

export type SpeechTool = {
  /** The Python module that must import. */
  module: string;
  /** Lowest version known to work; the report records what is installed. */
  atLeast: string;
  /** What the tool is for, in the words of the film. */
  purpose: string;
  /** The exact one-line install. */
  install: string;
  /** What downloading it costs, before it is approved. */
  weight: string;
  /** What a caller invokes, e.g. the bridge under `tools/`. */
  bridge: string;
};

export const SPEECH_TOOLS: Record<SpeechToolName, SpeechTool> = {
  kokoro: {
    module: "kokoro_onnx",
    atLeast: "0.4",
    purpose: "speak a narration locally (Kokoro-82M, Apache-2.0)",
    install: "python -m pip install kokoro-onnx soundfile numpy",
    weight: "~350 MB of model files, downloaded once by `tools/tts_kokoro.py --download`",
    bridge: "tools/tts_kokoro.py",
  },
  whisper: {
    module: "faster_whisper",
    atLeast: "1.0",
    purpose: "word timings for the clock, and the ASR gate on the master",
    install: "python -m pip install faster-whisper",
    weight: "~0.5 GB for small.en, downloaded once on first use",
    bridge: "tools/whisper.py",
  },
};

export type Python = { command: string; prefix: string[]; version: string };

/**
 * Python candidates on a normal machine. `py -3` is the Windows launcher; the
 * bare `python` is the common name elsewhere. `python3` is checked last because
 * on Windows it is often a broken Microsoft Store alias.
 */
function pythonCandidates(): string[] {
  return [process.env.PAPER_PYTHON, "python", "python3", "py -3"].filter(
    (value): value is string => Boolean(value),
  );
}

/** "py -3" → `{ command: "py", prefix: ["-3"] }`. Split on spaces, nothing fancy. */
export function pythonFrom(entry: string): { command: string; prefix: string[] } {
  const parts = entry.trim().split(/\s+/).filter(Boolean);
  const [command = "python", ...prefix] = parts;
  return { command, prefix };
}

/**
 * The first Python on this machine that is a real Python 3. `--version` writes
 * to stdout on 3.4+ and stderr on some builds, so both are read.
 */
export function findPython(candidates: string[] = pythonCandidates()): Python | undefined {
  for (const entry of candidates) {
    const { command, prefix } = pythonFrom(entry);
    let result: ReturnType<typeof spawnSync>;
    try {
      result = spawnSync(command, [...prefix, "--version"], { encoding: "utf8", timeout: 15_000 });
    } catch {
      continue;
    }
    if (result.status !== 0) continue;
    const text = `${String(result.stdout ?? "")}${String(result.stderr ?? "")}`.trim().split("\n")[0] ?? "";
    const match = /Python\s+(\d+)\./.exec(text);
    if (match && Number(match[1]) >= 3) return { command, prefix, version: text };
  }
  return undefined;
}

/**
 * A one-shot probe: for each module name, its version or null. Kept as a plain
 * string so it can be read and tested without running Python.
 */
export const PROBE_SCRIPT = [
  "import importlib.util as u, importlib, json, sys",
  "out = {}",
  "for name in sys.argv[1:]:",
  "    spec = u.find_spec(name)",
  "    if spec is None:",
  "        out[name] = None",
  "        continue",
  "    mod = importlib.import_module(name)",
  "    out[name] = str(getattr(mod, '__version__', 'unknown'))",
  "print(json.dumps(out))",
].join("\n");

/** Which of `modules` this Python can import, and at what version. */
export function probeModules(
  python: Python,
  modules: string[],
): Record<string, string | null> {
  const blank = Object.fromEntries(modules.map((name) => [name, null])) as Record<
    string,
    string | null
  >;
  let result: ReturnType<typeof spawnSync>;
  try {
    result = spawnSync(
      python.command,
      [...python.prefix, "-c", PROBE_SCRIPT, ...modules],
      { encoding: "utf8", timeout: 120_000 },
    );
  } catch {
    return blank;
  }
  if (result.status !== 0) return blank;
  const line = String(result.stdout ?? "").trim().split("\n").filter(Boolean).at(-1) ?? "";
  try {
    const parsed = JSON.parse(line) as Record<string, unknown>;
    return Object.fromEntries(
      modules.map((name) => [name, typeof parsed[name] === "string" ? (parsed[name] as string) : null]),
    );
  } catch {
    return blank;
  }
}

export type MissingTool = SpeechTool & { name: SpeechToolName; module: string };

export type SpeechStatus = {
  python: Python | null;
  /** Module name → version, or null when it cannot be imported. */
  modules: Record<string, string | null>;
  /** Tools whose module is absent, in a fixed order. */
  missing: MissingTool[];
  /** True when every speech tool imports. */
  ok: boolean;
};

export function speechStatus(): SpeechStatus {
  const found = findPython();
  const python: Python | null = found ?? null;
  const names = Object.keys(SPEECH_TOOLS) as SpeechToolName[];
  const modules = python ? probeModules(python, names.map((name) => SPEECH_TOOLS[name].module)) : {};
  const missing = names
    .filter((name) => !python || !modules[SPEECH_TOOLS[name].module])
    .map((name) => ({ name, ...SPEECH_TOOLS[name] }));
  return { python, modules, missing, ok: Boolean(python) && missing.length === 0 };
}

/**
 * The exact, copy-pasteable steps to make speech work. One line per missing
 * tool, then what Python was found. Never guesses a package name. Pass `only`
 * to name just the tools a step actually needs (a recorded film needs no
 * text-to-speech).
 */
export function installSteps(status: SpeechStatus, only?: SpeechToolName[]): string[] {
  const missing = only ? status.missing.filter((tool) => only.includes(tool.name)) : status.missing;
  const lines: string[] = [];
  if (missing.length === 0) return lines;
  lines.push("speech tools missing — install once, then re-run:");
  for (const tool of missing) {
    lines.push(`  ${tool.install}   # ${tool.module}: ${tool.purpose}`);
    lines.push(`  ${" ".repeat(tool.install.length)}     ${tool.weight}`);
  }
  lines.push(`python: ${status.python ? status.python.version : "not found on this machine"}`);
  lines.push("models and versions: tools/README.md");
  return lines;
}

export type SpeechProvider = "kokoro" | "elevenlabs";

export type VoiceLine = { id: string; text: string; hold?: number };

export type VoiceRequest = {
  film: string;
  source: "recorded" | "tts";
  /** tts only. */
  provider?: SpeechProvider;
  /** tts only, the provider's voice name. */
  voice?: string;
  speed?: number;
  /** tts only, `en-us` / `en-gb`. */
  lang?: string;
  lines: VoiceLine[];
};

/**
 * British voice names start with `b` (bm_george, bf_emma); everything else is
 * US. Same rule as the reference tool, so a voice id implies its language.
 */
export function languageFor(voice: string, explicit?: string): string {
  return explicit ?? (voice.startsWith("b") ? "en-gb" : "en-us");
}

/**
 * What to ask the capture step for. Derived only from the score's narration
 * plan and its clock lines: it invents no voice and no text.
 */
export function voiceRequest(
  filmId: string,
  narration: { source: string; provider?: string; voiceId?: string; speed?: number },
  lines: VoiceLine[],
): VoiceRequest {
  const source = narration.source === "tts" ? "tts" : "recorded";
  const request: VoiceRequest = { film: filmId, source, lines };
  if (source === "tts" && narration.voiceId) {
    request.provider = narration.provider === "elevenlabs" ? "elevenlabs" : "kokoro";
    request.voice = narration.voiceId;
    request.lang = languageFor(narration.voiceId);
    if (narration.speed) request.speed = narration.speed;
  }
  return request;
}

/** Every script word, in order, keeping the script's own spelling. */
export function scriptWords(lines: VoiceLine[]): string[] {
  return lines.flatMap((line) => line.text.split(/\s+/).filter((word) => word !== ""));
}

/** Repo-relative, POSIX separators, for messages. */
export function showPath(root: string, path: string): string {
  return relative(root, path).split(sep).join("/");
}

/** True when a narration plan points at a recorded file that is really there. */
export function recordedFileExists(root: string, file: string | undefined): boolean {
  return Boolean(file) && existsSync(resolve(root, file as string));
}
