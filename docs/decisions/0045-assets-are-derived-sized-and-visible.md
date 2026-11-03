# 0045 — Assets are derived, sized and visible

**Status:** accepted · 4 Nov 2026
**Owners:** shared (`src/engine/asset-catalog.ts`), technical (`scripts/assets-new.ts`, `library/assets/index.json`)
**Depends on:** 0042 (plain names), 0038 (the character library)

## Context

The asset catalogue (0042) named 40 built assets in plain English, but the
film's `assets[]` was still hand-written and nothing tied the two together.
Same Alarm's shots named **11** assets; its manifest carried **8**, missing
six: the paper window frame, the generic prop, the corridor, the tabletop, both
textures. The catalogue also carried **12 props with no declared size**, so
`assets:check` could only warn that a prop "can be 2.5 men wide". And there was
no `assets:new`: a person had to copy ids and hashes by hand.

## Decision

- **`deriveAssetRefs`** (in `asset-catalog.ts`) is the one derivation used by
  the command and the tests. For every id a recipe names and the manifest
  misses, it finds the catalogue entry, refuses an unknown id, hashes the file
  at `entry.where`, and returns an `AssetRef` (`version 0.1.0`, `source reused`,
  the entry's type, the entry's path, and `character` for a character).
- **`npm run assets:new -- --score <score> [--write]`** prints the proposal, or
  validates `FilmScoreSchema` + `resolveFilm` and writes it. A dry run is the
  default. An unknown name is a refusal; a placeholder is never invented.
- **Every prop has a size.** The 12 values are the drawn plates in
  `styles/paper-kpop/canvas/recipes.js`: bed 820×500, nightstand 1800×512,
  phone 380×196, desk 2440×640, monitor 300×220, papers 340×240, hour tab
  653×291, lamp 192×136, door 268×660, mug 52×52, paper sticker 1240×400. The
  generic prop is a declared 180×180 slot bound, not a drawing.

## Measured

- On a fresh copy of Same Alarm's score, `assets:new` derives all **6** missing
  assets, writes 14, and `assets:coverage` then prints **pass** (11 named, 14
  present). `resolveFilm` accepts the proposed manifest before the write.
- `assets:check`: **40 assets, no warnings**, every asset has a file, a name, a
  licence and (for a prop) a size.
- `test/asset-catalog.test.ts` (7) fixes the coverage, the derivation, the
  validity of the six refs, and the new size rule. **449 tests**, typecheck
  clean.

## What this does not do

- **It does not rewrite the delivered Same Alarm score.** The proof is a copy
  in `build/`; changing a delivered film's manifest would invalidate the hashes
  and gate rows that describe its picture. A new film runs the command before
  its first render.
- **It does not vendor the pack file.** The six derived entries point at
  `styles/paper-kpop/canvas/recipes.js`, the file that draws them, not at a
  film-local copy. If a film pins a different painter, that is a contract change
  (the catalogue's `where` must follow it).
- **The sizes are drawn bounds, not furniture.** The nightstand plate is 1800 px
  because it spans the frame; this is a sanity bound, not a claim that a
  nightstand is 2.3 people wide.
- **`effect` and `rig` entries cannot enter a film manifest yet.** `AssetRef`
  does not carry those kinds; `deriveAssetRefs` refuses one by name rather than
  guessing a type.
- Immutable library versions and 14 unique faces remain parked by the user.
