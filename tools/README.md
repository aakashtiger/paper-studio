# Speech tools

Voice and word timing are **local** and **external**. They are resolved on this
machine the way `ffmpeg` is, and they are **never npm dependencies**: a native
model in `node_modules` would be a maintenance liability for two owners and
would not survive a fresh clone.

Nothing here runs at render time. Speech happens once, at authoring time; its
output is pinned as a WAV plus a transcript, and the render only reads those.

| Tool | Module | Licence | For | Cost |
|---|---|---|---|---|
| [Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M) | `kokoro_onnx` | Apache-2.0 | speak a narration locally | ~350 MB, once |
| [faster-whisper](https://github.com/SYSTRAN/faster-whisper) | `faster_whisper` | MIT | word timings + the ASR gate | ~0.5 GB, once |

## Install (once, ~1 GB over the network)

```bash
python -m pip install -r tools/requirements.txt
python tools/tts_kokoro.py --download          # the Kokoro model files
```

`npm run voice` and `npm run asr` name these exact steps if a module is missing
and exit without touching the network. The render path never goes online.

## Commands

```bash
python tools/tts_kokoro.py --list              # the voices that narrate well
python tools/tts_kokoro.py --request build/<id>/voice-request.json \
    --out films/<id>/voice.wav --sentences films/<id>/sentences.json
python tools/whisper.py --audio films/<id>/voice.wav --out build/<id>/heard.json
```

The engine drives these: `npm run voice -- <score>` writes the request, runs the
bridge, then attaches the heard times to the script's own spelling in
`src/engine/words.ts`. `npm run asr -- <score>` runs `whisper.py` again, this
time on the delivered master, and compares what it heard against the script.

## Determinism

Same WAV in, same words out: Whisper runs with `beam_size=5`, CPU, `int8`, and
the voice-activity filter **on** (faster-whisper 1.2.1's word aligner raises on a
segment with no tokens, which this film's foley-only stretches produce). Running
it twice on the same WAV returns the same words and the same times. The clock
derived from those words is a pure function.
The narration WAV itself is written once and pinned by hash; it is not
regenerated on a normal render.

## Versions

The engine records the module versions this machine actually has into the voice
and ASR reports (`toolVersions`). A report names the exact tool it was made
with, so a later disagreement is a version question, not a guess.
