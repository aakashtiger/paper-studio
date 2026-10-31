"""Speak a narration locally with Kokoro-82M (Apache-2.0). No account, no API.

    python tools/tts_kokoro.py --request build/<id>/voice-request.json \
        --out films/<id>/voice.wav --sentences films/<id>/sentences.json
    python tools/tts_kokoro.py --list          the voices that narrate well
    python tools/tts_kokoro.py --download      fetch the model files once (~350 MB)

It reads the request the engine wrote (the lines in order, the voice, the speed)
and writes one 48 kHz stereo WAV plus a sentence record with the exact start and
end of every line. The voice is spoken once, here, at authoring time; the render
never runs this and never touches the network.

Write numbers the way they are SAID ("nineteen nineteen", "forty gallons"): the
recogniser and the clock hear what is spoken, the screen text is separate.
"""
import argparse
import json
import os
import subprocess
import sys
import urllib.request
from pathlib import Path

try:
    import numpy as np
except ImportError:
    sys.exit("numpy is missing — python -m pip install numpy")

HOME = Path(os.environ.get("PAPER_HOME", Path.home() / ".paper-studio"))
KDIR = HOME / "kokoro"
FILES = {
    "kokoro-v1.0.onnx": "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx",
    "voices-v1.0.bin": "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin",
}
# The voices worth trying first. All 50+ are in the Kokoro VOICES list.
GOOD = {
    "bm_george": "UK male, documentary",
    "bm_fable": "UK male, storyteller",
    "am_michael": "US male, steady",
    "am_onyx": "US male, low",
    "am_fenrir": "US male, deeper",
    "am_puck": "US male, lively",
    "af_heart": "US female, warm (the best overall)",
    "af_bella": "US female, bright",
    "af_nicole": "US female, soft/close",
    "bf_emma": "UK female, calm",
}
SR = 24_000


def ensure_models():
    KDIR.mkdir(parents=True, exist_ok=True)
    for name, url in FILES.items():
        path = KDIR / name
        if path.exists() and path.stat().st_size > 1_000_000:
            continue
        print(f"downloading {name} (once)...", flush=True)
        tmp = path.with_suffix(".part")
        urllib.request.urlretrieve(url, tmp)
        tmp.rename(path)


def trim(audio):
    """Drop the leading and trailing silence, keeping a small breath."""
    loud = np.where(np.abs(audio) > 0.01)[0]
    if len(loud) == 0:
        return audio
    return audio[max(0, loud[0] - int(0.03 * SR)): loud[-1] + int(0.09 * SR)]


def write_wav(out, samples):
    """One 48 kHz stereo PCM WAV, through ffmpeg, exactly as the mixer expects."""
    peak = float(np.abs(samples).max()) or 1.0
    samples = samples / peak * 0.89
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", str(SR), "-ac", "1", "-i", "-",
         "-ar", "48000", "-ac", "2", str(out)],
        input=(samples * 32767).astype("<i2").tobytes(),
        check=True,
    )


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--request", help="the engine's voice-request.json")
    ap.add_argument("--out", help="the narration WAV to write")
    ap.add_argument("--sentences", help="the sentence record to write")
    ap.add_argument("--list", action="store_true")
    ap.add_argument("--download", action="store_true")
    args = ap.parse_args()

    if args.list:
        for voice, description in GOOD.items():
            print(f"{voice:12s} {description}")
        print("(all voices: https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md)")
        return

    ensure_models()
    if args.download:
        print(f"models ok: {KDIR}")
        return
    if not args.request or not args.out:
        sys.exit("usage: tts_kokoro.py --request <json> --out <wav> [--sentences <json>]")

    request = json.loads(Path(args.request).read_text(encoding="utf-8"))
    if request.get("source") != "tts":
        sys.exit(f"voice request source is {request.get('source')!r}, not 'tts'")
    voice = request.get("voice")
    if not voice:
        sys.exit("voice request has no voice")
    speed = float(request.get("speed", 1.0))

    from kokoro_onnx import Kokoro

    k = Kokoro(str(KDIR / "kokoro-v1.0.onnx"), str(KDIR / "voices-v1.0.bin"))
    lead = np.zeros(int(0.30 * SR), np.float32)
    pieces = [lead]
    position = len(lead)
    sentences = []
    for line in request["lines"]:
        audio, _ = k.create(line["text"], voice=voice, speed=speed, lang=request.get("lang", "en-us"))
        audio = trim(np.asarray(audio, np.float32))
        sentences.append({
            "id": line["id"],
            "text": line["text"],
            "start": round(position / SR, 3),
            "end": round((position + len(audio)) / SR, 3),
        })
        pieces.append(audio)
        position += len(audio)
        gap = np.zeros(int(float(line.get("hold", 0.3)) * SR), np.float32)
        pieces.append(gap)
        position += len(gap)
        print(f"{sentences[-1]['start']:7.2f} {sentences[-1]['end']:7.2f}  {line['text']}", flush=True)

    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    write_wav(out, np.concatenate(pieces))

    if args.sentences:
        record = {
            "film": request.get("film"),
            "voice": voice,
            "speed": speed,
            "provider": "kokoro",
            "duration": round(position / SR, 3),
            "sentences": sentences,
        }
        Path(args.sentences).write_text(json.dumps(record, indent=2) + "\n", encoding="utf-8")

    print(f"{out}  {position / SR:.2f}s  {len(sentences)} sentences")


if __name__ == "__main__":
    main()
