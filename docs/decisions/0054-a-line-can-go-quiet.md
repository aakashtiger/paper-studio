# 0054 - A line can go quiet, so a narrated short can have a quiet 3 s

**Status:** accepted, 2026-11-05.
**Depends on:** 0025 (the 3 s sound-contrast rule), 0035 (the measured line
clock), 0053 (P0.9 is a gate row).

## The problem

P0.9 asks the quietest 3 s of a film to sit at least 15 LU under the loudest
3 s, and the narration contract asks for no hole over 2.5 s. A five-line,
30 s explainer speaks almost the whole film. Its 3 s windows measured 2.1 LU
apart and its LRA was 1.9 LU, so `soundContrast` and `lra` failed by
construction: the two rules could not both hold in a continuous read.

The obvious fixes were both wrong:

- write a 3 s hole -> `preflight` refuses a narration hole over 2.5 s;
- lower the whole master -> the contrast is relative and does not move.

## Decision

**A narration line may declare `gainDb`, between -24 and 0 dB.** The mix applies
it to the voice before the highpass and before the duck key, with a 40 ms fade
at each edge so the line cannot click. Zero or absent is the old behaviour.

The words are still spoken, still timed, still captioned and still heard by
ASR; only the level moves. That is how a narrator leans in. The mix report names
every applied line gain, so a quiet stretch cannot be an accident.

The schema lives in `NarrationLineSchema`; the DSP is
`applyVoiceGains` in `src/engine/mix.ts`; `scripts/mix.ts` passes the score's
line gains to the bus.

## Measured on *The Uber Cut*

v04 ("The app sells delivery, freight, advertising and memberships") is marked
`gainDb: -16`. Its words stay where they were (17.5-23.3 s), so there is no
hole. The mix changes only its level:

| before | after |
|---|---|
| short-term contrast **2.1 LU** | **17.8 LU** (loudest -13.4, quietest -31.2) |
| LRA **1.9 LU** | **16.5 LU** |
| master -14.0 LUFS / -1.9 dBTP | -14.1 LUFS / -1.9 dBTP |

ASR still hears 91/91 script words on the delivered file. The quiet line is
clean digital speech, not speech under noise, so Whisper's normalisation keeps
it legible.

## Proof

```
npm run mix -- films/uber-model/score.json
node --import tsx --test test/mix.test.ts
npm run asr -- films/uber-model/score.json
npm run gate:7 -- films/uber-model/score.json
```

`test/mix.test.ts` proves a -16 dB line loses about 16 dB in its window and the
line before it does not move.

## What this does not change

- It does not make a silent film pass: a line gain cannot fill a hole, and the
  2.5 s narration-hole rule is unchanged.
- It is not music and not a bed. It is one line, at one level, written in the
  score.
- It does not replace the delivered-file measurement. P0.9 still reads the
  master and the delivered file; this only gives the mixer a legal quiet
  passage to measure.
