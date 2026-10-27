# Watercolor 0.2.0 blind application — report

**Pack:** `styles/watercolor-0.2.0` 0.2.0, **REVIEWABLE**
**Pack hash:** `sha256:196fd31501fe029f20da6c79fd1629864581182e22c59802b47a0b741c236e05`
**Final run:** live `work/` — *A Small Inventory* (run-2), after one archived run
**Result:** 6 shots · 30 s · 9:16 · 9/9 assertions · 24 manifest files · **post-build critics contract 9/10 GO · creative 9/10 GO · product 9/10 GO**
**Author:** a fresh sub-agent given only the sealed `inputs/` copy.
**Audit:** `AUDIT.md` — card, application, manifest and text-proof audit.
**Card evidence:** `CARD.md` — density, height and phone measurement.

The byte seal proves the author did not edit the sealed inputs; it does not prove the author never opened the repo. The harness has no sandbox. Treat this as a prompt-isolated, byte-sealed application, not a cryptographic read-seal.

This is the **final** run on the frozen content. The author saw `ffbbf8fa…`; the pack was normalized CRLF→LF after the run to `196fd315…`. The content is byte-identical except line endings; this is a transport normalization, not a style edit. Run-1 is archived under `archive/run-1/` against `182b6733…`; it is not the live answer.

## What the author made

- **Film:** *A Small Inventory* — Mara’s painted field page of the kitchen on Alder Row, 14 March.
- **Route:** `watercolor_title` → `watercolor_specimen` → `watercolor_quote` → `watercolor_mist` → `watercolor_specimen` → `watercolor_close`.
- **Allocation:** 4.667 / 5.833 / 4.667 / 4.500 / 5.833 / 4.500 s = 30.000 s.
- **Palette:** `evening-blue`; paper `#efe6d4`, ink `#262a2e`, wash `#8fa3b0`, petal `#c9a27e`, accent `#c65438`, deep = wash.
- **Type:** Cormorant 44/24, Caveat 24, IBM Plex Mono 14, Cormorant 18; 14 px floor.
- **Paint-in:** left open; the treatment does not choose 1.2 s or 1.8 s.
- **No** real people, third-party lyric, source film or source still.

## Mechanical result

```
6 shots · 30 s · 9:16
1. Every slot ... PASS
2. Every beat ... PASS
3. Every asset ... PASS
4. Two briefs ... PASS
5. Same seed ... PASS
6. Different seed ... PASS
7. Transition allowed ... PASS
8. Duration/aspect fit ... PASS
9. Word limit ... PASS
```

Full output: `resolve.txt` (UTF-8, no BOM). The gate command is:

```powershell
node --import tsx --test test/watercolor-0.2.0-gate.test.ts
```

## The 0.2.0 revision

0.2.0 is a **card and process revision**, not a new look:

- Style semantics, `BRIEF.md`, six recipes, two formats, fixtures, fonts, palette and rights are unchanged.
- The 0.1.0 pack and blind evidence are historical and byte-identical (`31b804d0…`). The new pack is a separate `styles/watercolor-0.2.0/` and `gate/watercolor-0.2.0/`.
- The card is visual-first: authored 1:1 hero, 16:9 walk, 9:16 phone, ANTI, palette strip, type, synchronized 1.2/1.8 paint-in comparison, rules, fit, proof and signoff. No Lemo still and no raster.
- `APPLICATION.md` is stripped to the two schemas, the resolver fit math, 9:16 boxes, the open choice and the treatment template. The 0.1.0 guide’s style prescriptions and the missing `aspectRules` reference are not carried.
- The gate adds exact manifest-set checks, `inputs/pack` hash checks, UTF-8 `resolve.txt`, card density caps (≤150 prose / ≤240 visible) and a card height/phone measurement.
- 1:1 and 16:9 text proof is explicitly **unverified / S2**; the card shows box diagrams. The 9:16 page is the text proof.

## Run-1 findings and the final run

