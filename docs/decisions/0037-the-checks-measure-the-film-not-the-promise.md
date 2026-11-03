# 0037 — The checks measure the film, not the promise

**Status:** accepted · 4 Nov 2026
**Owners:** technical (`src/engine/preflight.ts`, `scripts/preflight.ts`, `scripts/film-chain.mjs`, `scripts/render-film.ts`)
**Depends on:** 0025, 0032, 0035, 0036

## Context

The independent audit of the pipeline found six places where a check was
measuring the *promise* rather than the film:

1. **Narration coverage was summed from the authored line windows.** `voice
   --apply` extends a line when the read runs past it, but never shortens an
   authored hold — so a line window could hold a long pause and still count as
   "speech". On *Same Alarm* the window sum said **23%** coverage and 13.6 s of
   speech; the measured word times say **13%** and **7.5 s**.
2. **The story and the score could be different lengths.** `story:wpm` divides by
   `story.duration`; the cut divides by the shots. Nothing compared the two.
3. **Shot boundaries were not on the frame grid.** A 2.55 s shot at 30 fps ends on
   frame 76.5; the renderer quantises it, so the score and the picture disagree
   by half a frame.
4. **The chain ran `embed` before `voice --apply`.** The renderer paints from
   `score-data.js`; on a new film the voice can move line starts and shot
   bounds, so the paint could use page data from the previous cut.
5. **`render:film` only checked that `score-data.js` existed.** A direct render
   without `embed` could paint stale data, and only the gate would catch it,
   after the paint.
6. **`style:measure` called raw scene changes "shots".** The detector found 12
   changes in *Same Alarm*'s 10-shot film and the first report called it 13
   shots. A scene change is not an authored cut.

## Decision

- **Coverage, holes and the first line come from measured word times**
  (`words.json`) when they exist. `measureWords()` merges the word intervals:
  the union is speech, the largest gap is the hole, the first start is the first
  line. The report says `measured words` or `line windows`, so a fallback is
  never mistaken for a measurement. The authored windows remain the fallback
  for a film with no recognised voice.
- **`checkStoryDuration()`** refuses a story and a score that are not the same
  film length.
- **`pacing:grid`** refuses a shot whose start or end is not on the film's frame
  grid. A reproduction warns; a new film is refused.
- **The chain runs `tests → voice → embed → audit → preflight`.** `embed` after
  the voice, never before it. The same move makes the score-data staleness test
  meaningful: `embed` no longer regenerates the file before the test compares
  it.
- **`render:film` regenerates `score-data.js` in memory and refuses a file that
  does not match.** The renderer paints from that file, so a stale one is a
  different film.
- **`style:measure --score <score.json>`** uses the score's authored shot
  boundaries for `shots` and `cuts`; the raw detector is reported separately as
  `sceneChanges`. Without `--score`, only scene changes are claimed.

## Measured

- **418 tests** pass (from 415); typecheck clean; `films/` untouched.
- *Same Alarm* preflight now prints:
  `narration 7 lines · 26 words · 26 wpm · speaks 13% · first line 0.5s ·
  longest hole 17.8s at 38.1s (measured words)`.
  The old window sum said 23% and 13.6 s. Both refuse the film; the new number
  is the one a viewer hears.
- `style:measure --ref films/same-alarm/same-alarm.mp4 --score
  films/same-alarm/score.json` reports **10 shots, median 6.25 s, 9
  cuts/minute**, and **12 scene changes/minute** beside them.
- The render guard is structural: a `score-data.js` that does not match
  `scoreDataText()` throws before a browser opens.

## What this does not do

- It does not measure **camera translation**, lighting direction, shadows or
  effects; those remain the style-measurement gap in 0036.
- It does not make scenes auto-fit the read; a scene that no longer fits is
  refused.
- It does not make the song path legal; `story.song` is still a marker.
- It does not derive assets from shots; cast coverage is the only staged asset
  check.
