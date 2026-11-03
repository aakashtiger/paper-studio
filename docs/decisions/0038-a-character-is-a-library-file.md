# 0038 — A character is a library file, not a copy per film

**Status:** accepted · 4 Nov 2026
**Owners:** creative (`library/characters/**`), technical (`src/engine/library.ts`, `scripts/library-*.ts`)
**Depends on:** 0003 (style pack), 0025 (the film is written before it is shot)

## Context

The video defines its cast once and reuses it: a character is drawn, given
fourteen expressions and a set of poses, and then appears in film after film.
Our system did the opposite. Every film carried its own `cast/*.poses.json`; the
Same Alarm files have eight poses and four expressions, and the next film would
copy them again. There was no library, no version, and no licence on a reusable
character.

Two measured facts made this worse:

- The pose schema allowed **4–8 expressions**. The video's 14 could not even be
  stored.
- The film's manifest does not name the pose file as a reusable asset; it hashes
  the copy inside the film. A change to a shared character could not be seen by
  a film that reused it.

## Decision

**A character is a versioned file in `library/characters/`, and a film points at
it.**

```
library/characters/
  index.json            id, name, rig, pose file, version, source, licence
  kiran/poses.json      8 poses, 14 expressions
  vaz/poses.json        8 poses, 14 expressions
```

- `PoseLibrarySchema` now allows **4–16 expressions** (was 4–8).
- `npm run library:check` refuses a character whose file is missing, whose name
  or rig disagrees with the index, whose poses are not distinct, or whose
  expression set is below **12** — a reusable character has to carry a usable
  face set.
- `npm run library:add -- --character <id> --kind pose|expression --from
  <file.json>` appends one pose or expression, refuses a duplicate, validates the
  whole library, and writes once.
- A film's `cast[]` points at `library/characters/<id>/poses.json`. The film's
  own `vendor/` still owns the drawing code; the library owns the performance
  data.
- `licence` and `source` are required. A character without a licence is not
  reusable, and "found on the internet" is not a source.

The two shipped characters are `kiran` and `vaz`, version 1.0.0. Their **8 poses
and 4 expressions come from *Same Alarm*; the other 10 expressions are new
names with the same `open/brow/look` vocabulary, added so the library carries a
reusable face set.** The index records the real source and a `sha256` of the pose
file. The film's own copies are left untouched: it is a delivered film and
re-pointing it would change its inputs and invalidate its manifest. A new film
uses `npm run library:use -- --score <score> --character kiran --apply`, which
rewrites the cast and the character asset, then validates the whole score.

## Measured

- **449 tests** pass (from 418): the library test adds 5 cases — a legal library,
  a four-expression character refused, a duplicate id refused, a new pose
  appended and re-validated, an expression appended without touching the poses.
  The camera tests add 4 more (see 0039).
- `npm run library:check` prints:
  `kiran Kiran worker@0.1.0 8 poses · 14 expressions · proprietary`
  and the same for `vaz`, then `pass`. The index hash is checked; an edited pose
  file that does not match fails.
- `library:add` validates against a temporary file and only then renames it into
  place; a refusal leaves the library byte-identical. It bumps the patch version
  and writes the new hash to the index.
- `library:use --apply` on a copy of *Same Alarm* rewrote Kiran's pose path and
  `character.lead` to `library/characters/kiran/poses.json`; `npm run film`
  passed, and a pose event naming the library-only expression `laugh` passed.
- Typecheck clean; `films/` untouched.

## What this does not do, and is named

- **The painter reads an expression only through the face adapter.** A pose event
  may name `expression`; `drawCharacter` maps the library's `open/brow/look` to
  the rig's `eyes/browLift/look/mouth`. That is a real path, but the 14 names do
  not yet produce 14 unique drawings: a richer face (separate mouth shapes,
  brows, eye shapes per name) is a pack upgrade, not a library one.
- **`assets:new --score` is not built.** A new film still writes its own
  `assets[]`; the library gives it a path to point at, not a derivation.
- **A library edit is a new version, not an immutable one.** The index bumps the
  patch and pins the new hash; a film that has already shipped keeps its own
  copy. Immutable versioned files (`kiran/1.0.0.json`) are the next step.
- **The manifest hashes the pose file a film points at**, including a library
  file, through `score.cast[].poses`. It does not yet hash the library **index**
  or tie the `version` field to the picture.
- **Props and sets are not in the library.** This decision is about characters
  and their poses.
