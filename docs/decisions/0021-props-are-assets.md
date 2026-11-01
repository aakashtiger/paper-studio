# 0021 — A prop is an asset with a declared footprint

**Status:** accepted and implemented for the chair and the form · 1 Nov 2026
**Owners:** creative (`styles/paper-kpop/canvas/recipes.js` set dressing) and
technical (`test/paper-kpop-0.2.0-gate.test.ts`)
**Pack:** `styles/paper-kpop/` 0.2.0

## Context

The office set's furniture is drawn by functions — `officeChairBack`,
`officeMonitor`, `officeDesk`, `officeStack`, `officeSheet` — and every one of
them takes its size from the **call site**. The chair's width is `192 * s` inside
the function and `1.95`, then `1.6`, then `1.45` at four places that call it.

That is why the desk shots took five passes to stage. Judged at full size, the
same three defects kept appearing:

1. a chair back wide enough to read as a slab behind the hip;
2. a form pasted on the desk front because a flat plate carried a lift shadow;
3. the chair left where the *old* floor was after `OFFICE.seated` moved the actor
   11 px down — nothing connected the two.

None of those is a drawing mistake. They are one structural mistake: **a prop with
no declared footprint, placed by hand at every site.** A number repeated four
times cannot be corrected once, cannot be checked by a test, and drifts the moment
the thing it shares a ground plane with moves.

The contract already has the vocabulary and does not use it for this: `AssetType`
is `character | set | prop | type | …` and *Same Alarm* declares
`prop.paper-sticker`. The office furniture is the one place where a `prop` exists
without being an asset.

## Decision

**A prop in a pack is a declared asset: one draw, one footprint, one anchor.**

1. `canvas/recipes.js` carries a `PROPS` table. Each entry is
   `{ draw(ctx, o), w, h, anchor }` in pack units at scale 1, where `anchor` says
   which point of the box `(x, y)` refers to. A prop's footprint is written **once**,
   next to the code that draws it.
2. A recipe never draws a prop directly. It calls `placeProp(id, x, y, s, o)`,
   which reads the footprint, applies the anchor, and draws. A prop id that the
   table does not have **throws** — the same rule the pose library already has,
   because a silent fallback looks like staging and is not one.
3. Placement that belongs to a character is expressed **relative to that
   character**, not in absolute pixels. The chair exists only to sit behind the
   man who sits in it, so `officeSeated(...)` places chair and actor as one unit:
   `chair x = actor x + 20`, its base at the actor's hip line. Then a change to
   `OFFICE.seated` moves both, and the drift in §Context cannot recur.
4. The paint probe records each placed prop's box, the way it already records
   every type box. That makes the staging rules checkable by a test instead of by
   eye:
   - a prop anchored behind a character must sit **lower** on the frame than that
     character's head;
   - a prop's box must not overlap the character's head or torso box;
   - a prop that lies flat (`shadow: null`) must not be drawn with a lift shadow.

## What this does not claim

- **Not a new artist surface.** The `PROPS` table is pack code, not a file a blind
  author reads: `tokens.json`, `capabilities.json`, `cards`, fonts and references
  stay byte-identical, and `BEAT_ROLES` is untouched. The pack hash moves because
  `canvas/recipes.js` moves, which is the same condition as any painter fix.
- **Not a renderer feature.** Nothing in `src/` learns about a chair. The engine
  still knows no shot, no palette and no prop id (rule 7).
- **Not a claim that the chair is now good.** It is a claim that the chair's size
  and position are one fact, in one place, checkable by a test. Whether it looks
  right is judged at full size, as before.

## Evidence

| | |
|---|---|
| the chair's footprint | declared once, `PROPS.chair = { w: 84, h: 152, anchor: "bottom-center" }`; the four desk recipes pass a man's x, not a width |
| what the old footprint hid | `192 × 1.45 = 278 px` behind shoulders of `108 px`. At `84 × 1.5` it is `126 px` |
| drift | `officeSeated()` places the chair from the actor's own hip (`OFFICE.seated − 258 × scale`), so moving him moves the seat |
| unknown prop | `placeProp()` throws `unknown prop "<id>"`; an unplaced anchor throws too |
| the flat rule | `PROPS.form` is `flat: true` and its draw passes `shadow: null`; `placeProp` refuses a shadow on a flat prop |
| the gate | `test/paper-kpop-0.2.0-gate.test.ts` — every prop declares `w`/`h`/`anchor`, no flat prop casts a lift shadow, no chair is drawn at a call site, and the chair may not exceed 1.3× the man's shoulders. Verified by mutation: `w: 192` fails the test and names the width |
| picture | s03/`25.2 s` judged at full size before any long render was paid for, using `render:film --stills` |

### Not done here

- **Desk, monitor and stack still take their size at the call site.** They are
  drawn on plates larger than any man and have not caused a defect yet; they
  move into `PROPS` when they next change, not in a sweep.
- **The paint probe does not record prop boxes yet**, so "a prop behind a
  character sits lower than his head" is a rule, not a test. Recorded in
  `docs/STATUS.md` rather than claimed.

## Consequences

- Fixing a prop is one edit, not four, and a prop that is wrong in one shot
  cannot be right in another by accident.
- The probe's prop boxes make "one ground plane, one scale per depth"
  (`docs/decisions/0020` §6) a test rather than a note in a decision record.
- This is a **picture change**, so it costs one re-render of the film. It is
  therefore batched with the critic blockers from the first delivered cut rather
  than run on its own.
