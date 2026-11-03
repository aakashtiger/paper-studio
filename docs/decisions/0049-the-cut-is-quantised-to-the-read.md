# 0049 — The cut is quantised to the read, and captions are chunks

**Status:** accepted · 4 Nov 2026
**Owners:** shared (`src/engine/captions.ts`, `src/engine/treatment.ts`, `src/engine/audit.ts`), technical (`scripts/voice.ts`)
**Depends on:** 0035 (the measured clock), 0037 (measured claims), 0044 (coverage)

## Context

The 30 s Uber film needed 91 words in the 180–190 band. Five measured lines are
5.6–6.2 s long and their starts are 6.24, 12.02, 17.52 and 23.74 s — not
multiples of 1/30. The score audit requires every shot, narration line and
caption time to be on the frame grid, and the style caps a caption at **8
words**. A 20-word narration line therefore could not be one caption, and
`voice --from-story` wrote one caption per line. The first version of the film
failed the score audit with 15 captions for 5 lines, every caption off-grid and
every long line unscored.

## Decision

- **`voice --from-story --no-snap`** writes the measured clock without moving an
  authored shot. The cut is then set to the measured scene starts (0, 6.2, 12.0,
  17.5, 23.7) at the 0.1 s grid the score uses. The voice is not stretched; the
  largest move is 0.04 s.
- **Captions are chunks.** `splitCaption` cuts a line into ≤`maxWords` chunks;
  `voice --from-story` writes them as `<line>.<n>`, proportionally through the
  measured line window. `checkCaptions` and the score audit accept a chunk when
  its words are a **contiguous run** of the line and its window is inside the
  line. The SRT is written from the chunks; a line is covered when every line has
  at least one caption.
- **A chunk's read time is its own.** The old 1.8 s floor applies to a full
  line; a chunk needs `max(0.6 s, words × 0.22 s)`, so a one-word tail is not
  held for a sentence.
- **Reaction events are word-bound at the quantised line start.** `audit:reaction`
  still measures the event against the measured line start; the 0.1 s grid keeps
  it inside 0–3 frames.

## Measured

- `films/uber-model`: 30 s, 91 words, 182 script wpm, speed 1.14, **25.37 s
  voiced (84.6%)**, last word 28.94 s, five lines. Score starts 0/6.2/12.0/17.5/
  23.7; **15 captions**; `audit:reaction` 5/5 at **+0.0 frames**.
- `audit`/`film:review`: **PASS**; `gate:7` **PASS · 22 checks**.
- `test/captions.test.ts`: 8/8/4 split, a short line stays one chunk, a chunk is
  a contiguous word run, a reordered run is refused.

## What this does not do

- It does not use the measured per-word times for chunk boundaries; the chunks
  are proportional inside the line. `words.json` has the times when that is
  worth doing.
- It does not make a 30 s, nine-line film fit 180–190 wpm. Five lines is the
  passing shape; the 60 s nine-line proof is `fixtures/story-long`.
- It does not change the 8-word caption cap. The cap is a style limit; the
  chunking makes it usable.
