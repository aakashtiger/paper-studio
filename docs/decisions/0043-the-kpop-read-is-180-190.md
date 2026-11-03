# 0043 — The Paper K-pop read is 180–190 wpm

**Status:** accepted · 4 Nov 2026
**Owners:** shared (`src/engine/preflight.ts`, `src/engine/story.ts`)
**Depends on:** 0025 (pace is a style number), 0040 (the measured read)

## Context

The first pace band was **140–150 wpm**. It was chosen to stop the 21-word
*Same Alarm*; it was not measured against a natural read. When `voice:story`
finally measured the fixture's words instead of its line windows, 70 words in
30 s at 140 script wpm produced **22.06 s of speech (73.5%)**, with an 8 s tail
of pauses. Slowing the TTS to fit the tail pushed the last line past 30 s.
There is no speed where a 30 s film of 70 words at 140 wpm passes both
`withinFilm` and 80% coverage: at that density the words already fill the film,
so any pause is air.

The reference reads **3.7 words/s ≈ 222 wpm**. The user chose **180–190 wpm**
for Paper K-pop as the next step: denser than 140, still below the reference,
and enough words to carry a 30 s film with pauses.

## Decision

- `DEFAULT_PACE.wpm` is **`[180, 190]`**.
- A 30 s film at this band carries **90–95 words**; a 60 s film carries **180–190**.
- `fixtures/story-min` keeps its declared **140–150** band: it is a historical
  model, and a film may declare its own pace. It is not the kpop default.
- The coverage floor stays **0.8** and the hole floor **2.5 s**. The fix is a
  denser script, not a lower floor.
- The `voice:story` fixture is still refused (73.5% at 140 wpm); a 180–190
  script is the passing case, and a new film scaffolded by `film:new` now writes
  the 180–190 band.

## Measured

- `test/preflight.test.ts` keeps the 70-word plan at its declared 140 band and
  adds a default-pace test: under `DEFAULT_PACE` (180–190) the same 70-word,
  30 s film is refused with `narration:wpm`.
- `test/film-new.test.ts` expects the story skeleton to write
  `{ wpm: [180, 190], medianShot: [2.5, 3] }`.
- 449 tests, typecheck clean.

## What this does not do, and is named

- **The fixture does not yet have a 180–190 twin.** The new band is exercised by
  the default-pace test and the story skeleton, not by a 90-word film read
  through `voice:story`. That passing fixture is the next step.
- **The style pack does not declare `pace` in `tokens.json` yet.** It is the
  engine default; a second style still declares its own in `story.json`.
- **The reference is 222 wpm.** 180–190 is a deliberate choice, not a copy.
