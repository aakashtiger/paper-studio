# Watercolor 0.2.0 audit

**Pack:** `styles/watercolor-0.2.0` 0.2.0
**Hash:** `sha256:196fd31501fe029f20da6c79fd1629864581182e22c59802b47a0b741c236e05`
**Scope:** card/process revision; style semantics, BRIEF, six recipes, two formats, fixtures, fonts, palette and rights are unchanged.
**Historical:** the 0.1.0 pack and gate remain at `sha256:31b804d0…`.

## What was checked

| Area | Result |
|---|---|
| Pack contract | REVIEWABLE, 0 hard, exactly one open choice (`paint-in-speed`) |
| Page | 8 shots / 45 s / 1:1 from two briefs, 9/9 |
| Scroll | 4 shots / 45 s / 16:9 from two briefs, 9/9 |
| Final blind | 6 shots / 30 s / 9:16, 9/9 |
| Manifests | 24 files, exact set; inputs and used-inputs byte-identical; every hash matches |
| Pack hashes | live, inputs and used-inputs all `196fd315…` |
| Resolve | UTF-8, no BOM, 9 PASS, no mojibake |
| Card | 78 prose / 237 visible; 4,158 px at 900 and 4,691 px at 390; no horizontal overflow |
| Phone | 390 px at 900; 375 px at 390 with a 15 px classic scrollbar; 9:16 screen |
| 0.1.0 evidence | untouched at `31b804d0…` |
| Media | no raster, no video, no audio, no signoff |

## Text proof

- **9:16:** the blind page is the text proof. The card phone shows the 9:16 scale: display 44, body 24, caption 24, label 14, monogram 18; the 14 px floor holds in the card specimen.
- **1:1 and 16:9:** **unverified / S2**. The card shows box diagrams for both and labels them. No renderer exists, so no pixel or line-break claim is made.
- **16:9 walk:** the recipe’s `entries` are world-space (0.1 / 0.45 / 0.8 over `world.width` 2.4) while the leader and note are screen-space. The 0.2.0 card shows the walk as a visual, not a coordinate proof. A renderer must verify the leader endpoint after the pan.
- **Recipes:** unchanged from 0.1.0, including the boxes that the earlier review questioned. The 0.2.0 scope is card/process-only; a geometry patch is not claimed.

## Card audit

- Authored 1:1 hero, 16:9 walk, 9:16 phone, ANTI, palette, type, synchronized 1.2/1.8 paint-in comparison, rules, fit, proof and signoff.
- No Lemo still, no raster, no external request, no pre-filled choice.
- `data-status`, `data-waiting` and `data-signoff` present; the card is UNSIGNED.
- Legend names REFERENCE, SPECIMEN and ANTI.
- The 9:16 phone uses 44/24/24/14/18; the date is inside the 11% bottom margin; the title is a short specimen (`Garden` / `Borrowed`) so the 44 px display fits the 0.46-width title box.
- The card’s 1:1 and 16:9 text proof is labelled unverified/S2 in the box diagram.
- Density: 78 prose words / 237 total visible words, under the 150/240 caps.

## Application audit

The 0.1.0 blind application was a 290-line style essay with prescriptions and a missing key. The 0.2.0 `APPLICATION.md` is stripped to:

- the brief and format schemas;
- resolver fit math and repeat syntax;
- the 9:16 boxes and type scale (`aspectBoxes.9:16`, `aspectScale.9:16`);
- the open choice;
- the treatment template;
- the rules.

It no longer names Lemo, the demo, paper hexes, bristle counts, halftone or stroke widths. It does not reference `aspectRules` (which never existed in tokens).

## Run-1 corrections

Run-1 (*The Halyard Tune*, `182b6733…`) found two evidence defects:

1. The card’s 9:16 phone drew the date at 8 px and the title at 32 px; the date was below the 14 px floor and the title did not show the 44 px scale.
2. `APPLICATION.md` pointed at `tokens.layout.aspectRules.9:16`; the pack only has `aspectBoxes` and `aspectScale`.

Both were fixed before run-2. Run-1 is archived under `archive/run-1/`; run-2 is the live final blind. The author saw `ffbbf8fa…`; the final hash is `196fd315…` after a CRLF→LF transport normalization with no content change.

## Findings

No blocking defect in the 0.2.0 scope.

Accepted limits:

- 1:1 and 16:9 text proof is unverified/S2, by design.
- The walk’s leader/entry coordinate alignment is unverified/S2, by design.
- One value per slot; the two specimen plates share caption and venue.
- The card is 4,691 px on a 390 phone; it is a scrollable review surface, not a one-screen app.
- The card is not a renderer; pixels, motion and paint-in feel are S2.

## Boundary

This audit proves the pack contract, the plan, the sealed final blind, the exact manifests and the card’s static geometry. It does not prove pixel output, motion or 1:1/16:9 text fit.
