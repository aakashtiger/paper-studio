# 0056 - The visual contract: exact words, one image, a body that earns its frame

**Status:** accepted, 2026-11-05.
**Depends on:** 0051 (visual brief), 0053 (identity frame report), 0055
(the rebuilt Uber film).

## The problem

The 0055 film passed the identity gate and still failed as direction:

- a shot answered a whole narration line, not the moment being spoken;
- `network_web`, `app_menu`, `phone_route` and `city_route` each appeared twice,
  and the same car-through-tiles appeared three times;
- characters were staged in every shot, including diagrams where they had
  nothing to do, so they read as floating stickers;
- at 0:16 the caption sat over a performer's face;
- the rig's far hand was painted behind the torso and disappeared; both hands
  were tiny blobs with no readable gesture.

`visual:check` only asked whether a shot had *a* brief and whether its recipe
could draw *some* subject. It allowed four uses of one recipe in a ten-shot film
and never compared the image to the exact words.

## Decision

### 1. A shot quotes the words it answers

`shots[].visual.phrase` is a **contiguous run of words from the linked line**.
`visual:check` refuses a missing phrase, a phrase that skips or reorders words,
a phrase shorter than two words, a phrase that is most of the line, and a phrase
that shares no content word with `shows + action + focus`. It also resolves the
phrase against the measured `words.json`: the phrase's first and last word must
land inside the shot's own start/end (0.2 s tolerance), or the image is on screen
before or after the voice. The line is the contract; the phrase is the moment.

### 2. One idea, one image

`shots[].visual.device` names the single concrete device that makes the image
its own. `visual:check` refuses:

- a missing device, or a device that appears nowhere in the shot's own
  `shows/action`;
- a duplicate phrase, `shows` or device anywhere in the film;
- two shots whose action or focus descriptions are ≥70% the same content words;
- a recipe used more than **once**. Ten shots need ten ideas, not four recipes
  twice.

The old cap was `max(2, ceil(40%))` — four uses in a ten-shot film. It is now
one. A pack with fewer than ten honest recipes cannot pass a ten-shot explainer,
and that is the correct pressure.

### 3. A body must earn its frame

`shots[].visual.performers` is one block per staged character:

```json
{ "who": "Rider", "does": "presses the app icon", "why": "the line says riders open the app" }
```

- a staged character with no block is refused;
- a block without a cast member, or a duplicate, is refused;
- `does` needs two content words and must appear in the shot's
  `shows/action/focus`;
- `why` needs four content words;
- the phrase must name the character or share a content word with `does`;
- a shot with `cast: []` must declare no performers.

**Performance modes make the body optional.** The identity schema gains
`diagram-show` and an optional `performance.stagedShareByMode` band. A
`diagram-show` stages **20–60%** of its shots; `stage-show` and
`presenter-show` keep the pack's high floor. A pack that does not list the mode
refuses a score that declares it. Paper K-pop opts in; the template does not.

### 4. Text never covers a face

The paint probe now records a `face` anchor with a local box. `type-audit`
maps it through the rig matrix and refuses any text box that intersects it
(1 px side-bearing tolerance). A staged character with no face box is also a
failure, so a rig cannot quietly stop publishing one.

### 5. Storyboard refuses before it paints

`npm run storyboard -- <score> --check` runs the same visual contract. The full
storyboard runs it before `rmSync`/paint and writes a refusal report. A
storyboard can no longer show a repeated or unmoored image and look official.

### 6. Both hands are visible

The far arm is drawn after the torso (far shade carries depth), both hands are
drawn last, and the hand is a palm + four fingers + a thumb that rotates with
the forearm. The rig publishes `hand-left` and `hand-right` anchors. The
library gains `tap`, `hold` and `accept` poses. `appearance.fingers` is true.

## Evidence

```
npm run typecheck                  # clean
npm test                           # 512 pass
npm run library:check -- library/characters/index.json
npm run library:sheet -- --film uber-model
npm run audit:type -- films/uber-model/score.json
    face: 14 boxes on 2 characters · 10 shots · 0 unmeasured · 0 text-on-face
npm run visual:check -- films/uber-model/score.json
    contract 2 · 10/10 briefs · 10 staged · 0 phrases · 48 findings · FAIL
npm run storyboard -- films/uber-model/score.json --check
    refuses to paint
```

The old Uber score is **pre-0056**. Its 0055 gate pass and delivered MP4 are
historical evidence, not a current pass. The new contract refuses it on 48
findings: missing phrases/devices, characters with no action, and four recipes
used twice. That is the rule working.

## What this does not do

- The phrase/device/similarity checks are **lexical**, not semantic. A writer can
  still choose a thin noun that passes; the storyboard and a critic judge
  meaning.
- A music clock has no `clock.lines`, so phrase checks do not apply to songs
  yet. The lyric-line source is a separate change.
- The face check covers `TY.type`/`TY.text`; raw `ctx.fillText` still bypasses
  the probe (named, not hidden).
- The rig hand is readable, not anatomically exact. It is a paper cutout with a
  thumb and four fingers; a pixel-level hand solve is parked.
- The current Uber film is not re-authored here. The next film is written under
  contract 2; the proposal and the ten-shot Uber v2 plan are in
  `docs/proposals/next-film.md`.
