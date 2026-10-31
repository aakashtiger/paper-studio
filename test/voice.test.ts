import test from "node:test";
import assert from "node:assert/strict";
import {
  installSteps,
  languageFor,
  pythonFrom,
  scriptWords,
  SPEECH_TOOLS,
  voiceRequest,
  type SpeechStatus,
} from "../src/engine/voice.js";

test("pythonFrom splits a launcher from its flags", () => {
  assert.deepEqual(pythonFrom("python"), { command: "python", prefix: [] });
  assert.deepEqual(pythonFrom("py -3"), { command: "py", prefix: ["-3"] });
  assert.deepEqual(pythonFrom("C:\\Python\\python.exe"), {
    command: "C:\\Python\\python.exe",
    prefix: [],
  });
});

test("a British voice name implies en-gb, otherwise en-us, and an explicit wins", () => {
  assert.equal(languageFor("bm_george"), "en-gb");
  assert.equal(languageFor("bf_emma"), "en-gb");
  assert.equal(languageFor("am_michael"), "en-us");
  assert.equal(languageFor("af_heart"), "en-us");
  assert.equal(languageFor("am_michael", "en-gb"), "en-gb");
});

test("every speech tool names its module, install and weight", () => {
  for (const tool of Object.values(SPEECH_TOOLS)) {
    assert.ok(tool.module.length > 0);
    assert.ok(tool.install.startsWith("python -m pip install"));
    assert.ok(tool.install.includes(tool.module.replace(/_/g, "-")));
    assert.ok(tool.weight.length > 0);
    assert.ok(tool.bridge.startsWith("tools/"));
  }
});

test("a tts request carries the provider, voice and speed; a recording carries none", () => {
  const tts = voiceRequest(
    "understudy",
    { source: "tts", provider: "kokoro", voiceId: "af_heart", speed: 1.05 },
    [{ id: "v01", text: "Every night.", hold: 0.9 }],
  );
  assert.equal(tts.source, "tts");
  assert.equal(tts.provider, "kokoro");
  assert.equal(tts.voice, "af_heart");
  assert.equal(tts.speed, 1.05);
  assert.equal(tts.lang, "en-us");
  assert.deepEqual(tts.lines, [{ id: "v01", text: "Every night.", hold: 0.9 }]);

  const recorded = voiceRequest("understudy", { source: "recorded" }, []);
  assert.equal(recorded.source, "recorded");
  assert.equal(recorded.voice, undefined);
  assert.equal(recorded.provider, undefined);
});

test("an unknown provider falls back to the local kokoro, never a cloud one", () => {
  const request = voiceRequest("f", { source: "tts", voiceId: "af_heart" }, []);
  assert.equal(request.provider, "kokoro");
});

test("scriptWords keeps the script's own spelling, in order", () => {
  assert.deepEqual(
    scriptWords([
      { id: "v01", text: "Every night, the cue lamp calls one name." },
      { id: "v02", text: "Tonight, it called Nova." },
    ]),
    ["Every", "night,", "the", "cue", "lamp", "calls", "one", "name.", "Tonight,", "it", "called", "Nova."],
  );
});

test("installSteps is silent when nothing is missing", () => {
  const status: SpeechStatus = { python: { command: "python", prefix: [], version: "Python 3.11.9" }, modules: {}, missing: [], ok: true };
  assert.deepEqual(installSteps(status), []);
});

test("installSteps names the exact install and the Python it found", () => {
  const status: SpeechStatus = {
    python: { command: "python", prefix: [], version: "Python 3.11.9" },
    modules: {},
    missing: [{ name: "whisper", ...SPEECH_TOOLS.whisper }],
    ok: false,
  };
  const lines = installSteps(status);
  const text = lines.join("\n");
  assert.ok(text.includes(SPEECH_TOOLS.whisper.install));
  assert.ok(text.includes("faster_whisper"));
  assert.ok(text.includes("Python 3.11.9"));
});

test("installSteps can name only the tool a step needs", () => {
  const status: SpeechStatus = {
    python: { command: "python", prefix: [], version: "Python 3.11.9" },
    modules: {},
    missing: [
      { name: "kokoro", ...SPEECH_TOOLS.kokoro },
      { name: "whisper", ...SPEECH_TOOLS.whisper },
    ],
    ok: false,
  };
  const text = installSteps(status, ["whisper"]).join("\n");
  assert.ok(text.includes("faster-whisper"));
  assert.ok(!text.includes("kokoro-onnx"));
});

test("installSteps says so when there is no Python at all", () => {
  const status: SpeechStatus = {
    python: null,
    modules: {},
    missing: [{ name: "kokoro", ...SPEECH_TOOLS.kokoro }],
    ok: false,
  };
  assert.ok(installSteps(status).join("\n").includes("not found on this machine"));
});
