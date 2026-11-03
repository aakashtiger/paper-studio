# 0047 — The writing is an input and a gate row

**Status:** accepted · 4 Nov 2026
**Owners:** shared (`src/engine/manifest.ts`, `scripts/gate-7.ts`)
**Depends on:** 0025 (four documents), 0037 (measured claims), 0045 (asset inputs)

## Context

`story.json`, `beats.json` and `scenes.json` are the documents a film is written
from, but the render manifest did not hash them and `gate:7` had no row about
them. A delivered film could have its script deleted or rewritten and still
pass: the picture was frozen, the sound was measured, the frames were audited,
and nothing asked what the film had been written to say.

## Decision

- `renderInputs` names **`story.json`, `beats.json` and `scenes.json`** for every
  film, whether or not they exist. A missing document is recorded as `null`; a
  script deleted after the render is a mismatch, not an unseen absence.
- `gate:7` gains one **`writing`** row. It requires the three documents to exist,
  requires the render manifest to carry their **current** hashes, and re-runs
  `checkStory`, `checkScenes` (against the score's clock lines and cast) and
  `checkNarrationSync`. It does not re-run a report: it reads the documents.
- The row is about the delivered picture's provenance, not a second writing
  review. A missing script, a beat with no words, a scene with no beat, or a
  score line that says different words from the story fails it.

## Measured

- `npm run gate:7 -- films/same-alarm/score.json` now prints:
  `FAIL writing  missing story.json, beats.json, scenes.json — the film cannot
  prove what it was written from`. That is the intended refusal: *Same Alarm*
  never had a script. Its historical 21-check pass predates this row.
- The same gate run also reports `FAIL scoreData` and `FAIL inputsHashed` for
  the delivered film, because its pinned pack (recipes.js) and page data have
  moved since it was painted. Those failures are the old film's, not this row's:
  the row's own message is the three missing documents.
- `test/manifest.test.ts` now requires the three paths in `renderInputs` even
  when the files are absent (recorded `null`).
- **462 tests**, typecheck clean.

## What this does not do

- It does not make *Same Alarm* pass. A legacy film with no script cannot pass a
  gate that asks for the script; only a new film can.
- It does not hash the four documents into the **delivered file**; the render
  manifest is the provenance record, and `deliver` reads the picture.
- It does not replace `preflight`'s story/scene checks; it re-runs them at the
  end, on the documents as they are, tied to the render's own hashes.
