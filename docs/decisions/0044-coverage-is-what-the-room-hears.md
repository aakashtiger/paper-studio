# 0044 — Coverage is what the room hears

**Status:** accepted · 4 Nov 2026
**Owners:** shared (`src/engine/voice-activity.ts`, `src/engine/preflight.ts`)
**Depends on:** 0037 (measured words), 0040 (the voice is spoken from the story), 0043 (180–190 wpm)

## Context

The coverage floor is 0.8: a narrated short speaks for at least 80% of itself.
It was measured as the union of Whisper's **word intervals** — the seconds
between a word's start time and its end time. That is a record of *words*, not
of *speech*. Each interval begins after the attack and stops before the decay,
and the short gaps between words inside a sentence are excluded. A perfectly
continuous read measures about 75% while a listener hears no hole at all.

The 180–190 band exposed this. `fixtures/story-min` (30 s, 70 words, 140 wpm)
measured 73.5%. A 91-word / 30 s version (182 wpm) fitted the film only when
its word-union said 75.5%, and the speed that raised the word-union past 80%
pushed the last word past 30 s. There was no speed where both checks passed,
because the metric and the listener disagreed.

The audio itself was never ambiguous. At speed 1.02 the 30 s read was **voiced
for 84%** of the film; `silencedetect` found only 0.4 s sentence pauses. The
word-union said 75.5%. The 8.5-point gap was the metric.

## Decision

- `src/engine/voice-activity.ts` measures the **audio**: ffmpeg's
  `silencedetect` at **−35 dBFS** for at least **0.3 s**. Everything else inside
  the film is voice. A short articulation is not a pause; a sentence pause is.
- `voice:story` and `voice` record `voiced` (and `silence`) in the report and
  in `films/<id>/words.json`. `preflight` uses `voiced` when it is present, or
  measures the stem `words.json` names. The **coverage denominator stays the
  film duration**, and the floor stays **0.8**.
- Word times remain the authority for **who spoke**, for the **first word**,
  for **holes** and for the cut. Only the coverage question moved to the audio.

## Measured

- `fixtures/story-long` — 60 s, 9 lines, 5 beats, **189 words / 189 wpm** —
  passes every check: voiced **49.2 s (82%)**, last word **59.28 s**, longest
  hole **0.72 s**, **188/189** words heard, longest detected silence **0.47 s**.
  The command is `voice:story -- --story fixtures/story-long/story.json`.
- `fixtures/story-min` (30 s, 140 wpm) is still refused: its voice ends at
  22.06 s, so the acoustic coverage is ~73%, and the film stops talking.
- **A 30 s film at 180–190 wpm with nine spoken lines is not provable.** Nine
  line breaks alone are ~4 s of the 30 (13%), before the sentence pauses. The
  band needs 90–95 words; the line structure leaves no room for them. A 30 s
  film in this band needs fewer beats (five, not nine) or a faster read. That is
  a writing constraint, not a lower floor, and it is named rather than hidden.
  The first film is 60 s, and the 60 s proof is the one that matters now.

## Tests

`test/voice-activity.test.ts` (5) fixes the arithmetic: two silences, a silence
that crosses the end of the film, an unclosed silence, no silence, and an audio
file shorter than the film. `test/story.test.ts` adds the 189-word model and
refuses a warning in it. **447 tests**, typecheck clean.

## What this does not do

- It does not make the 30 s, nine-line story pass; see above.
- It does not replace word times for the clock, the hole or the cut.
- It does not auto-fit scenes to the read (still open, P0.1).
- It does not change the −35 dB / 0.3 s thresholds per style. They are declared
  once; a style with a different room tone will need its own, and that is a
  contract change.
