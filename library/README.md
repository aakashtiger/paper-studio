# The character and pose library

A character is expensive: eight poses, fourteen expressions, a rig, anchors and
a colour set. This folder makes a character a **versioned file** a film points
at, instead of a copy per film.

## What is here

```
library/characters/
  index.json            id, name, rig, pose file, version, source, licence
  kiran/poses.json      8 poses, 14 expressions
  vaz/poses.json        8 poses, 14 expressions
```

A film's `score.json` points its cast at the library:

```json
"cast": [
  {
    "character": "Kiran",
    "poses": "library/characters/kiran/poses.json",
    "rig": "worker@0.1.0"
  }
]
```

The film's own `vendor/` still owns the drawing code for its rig. The library
owns the **performance data** — which poses and which faces exist — so the same
person can appear in the next film without redrawing them.

## Commands

```bash
npm run library:check                       # every character: file, name, rig, poses, expressions, licence
npm run library:add -- --character kiran --kind pose --from pose.json
npm run library:add -- --character kiran --kind expression --from face.json
```

`library:add` appends one pose or expression, refuses a duplicate or an empty
set, validates the whole library, and writes the file once. A new pose is built
once and reused; it is not rebuilt in every film.

## Rules

- **A character without a licence is not reusable.** `licence` and `source` are
  required; "found on the internet" is not a source.
- **12–16 expressions, 8–12 poses.** The library refuses a character with fewer
  than 12 expressions; a one-film character may still carry the four a shot
  needs.
- **The index is the truth.** A pose file whose character name or rig disagrees
  with the index is refused.
- **Do not copy a character into a film.** Point at the library; if the film
  needs a variant, add a pose or an expression to the library, then point at it.
- **The renderer is not a library.** A downloaded 3D model or a photo is a
  `sprite` asset with a licence and a source, not a character in this folder.

## Using a character

```bash
npm run library:use -- --score films/<id>/score.json --character kiran --apply
npm run embed -- films/<id>/score.json
```

The first command rewrites the film's `cast[].poses` and its character asset to
the library path, with the pinned version and hash, and validates the score. The
second regenerates the page data, which is now stale.

A pose event may also name an expression:

```json
{ "t": 1.2, "kind": "pose", "who": "Kiran", "pose": "look", "expression": "tired" }
```

The painter maps the library's `open/brow/look` to the rig's
`eyes/browLift/look/mouth`. The 14 names produce about **6–8 distinct faces**,
not 14; a richer face (separate mouth shapes, brows, eye shapes per name) is a
pack upgrade, not a library one. The character sheet uses the same mapping, so
the 14 cards are not identical.

## What still has to be built

- **Immutable versions.** Adding a pose edits the same file and bumps the patch;
  a film that already points at it keeps its own copy, but a film that pins a
  hash must be re-pointed. Per-version files (`kiran/1.0.0.json`) are next.
- **Props and sets** in the library.
- **14 unique faces**, not 6–8.
- **`assets:new --score`** to derive the manifest from the shots, with prop sizes
  and a hash for every path.

The library check keeps the data legal until then.
