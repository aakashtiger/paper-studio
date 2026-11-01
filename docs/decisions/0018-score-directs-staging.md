# 0018 — The score directs the staging, the painter owns the staging

**Status:** accepted · 1 Nov 2026
**Owners:** technical (`src/engine/treatment.ts`, `src/engine/score-data.ts`) and
creative (`styles/paper-kpop/canvas/recipes.js` authoring surface untouched)
**Pack:** `styles/paper-kpop/` 0.1.0 · painter revision `sha256:fa25fe52...`

## Context

The first real picture of *The Understudy* was painted by a backend that read
only the shot's caption text. Three things followed from that, all of them wrong
in the same way:

- **The cast was inferred from copy.** The wide shot branched on `/TWO/` in
  `content.body`, so renaming a card silently re-cast the shot, and a shot that
  said "the wings are empty" still drew two performers.
- **The performance was invented.** Every portrait got the same two-beat
  performance whether the film asked for it or not, so the score could not say
  "she stops" and be obeyed.
- **The camera was a constant.** Each recipe moved the frame by a number typed
  into the painter, not by the shot's `camera`.

A score that cannot direct the picture is a description of a film, not a film
contract.

## Decision

Three fields of the film score are **directing**, and the painter must obey them:

| Field | On the shot | Meaning |
|---|---|---|
| `direction.cast` | `["Nova", "Mira"]` | who is in this frame. Absent = the recipe's own staging; `[]` = nobody, which is a thing a film needs to be able to say |
| `direction.events[]` | `{ t, kind, who?, pose?, breakdown?, note, quiet? }` | what happens, when. A `pose` event is a keyframe: `pose` is the pose held from `t`, `breakdown` is the pose it comes from |
| `camera` | `{ move, from, to, ease }` | how the frame moves |

They travel through resolution untouched (`ResolvedFilmShot.direction`,
`.camera`) and are embedded into the page by `src/engine/score-data.ts`, so the
painter sees exactly what the resolver validated.

The painter reads them through four helpers, each of which is one rule:

- `shotCast(shot, fallback)` / `hasCast(...)` — the cast, or the recipe's
  fallback when the score says nothing.
- `scoreKeys(shot, name, d, entry)` — a character's keyframes from the shot's own
  `pose` events. No events means no invented performance: the character holds
  `entry` and the rig's living hold does the breathing.
- `eventTime(shot, kind)` — the time of the shot's first event of a kind, so a
  hand enters when the score says it enters; the recipe keeps a default only for
  a shot that declares no such event.
- `shotCam(shot, lt, d, x, y, tilt, t)` — the camera from the shot's `camera`,
  driven by the shot's own local time.

A pose the score names that the character's pose library does not have is an
**error**, not a silent fallback to the first pose.

**Named gap: `camera.ease` is not yet honoured.** `shotCam` interpolates every
move with the pack's own smoothstep and ignores the shot's `ease` string, and the
schema takes `ease` as any string, so `"easeOut"` in a score is currently a note
rather than a direction. It is left open deliberately for this pass: honouring it
changes the motion curve of every existing shot, which is a picture change and a
full re-render, and the honest place to do that is the pack revision that authors
the next film (0.2.0), where the curves are chosen for the new shots and the
motion floor is re-measured against them. Until then the rule for a score author
is: **do not write an `ease` you expect to be obeyed.**

## What the painter still owns

Staging is the painter's: where a figure stands, how the set is cut, where the
paper card sits, what the light does. The score says *who is on stage and what
they do*; it does not say *at which pixel*. That split keeps rule 7 intact — the
engine hardcodes no shot — while letting a director direct.

Three rules constrain the staging half, all learned from the first 1920 px film:

1. **A title card is laid out at the frame, not through the camera.** Text drawn
   inside the camera transform is scaled by the camera; a 16% orbit pushed a card
   past the top edge. Cards are drawn after the camera closes, inside the pack's
   64 px margin.
2. **Type is measured with the measure that draws it.** `fitSize` uses
   `TY.width` (per character, with the same tracking the draw applies), keeps the
   pack's 14 px floor, and `wrapLines` breaks a line into two balanced lines
   rather than shrinking below the floor. A string that cannot be set at the
   floor in its box is a copy problem the type audit reports, not an overflow.
3. **A label that inflates stays inside the safe area.** The slam drew its
   sticker at 155 % on entry, which put "THE UNDERSTUDY" 80 px off both edges of
   a 1,920 px frame for the first third of a second. A move may be as fast as it
   likes; the largest size it reaches is bounded by the safe rectangle.

## The painter marks the film's words

The type audit has to tell the film's copy from set dressing, because a costume
name tag drawn by the rig is not a sentence anyone has to read and must not be
held to the copy floor. The painter is the only thing that knows which is which,
so it says so:

- a draw that puts a **slot string** on screen passes `copy: true`;
- the paint probe records that flag on the box it measures;
- `audit:type` cross-checks the mark against the score — a marked run must be a
  piece of that shot's slot text, and a shot that has a slot must show a marked
  box — so marking arbitrary text does not buy a pass, and a painter that
  silently stops marking fails instead of skipping the check.

The flag travels down through a helper that draws copy with an inner type call
(`TY.sticker` passes `copy` to the type it sets), so a label is measured as copy
rather than as decoration.

## What does not change

The recipe files, `tokens.json`, `capabilities.json`, the card, the fonts and the
reference frames are **byte-identical**. The authored surface a blind author
reads did not move, so the sealed S1c blind (*Last Cue*) remains the live blind
answer; only `canvas/recipes.js` — the backend that draws it — moved.

## Evidence

| | |
|---|---|
| score with no direction | `npm run film` accepts it (the fields are optional) and the painter falls back to the recipe's staging |
| a shot with `cast: []` | paints an empty stage (s03, *The Understudy*) |
| a `pose` event with `breakdown` | is one keyframe pair; `poseAt` interpolates, the rig owns the spine |
| a pose the library lacks | resolution error `pose_unknown`, not a fallback |
| card clipping | `npm run storyboard -- films/understudy/score.json` painted the defect before the fix and is clean after it |
| type overflow | `fitSize`/`wrapLines` measured against the card; `audit:type` checks the drawn box inside the safe area on the delivered frames |
| copy floor | `npm run audit:type -- films/understudy/score.json --step 0.2` — 151 frames, 348 boxes, **257 of them copy**, 0 outside the safe area, 0 under the 69 px floor, 0 mis-marked, 0 shots unmarked |
| the slam bound | the same audit caught the 155 % sticker 195 px outside the safe area at 12.00 s, and passes at 124 % |
| a `static` camera | `audit:frames` failed `noLongHolds` on the slam: the paper settled at 0.45 s and the frame then held 24 frames (0.8 s) to the cut. The score now says `push_in` 1→1.12; the shot's last frame pair differs by **2.86** luma counts against a floor of 0.35 |

## Consequences

- A film changes its staging by editing the score, not the painter. Nothing about
  *The Understudy*'s direction lives in `styles/`.
- The blind's authoring surface stays frozen while the backend improves; the pack
  hash moves and is re-sealed, and the report says which revision drew what.
- `audit:motion` still measures frame difference, not per-character centre of
  mass. A pose change that moves a single limb is legal and quiet; that gap is
  named in `docs/STATUS.md` rather than papered over.
