# 0019 — The clock is the score's, and the master's bounds are one constant

**Status:** accepted · 1 Nov 2026
**Owners:** technical
**Spec:** `docs/PRODUCTION-PLAN.md` (§ audio), `docs/GATES.md` (§ Voice and ASR, § The mix and the master)
**Blocks:** the gate, and the first real film's voice

## Context

Two defects of the same shape were found in one pass: a promise the film made in
one file and broke in another, with every audit green.

### 1. The voice ignored its own clock

`films/understudy/score.json` places six narration lines at **0.5, 5.1, 8.9,
12.0, 15.4 and 18.5 s**. The captions name those seconds. The shot plan puts
line 4 over `s04`, which starts at 12.0 s.

`tools/tts_kokoro.py` spoke the lines **butted end to end**, with a fixed `hold`
of silence between them. The resulting `voice.wav` was 14.41 s long: line 2 was
spoken at 3.4 s where the score said 5.1, line 4 at 8.2 where it said 12.0. The
film's narration occupied different seconds than its captions, its cut and its
score, by up to 3.8 s.

Nothing could see it. The mix proves the voice is present, that cues duck
beneath it and that no line is buried; the ASR proves the words are the
script's. `npm run voice` measured *word coverage*, which answers "are these the
right words", and nothing measured "are they in the right place".

### 2. The master's bound was written twice

`scripts/mix.ts` refused a film whose master gain passed ±8 dB.
`scripts/gate-7.ts` restated `MASTER_MAX_GAIN = 8` and
`LIMITER_MAX_LIMITING = 8` in its own constants. When the narration started
obeying the clock — six lines spread over 20 s leave real gaps where only the
room plays, and five cues that used to sit in silence now duck under words — the
premaster settled at **−22.0 LUFS** and the master needed **+9.1 dB**. The mix
accepted 9.1; the gate would have rejected it as "past a bound the mix
enforces". Two files, one number, one drift.

And the mix's own pass condition included the loudness tolerance but printed no
message for it. The first run of the corrected voice failed with
`exit=1` and a terminal that said the master was −14.6 LUFS and nothing else: the
only sentence naming the problem was the one nobody had written.

## Decision

1. **A line is spoken at the second the score gives it.** `VoiceLine` carries
   `start`; `tools/tts_kokoro.py` pads silence to that second before speaking,
   and **refuses** when a read would run past the next line's start, naming the
   line that overran. Concatenation is what produced the bug; placement is the
   fix, and the error is the guard.

2. **The clock is checked on the audio, not on the recogniser.**
   `scripts/voice.ts` scans the WAV for the first sample above −40 dBFS within
   ±0.25 s of each authored start, and requires the drift to be within **0.1 s**
   (`voice.json` → `clock`, `checks.clock`). Whisper's word onsets were measured
   against the samples on the same read and came back **0.32 s early** on a line
   that starts at 0.53 s; a check built on the recogniser would have failed a
   film whose audio is exact. Coverage and clock are different questions and
   both are now asked.

3. **`MASTER_MAX_GAIN` and `LIMITER_MAX_REDUCTION` live in
   `src/engine/loudness.ts`.** `scripts/mix.ts` and `scripts/gate-7.ts` both
   import them. `MASTER_MAX_GAIN` is **12** — the bound that protects the film
   is the limiter's measured reduction (8 dB), which says the master is
   compressing the programme; the gain bound only catches a mix that would need
   to be squashed by tens of dB.

4. **A check that can fail prints why.** The loudness and true-peak conditions
   now emit their own error naming the measured value, the target and, when it
   applies, the gain bound that stopped the master.

## Measurements

| | Before | After |
|---|---|---|
| narration, line 1 onset | 0.18 s (heard) | **0.53 s** measured, score says 0.50 |
| narration, line 4 onset | 8.22 s | **12.03 s** measured, score says 12.00 |
| worst line drift (audio) | −3.8 s | **+0.03 s** |
| voice.wav length | 14.41 s | **20.52 s** — the score's clock |
| master gain needed | — | **+9.1 dB**, inside the new 12 dB bound |
| master | −14.6 LUFS, `exit=1`, no message | **−14.1 LUFS / −1.9 dBTP**, `exit=0` |
| `npm test` | 1 failing (a "recorded narration" test on a TTS fixture) | **272/272** |

The failing test was itself a stale promise: it deleted `voice` from a fixture
that narrates with local TTS, where a file is not required. It now sets
`source: "recorded"` first, so it asks the question its own name asks.

## Consequence

- A film whose captions name seconds its voice never occupied is now a failing
  command rather than a green gate.
- The gate no longer holds a bound the mix does not.
- `scripts/film-chain.mjs` is the sequence, in the repository, and it derives the
  film id from the score's `id` field — `films/<id>/score.json` has the basename
  `score.json` for every film, which is how the first run of the chain came to
  look for `build/score/mix/master.wav`.
- Elevenlabs narration is unaffected: it is fetched once at authoring time and
  pinned as a WAV, but the *pinning* still has to obey the clock, and the same
  check reads it.
- A recorded take cannot be placed by padding: the clock check will report the
  drift, and the fix is to edit the read, not the score.
