# 0009 — Watercolor 0.2.0: card and process revision

**Status:** frozen for the S1c.1 gate · accepted **9/10 GO** · 2026-10-27
**Owners:** both
**Spec:** `docs/specs/0004-style-pilot-watercolor.md`
**Pack:** `styles/watercolor-0.2.0/` 0.2.0, **REVIEWABLE**, `sha256:196fd31501fe029f20da6c79fd1629864581182e22c59802b47a0b741c236e05`
**Gate:** `gate/watercolor-0.2.0/REPORT.md`, `AUDIT.md`, `CARD.md`
**Historical:** `styles/watercolor/` 0.1.0 and `gate/watercolor-blind/` remain at `sha256:31b804d0…`.

## Context

The independent 0.1.0 review was **7.5/10 PASS WITH CAVEATS**. The style grammar was strong, but the card was a spec sheet (484 body-copy words, 7,539 px desktop, no reference stills, tiny icons, clipped ANTI, a 345 px phone in a 390 frame) and the blind application carried style prescriptions and a factual error. The 0.1.0 card is inside the 0.1.0 pack hash and blind seal, so it must not be edited.

## Decision

Ship a **card and process revision** as a new pack and gate:

- New `styles/watercolor-0.2.0/` and `gate/watercolor-0.2.0/`; the 0.1.0 evidence is untouched.
- Keep the style semantics, `BRIEF.md`, six recipes, two formats, fixtures, fonts, palette and rights.
- New visual-first card: authored 1:1 hero, 16:9 walk, 9:16 phone, ANTI, palette, type, synchronized 1.2/1.8 paint-in, rules, fit, proof, signoff. No Lemo still. 78 prose / 237 visible words; 4,158 px at 900 and 4,691 px at 390.
- Strip `APPLICATION.md` to the two schemas, resolver fit math, 9:16 boxes/scale, the open choice and the treatment template. Remove the style essay, Lemo references and the missing `aspectRules` key.
- Add exact manifest-set checks, `inputs/pack` hash checks, UTF-8 `resolve.txt`, card density caps and a card height/phone measurement command (`scripts/card-audit.mjs`).
- One final blind on the frozen pack, 6 shots / 30 s / 9:16. Run-1 is archived; run-2 *A Small Inventory* is live.

## Text proof

- **9:16:** proof. The blind page and the card phone use 44/24/24/14/18; the 14 px floor holds.
- **1:1 and 16:9:** **unverified / S2**. The card labels them and shows box diagrams. The walk’s world-space entries and screen-space leader are also unverified/S2. No renderer exists.

## Gate evidence

```text
typecheck                         pass
tests                             110 / 110
style:check                       REVIEWABLE, 0 hard, 1 open choice (paint-in-speed)
page (two briefs)                 8 shots, 45 s, 1:1, 9/9
scroll (two briefs)               4 shots, 45 s, 16:9, 9/9
blind (final run-2)               6 shots, 30 s, 9:16, 9/9
pack hash                         sha256:196fd31501fe029f20da6c79fd1629864581182e22c59802b47a0b741c236e05
pack                              22 files, circa 3.9 MB (fonts dominate)
manifests                         exact set, 24 files; inputs and used-inputs byte-identical
card                              78 prose / 237 visible; 4,158 px at 900; 4,691 px at 390
critics                           contract 9/10 GO · creative 9/10 GO · product 9/10 GO
0.1.0 evidence                    untouched at 31b804d0…
```

## The blind cost

Run-1 (*The Halyard Tune*, `182b6733…`) was a valid plan but exposed two evidence defects: the card phone used 32/16/8 (the date below the 14 px floor) and `APPLICATION.md` pointed at a non-existent `aspectRules` key. Both were fixed before run-2. Run-1 is archived; run-2 saw the fixed content at `ffbbf8fa…`. The final pack was normalized CRLF→LF to `196fd315…` so the hash is identical on Windows and Linux; the content is unchanged. This is the last blind loop: the pack was audited first, then one final blind was run.

## What this proves

- A fresh author can read the 0.2.0 pack and resolve a different 30 s / 9:16 / six-shot film.
- The final pack, input and used-input hashes match; the exact manifest set is complete; UTF-8 is clean.
- The 9:16 page is text-proof at 390 px; 1:1/16:9 are honestly labelled unverified/S2.
- The card is a real review surface under the density caps, with no Lemo still, no raster and no pre-filled choice.
- The 0.1.0 evidence is historical and unchanged.

## What it does not prove

- Pixels, motion, paint-in feel or brush texture. S2.
- 1:1 and 16:9 text fit. Unverified/S2.
- The walk’s leader endpoint after the pan. Unverified/S2.
- Per-shot content variation. One value per slot.

## Next

S2: a short watercolor and Paper K-pop render test, contact sheet and motion comparison. No full film, no app, no second style until that exists.