Run-1 (*The Halyard Tune*, hash `182b6733…`) was a valid plan, but its questions exposed two evidence-layer defects:

1. The card’s 9:16 phone drew the date at 8 px (below the 14 px floor) and the title at 32 px, not the 9:16 44 px scale.
2. The application referenced `tokens.layout.aspectRules.9:16`, which does not exist; the pack has `aspectBoxes` and `aspectScale`.

Both were fixed before run-2: the phone now uses 44/24/24/14/18, the date is inside the 11% bottom margin, and the application points at `aspectBoxes.9:16` and `aspectScale.9:16`. Run-1 is archived, not live. Run-2 saw the fixed content at `ffbbf8fa…`; the final transport hash is `196fd315…` after LF normalization.

## Post-run clarification

The format carries `loudness: "-16 LUFS"`, which is passthrough metadata; the resolver ignores it. The treatment names `evening-blue`; the palette is a production choice in the treatment, not a resolver field. The final plan and the 9/9 assertions do not depend on either.

## Transport normalization

The card was written with CRLF on Windows. Git normalizes to LF on checkout, which would change the pack hash. Before the final commit, the pack, the inputs and the used-inputs were normalized to LF; the content is unchanged. The run-2 author saw `ffbbf8fa…`; the final hash is `196fd315…`. This is the same transport normalization the 0.1.0 pack recorded, not a style edit. The plan re-resolves 9/9 on both.

## The audit

`AUDIT.md` records:

- **Card:** 78 prose words / 237 visible tokens; 4,158 px at 900 × 700 and 4,691 px at 390 × 844; no horizontal overflow; phone 390 px at 900 and 375 px at 390 with a 15 px classic scrollbar (390 px on a mobile viewport); screen 9:16; all four fonts load.
- **Application:** schemas, fit math and template only; no Lemo, no style prescription, no missing `aspectRules`.
- **Manifests:** 24 files, exact set; inputs and used-inputs byte-identical; live pack, input pack and used pack all `196fd315…`.
- **Text proof:** the 9:16 blind page is the proof; the 1:1 and 16:9 boxes are diagrams labelled unverified/S2. No render is claimed.
- **0.1.0:** the old pack, gate and blind are untouched.
- **Card height:** the measurement runs when Chrome/Edge is available; the gate skips that one measurement on CI images without a headless browser. Density and structure always run.

## What this proves

- A fresh author can read the 0.2.0 pack and resolve a different 30 s / 9:16 / six-shot film without the source film or the 0.1.0 blind.
- The final pack hash, input copy and used-input copy match; the exact manifest set is complete; every file hash matches.
- The final plan passes all nine resolver assertions; every content slot is within the word limit.
- The 9:16 page is text-proof at 390 px: 44/24/24/14/18 and the 14 px floor.
- The card is a visual-first review surface under the density caps, with no external request, no raster and no Lemo still.
- The 0.1.0 evidence is historical and unchanged.

## What it does not prove

- Pixels, motion feel, paint-in feel, phone legibility or the actual brushwork. That is S2.
- 1:1 and 16:9 text fit. Those are labelled unverified/S2 and shown as box diagrams.
- Per-shot content variation. One value per slot is an S1a limit; the two specimen plates share the caption and venue.
- That the author never opened the repo. The seal is bytes, not isolation.
- That the 16:9 walk’s screen-space leader and world-space entries are pixel-aligned. The walk is a visual on the card, not a rendered proof.

## Files

- `AUDIT.md` — audit and corrections.
- `CARD.md` — density, height and phone measurement.
- `PACK-HASH.txt` — `196fd315…`.
- `resolve.txt` — UTF-8, no BOM, 9/9.
- `inputs/` and `used-inputs/` — pack, application, prompt, manifest (24 files).
- `critics/contract.md`, `critics/creative.md`, `critics/product.md` — scorecards.
- `work/` — *A Small Inventory*.
- `archive/run-1/` — *The Halyard Tune* on `182b6733…`, historical.
