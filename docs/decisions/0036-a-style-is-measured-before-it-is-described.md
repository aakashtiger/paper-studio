# 0036 — A style is measured before it is described

**Status:** accepted · 2 Nov 2026
**Owners:** technical (`src/engine/style-measure.ts`, `scripts/style-measure.ts`), shared with the creative owner for the bands it sets
**Depends on:** 0003 (the style pack), 0025 (the film is written before it is shot)

## Context

The video that prompted this is not really about 3D, ink or bean heads. Its
method is measurement. It downloaded 20 reference shorts, forced frame-by-frame
analysis (32,000 frames), cut them into 549 contact sheets at 2 s each, tracked
the camera with phase correlation, found every hard cut, and measured brightness,
contrast and saturation on every short. Its own line is the lesson:

> Don't ask Claude what it thinks of a video. Make it measure. You can't
> recreate an opinion. You can recreate a number.

The repository already **encodes** a style extremely well. `styles/paper-kpop/`
has a 27-decision contract (`docs/specs/0003`): medium, colour, type, layout,
motion, sound, recipes, formats, provenance, a blind protocol and a seal. It has
reference frames, an evidence table and a card. What it did not have is the step
*before* the encoding: a repeatable way to read a reference into numbers, and a
way to measure our frames against it. The Paper K-pop extraction was a one-off
autopsy of the author's own 4,699-frame film; the process is recorded in prose,
not a command.

The video's own look-match loop also found its measuring tool was wrong: it
reported the camera almost still 80% of the time, when it was moving 65% of the
time — the tool could not see slow moves. A measurement is only useful if it is
itself checked.

## Decision

**`npm run style:measure` measures any video or folder of frames, and can compare
a specimen against a reference in the same units.**

It uses ffmpeg only; no new dependency. Nothing in it knows what paper, 3D, ink
or K-pop is.

| metric | how | what it says |
|---|---|---|
| luma | `signalstats` `YAVG` | how bright |
| contrast | `YMAX - YMIN` per frame | how hard the light is |
| saturation | `SATAVG` | how strong the colour |
| edge density | `edgedetect` then `YAVG` | how much line / ink / cut edge |
| movement | `tblend=difference` then `YAVG` | how much changes frame to frame |
| cuts | `select='gt(scene,0.03)',showinfo` | where the film cuts |
| shot lengths | the cut times and the duration | median, min, max, cuts/minute |
| palette | `palettegen`, six distinct colours | the colours a frame is made of |

- `--ref <dir|video>` writes `bible.json` and `STYLE-BIBLE.md`.
- `--specimen <dir|video>` writes `match.json`, `MATCH.md` and (for frame sets)
  `pairs.png` — reference and specimen side by side, measured, not scored.
- `--sheets` writes the video's own 2 s / 60-frame contact sheets.
- A delta is `specimen - reference`; palette distance is a distance (0-441), not
  a signed delta.
- The tool **does not pass or fail** a style. A style declares its bands in
  `tokens.json` / `capabilities.proof`; this tool measures the gap.

## Measured proof

The pack's six reference crops against ten frames of *Same Alarm*'s storyboard:

| metric | reference | specimen | delta |
|---|---|---|---|
| luma | 145.75 | 134.56 | **−11.19** |
| contrast | 245.83 | 217.90 | **−27.93** |
| saturation | 39.84 | 15.41 | **−24.43** |
| edges | 10.29 | 8.57 | **−1.72** |
| palette distance | — | — | **64.05** |

That is the video's "ours looked dull" as numbers instead of an opinion: the
storyboard is darker, lower contrast, and much less saturated than the reference
crops. It is not a verdict — the reference is six crops, not a 60 s film, and the
pairs are matched in filename order, not by shot — but it is a target to move.

The video path was measured on the delivered *Same Alarm*. Without `--score`
the raw scene detector finds **12 changes** in a **10-shot** film: a change is
not a cut. With `--score` the report uses the score's own boundaries —
**10 shots, median 6.25 s, 9 cuts/minute** — and keeps the 12 raw scene changes
beside them. Movement **1.06 / 255**, palette
`#27201b #43372d #564636 #7f736b #c9b89c #e4d4b7`. A 4 s excerpt with `--sheets`
wrote three contact sheets of 60 frames each.

The first version of the cut pass captured only stdout; `showinfo` writes to
stderr, so it found **0 cuts** and called the film one 60 s shot. `runBinary`
returns both, and the second run found 12 scene changes — which the first report
then misread as 13 shots. `--score` makes the distinction explicit. That is the
same class of defect the video found in its own camera tool, and it is why the
measured numbers are checked against a known film before they are trusted.

## What this does not do, and is named

- **No per-region or semantic measurement.** It cannot say where the ink is,
  which direction the key light comes from, whether a face reads, or whether a
  hand is a plank. The video's seven agents measured those with crops, masks and
  side-by-side frames; this is global per-frame measurement.
- **No reference corpus download.** It measures what it is given. It does not
  fetch a channel's 20 shorts, and should not: rights and provenance are the
  pack's `capabilities.evidence` (D24), not a scraper's.
- **No automatic token derivation.** The numbers do not write `tokens.json`; a
  person or an LLM proposes values, and the pack's 27 decisions decide whether
  they are legal.
- **No pass/fail bands yet.** `capabilities.proof` names metrics; it does not yet
  carry measured bands that `style:measure` can enforce.
- **Pairing is by filename order**, not by shot or subject. A proper look-match
  pairs the same moment (a portrait with a portrait, a wide with a wide).
- **The frame-set aspect is `mixed`** when the crops differ; the first crop's
  shape is not the style's format.

## Next, if the user wants it

1. `style:measure --pairs <map.json>` — pair reference and specimen by subject,
   not by index.
2. `style:measure --regions` — measure a face box, a sky box, a text box, so the
   report can say *where* the difference is.
3. `style:measure --bands` — read `capabilities.proof.metrics`, and print
   `within / outside` per metric. The bands are authored, never invented.
4. A fresh-verifier look-match loop: `MATCH.md` plus `pairs.png` to an independent
   reviewer, numbered fixes, one owner per file — the video's 7-agent method,
   reduced to the parts this repository can enforce.
