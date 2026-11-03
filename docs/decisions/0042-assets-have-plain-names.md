# 0042 — Assets have plain names, a file, a size and a coverage check

**Status:** accepted · 4 Nov 2026
**Owners:** creative (`library/assets/**`), technical (`src/engine/asset-catalog.ts`, `scripts/assets.ts`)
**Depends on:** 0025 (assets are derived from the shots), 0038 (the character library)

## Context

The score's `assets[]` uses technical ids — `character.lead`, `prop.object`,
`set.stage`. A person cannot tell from those what exists, what it is called, or
where it is drawn. And the manifest is hand-written: *Same Alarm*'s eight
recipes name **11 assets**, and the film's `assets[]` is missing **6** of them
(`set.tabletop`, `prop.object`, `texture.halftone`, `set.corridor`,
`frame.paper-window`, `texture.paper-fibre`) while listing three it never uses.

The user's ask: whatever assets are built, store them, give them normal names,
and make them reusable.

## Decision

**`library/assets/index.json` is a plain-name catalogue, and three commands read
it.**

```
Bedroom before dawn   set     alarm_close, loop_close, loop_card
Office corridor       set     corridor_walk, supervisor_point, scroll_chase
Office chair          prop    84×152 px   desk_wide, desk_night
Phone                 prop    alarm_close, loop_close
Kiran                 character  library/characters/kiran/poses.json
Anton                 type    styles/paper-kpop/fonts/Anton-Regular.ttf
Paper fibre           effect  styles/paper-kpop/canvas/recipes.js
```

- **`assets:list`** prints the catalogue with the normal name, type, size and
  the recipes that use it. This is the page a person reads.
- **`assets:check`** refuses a missing file, a duplicate id or name, and a
  character outside `library/characters/`. It warns on a prop without a declared
  size — the chair is 84×152; the desk, monitor, papers, hour tab, lamp, door and
  mug still need measured sizes.
- **`assets:coverage -- <score>`** reads every recipe a shot uses, collects the
  assets those recipes name, and compares them with the film's `assets[]`. It
  refuses a missing one and reports an unused one.

The catalogue is **not** a second manifest. The score still owns what a film
uses; the catalogue is the map from a normal name to the file that draws it.

## Measured

`assets:coverage` on *Same Alarm*:

```
11 named by the recipes, 8 in the manifest
MISSING frame.paper-window, prop.object, set.corridor, set.tabletop,
        texture.halftone, texture.paper-fibre
unused  character.office-rig, set.scene-kit, type.paper
```

`assets:check` passes with **12 size warnings** (bed, nightstand, phone, desk,
monitor, papers, hour tab, lamp, door, mug, generic prop, paper sticker) — the
real remaining work, not papered over. The chair is 84×152 and the form 340×84;
the other props need measured footprints. The catalogue has **40 entries** and
each prints its technical ids, file and licence, so `character.lead` can be found
from "Kiran".

The chain runs `assets:coverage` before preflight, so a film whose manifest
misses a recipe asset is refused before the paint.

**460 tests**, typecheck clean, `films/` untouched.

## What this does not do, and is named

- **It does not build the 6 missing assets.** It names them. A set or prop that
  a recipe uses must be added to the film's `assets[]` (or the recipe must stop
  claiming it).
- **It does not derive `assets[]` from the shots.** `assets:coverage` is the
  check; `assets:new --score` would write the manifest. That is the next step.
- **It does not declare the missing prop sizes.** Twelve props have no measured
  width/height; the check warns. Inventing a size would be worse than the
  warning.
- **The catalogue's `recipes[]` column is hand-written** and can drift; the
  coverage check uses the recipe files, not that column.
- **It is not a model library.** The paper assets are code paths; a future 3D
  style would add a `sprite` type with a licence and a source, not download into
  the render path.
