# Paper K-pop blind application — report

**Style:** `styles/paper-kpop` 0.1.0
**Date:** 2026-10-28
**Final run:** live `work/` — *Last Cue* (run-18), after 17 archived runs
**Pack hash:** `sha256:6c5765be435bbf494bceaee6b770828c4bdd2c33d5c795287cf96435f8c211ba`
**Result:** 6 shots · 30 s · 9:16 · 9/9 assertions · final pack and input/used copies matched · **post-build critics contract 9/10 GO · creative 9/10 GO · product 9/10 GO**
**Author:** a fresh sub-agent given only the sealed `inputs/` copy.
**Audit:** `AUDIT.md` — the current-hash geometry re-audit and the batch that fixed it.

The byte seal proves the author did not edit the sealed inputs; it does not prove the author never opened the repo. The harness has no sandbox. Treat this as a prompt-isolated, byte-sealed application, not a cryptographic read-seal.

The final author saw the frozen `6c5765be…` pack. The previous *Rooftop Soundcheck* run is archived under `archive/run-17/` against `719e0582…`; it is not the live answer. There is **no carry-forward** in this final report: the live film is the fresh run on the final hash.

## What the author made

- **Film:** *Last Cue* — the last entrance of the night for the fictional artist Nova Kim.
- **Route:** `paper_open` → `macro_prop_beat` → `portrait_iris` → `stage_wide` → `sticker_slam` → `pullback_close`.
- **Allocation:** 4.976 / 4.818 / 4.976 / 5.167 / 4.865 / 5.198 s = 30.000 s.
- **Palette:** `day-stage`; accent gold in the open and the sticker; four roles per frame.
- **Shadow:** `paper-shadow` left unanswered; the treatment is staged to work under either choice.
- **No** real artist, third-party lyric, source character name or source scene.

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
node --import tsx --test test/paper-kpop-gate.test.ts
```

## The geometry batch

The late audit warning was accurate. The current hash was re-audited from the recipes and tokens, not from the prior finding list. The audit found **6 critical and 8 high** box defects: a 16:9 lower-third overlap, two ×10–12 burst blow-ups, paper-on-paper sticker type, three shared-anchor collapses, six 16:9 lower-thirds below the 14 px floor, two bottom-margin leaks, and 9:16 text flush to the title card. All were fixed in one batch. `AUDIT.md` lists every finding, its box coordinates and its fix.

The batch also fixed the card’s 390 px proof: the board is full-bleed below 640 px and the motion section drops its side padding, so the phone illustration is 390 px on a mobile viewport instead of 327 px.

After the batch:

- every content slot holds a 14 px line at 390 px in both aspects;
- no text/text overlap and no rule crosses text;
- no content text enters the bottom 12% except the portrait lyric band;
- paired objects use separate, testable anchors;
- the macro object touches the tabletop and both figures stand on the stage floor;
- explicit colour roles never exceed four;
- the 9-test gate passes 9/9 and the full suite passes 110/110.

**The final author saw these fixed boxes.** The old *Rooftop Soundcheck* run did not; that is why it is archived, not live.

## Post-run changes

None to the pack. The treatment’s close duration was corrected from 5.199 to 5.198 to match the resolver; the plan and the 30.000 s total are unchanged. The author’s format carries `palette: "day-stage"` and `loudness: "-14 LUFS"`, both passthrough metadata; the resolver ignores them. The final pack hash is `6c5765be…`; the live plan re-resolves 9/9 on it.

## The discovery loop

The blind loop found one class of defect at a time. The final batch fixed all known issues together. The important findings and fixes:

| Finding | Fix |
|---|---|
| Recipes could not be selected by role | 8 recipes, one per beat role; formats repeat roles |
| 14-shot pacing was too slow | 14×45 song, 8×30 Short, 1.2–5.5 recipe range |
| The six-shot blind saturated at 5.0 s | 5.5 s ceiling; 4.82–5.20 s final plan |
| 1.2 s floor was unreachable | `macro_prop_beat` and `side_scroll_chase` start at 1.2 s |
| Paper shadow was hard-coded in recipes | Contact shadows removed; type shadow fixed only |
| 9:16 maps collapsed shared shapes | Dedicated paired anchors; z-order nesting as fallback |
| Text could sit on the same colour | Every text op names a palette fill; ink fields are avoided behind paper type |
| Title card read as a border | `type_stack` uses a filled `card`, not `frame` |
| Iris effect doubled the iris transition | In-shot iris effect removed; transition only |
| Sticker text could escape the sticker | `stickerText` is inset inside the sticker; `stickerBed` is separate |
| 12 Hz boil was frame-rate ambiguous | 30 fps pinned; 12 steps/s, two/three-frame holds |
| “Cover” contradicted re-stage | Backgrounds may bleed; characters/props/dioramas contain-stage |
| Source names leaked into the blind | Fictional names only; pack example changed to Static Bloom / Nia Vale |
| Card was a text wall | Visual-first card, 77 prose words / 222 visible tokens, 3 stills, 3 recognition specimens, open choice question |
| Font register said OFL only | OFL texts plus Apache 2.0 text for Permanent Marker |
| 16:9 corner marks sat at 3% | 6% safe margin in both aspects |
| Close strip narrower than the body | Strip widened; body sits inside it |
| Names box shorter than a display line | Names box raised to 0.08 |
| 16:9 lower-third overlap | Body and caption restacked at `.72–.80` and `.80–.88` |
| Burst boxes blew up in 9:16 | `stageBurst` and `stickerBurst` anchors |
| Six 16:9 boxes below the 14 px floor | Lower-thirds widened; measured floor now 14.5–18 px |
| 9:16 text flush to the title card | Title and body inset to `.12–.88` |
| Card phone shrank to 327 px at 390 | Full-bleed mobile board and motion section |

Runs 1–17 are archived under `archive/run-*`. The final author is the live `work/` (*Last Cue*, run-18).

## What this proves

- A fresh author can read the final pack, select six recipes, fill a brief and resolve a 30 s / 9:16 / six-shot plan without the source film.
- The final pack hash, input copy and used-input copy match; the manifests are byte-identical and every file hash matches.
- The final plan passes all nine resolver assertions.
- The final pack is free of the source title, character names, lyrics, meter strings and audio.
- The final pack is self-contained: local fonts, local frames, no other style, no network.
- The box system holds at 390 px in both aspects: 14 px floor, no text overlap, no rule crossing, no bottom-margin leak outside the lyric band, explicit paired anchors, contact at the table and stage floor.
- The live blind is a fresh run on the exact final hash, not a carry-forward.

## What it does not prove

- Pixels, motion feel, phone legibility or the paint of a real frame. That is S2.
- That the 1.2 s floor is used by the blind; the 14-shot song exercises the fast range, while the blind is a six-shot 30 s proof.
- Per-shot content variation. One value per slot is an S1a limit.
- That the author never opened the repo. The seal is bytes, not isolation.
- That a 30 s six-shot film is the right product shape. The product formats are the 45 s song and the 8-shot Short; the six-shot film is the blind proof.
- That the 16:9 authored type scale fits every box at 390 px without auto-fit. The floor is proven; the authored scale remains a ceiling.

## Files

- `AUDIT.md` — geometry re-audit, findings and fixes.
- `PACK-HASH.txt` — `6c5765be…`.
- `resolve.txt` — UTF-8, no BOM.
- `inputs/` and `used-inputs/` — pack copy, application, prompt, manifest (32 files).
- `critics/contract.md`, `critics/creative.md`, `critics/product.md` — scorecards.
- `work/` — *Last Cue* (run-18, live).
- `archive/run-17/` — *Rooftop Soundcheck* on `719e0582…`, historical.
