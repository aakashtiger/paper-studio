"""Word timings with local Whisper (faster-whisper). No account, no API.

    python tools/whisper.py --audio films/<id>/voice.wav --out build/<id>/heard.json
    python tools/whisper.py --audio films/<id>/understudy.mp4 --out build/<id>/asr-heard.json
    python tools/whisper.py --audio file.wav --model medium.en

Writes `[{"word": "phone", "start": 2.31, "end": 2.6}, ...]` — the words Whisper
heard and when. It does NOT decide the film's spelling: the engine attaches these
times to the script's own words (`src/engine/words.ts`), so a name or a number
keeps the script's spelling and only the timing comes from the recogniser.

Any input ffmpeg can read works. The model is small.en by default (fast, exact
enough for narration); base.en is faster, medium.en more exact.
"""
import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

norm = lambda word: re.sub(r"[^a-z0-9]+", "", word.lower())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--audio", required=True, help="the narration, mix or master to listen to")
    ap.add_argument("--out", required=True, help="the heard-words JSON to write")
    ap.add_argument("--model", default="small.en", help="base.en is faster, medium.en more exact")
    ap.add_argument("--language", default="en")
    args = ap.parse_args()

    source = Path(args.audio)
    if not source.exists():
        sys.exit(f"missing audio: {source}")

    from faster_whisper import WhisperModel

    print(f"listening with Whisper {args.model}...", flush=True)
    model = WhisperModel(args.model, device="cpu", compute_type="int8")
    segments, _ = model.transcribe(
        str(source),
        language=args.language,
        word_timestamps=True,
        beam_size=5,
        # faster-whisper 1.2.1's word aligner raises IndexError on a segment that
        # yields no tokens, and this film's master has music-free silence and
        # foley-only stretches that produce exactly such a segment. VAD drops
        # those segments before alignment. It is still deterministic: same WAV,
        # same model, same words — checked by running this twice and comparing.
        vad_filter=True,
        condition_on_previous_text=False,
    )
    heard = [
        {"word": word.word.strip(), "start": round(word.start, 3), "end": round(word.end, 3)}
        for segment in segments
        for word in (segment.words or [])
        if norm(word.word)
    ]
    if not heard:
        sys.exit("Whisper heard no words — is the audio silent?")

    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(heard, indent=0) + "\n", encoding="utf-8")
    duration = heard[-1]["end"]
    print(f"{out}  {len(heard)} words heard, last at {duration:.2f}s")


if __name__ == "__main__":
    main()
