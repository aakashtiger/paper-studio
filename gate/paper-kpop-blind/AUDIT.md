# Paper K-pop geometry re-audit

**Audited first:** live pack `sha256:6665af27c193cb234dbef8ecbb7c6f04a0f0452914eac59a8212b0869798265c`
**Frozen after the batch:** `sha256:6c5765be435bbf494bceaee6b770828c4bdd2c33d5c795287cf96435f8c211ba`
**Frame sizes:** 390 × 219.375 (16:9) and 390 × 693.333 (9:16), the authored review width.
**Evidence:** all 8 recipes, both aspects, the two resolve briefs and the live blind brief; bundled TTFs measured in headless Chrome; box, overlap, margin, containment, anchor, contact and colour checks in Node.

This is a static geometry audit, not a render. It proves boxes, not pixels. The 16:9 and 9:16 text fit is checked at the 390 px review width the pack declares; larger frames scale proportionally.

## What was wrong at `6665af27`

The late warning was right: the pack was mechanically green but its box system had real defects. The re-audit found **6 critical and 8 high** geometry findings. The prior 106-finding list was not used as a discovery source; every item below was re-derived from the current recipes and tokens.

| # | Severity | Where | Finding | Fix |
|---|---|---|---|---|
| 1 | critical | `stage_wide` 16:9 | `body-line` `[.07,.76,.50,.10]` overlapped `caption-line` `[.07,.82,.50,.06]` by 0.500 × 0.040. | Body moved to `[.07,.72,.80,.08]`; caption to `[.07,.80,.80,.08]`; no overlap. |
| 2 | critical | `stage_wide` 9:16 | `stage-burst` mapped to the 84% × 58% `burst` box: a ×12.30 area blow-up. | Dedicated `stageBurst` `[.36,.11,.28,.18]`; the burst stays a small event above the stage. |
| 3 | critical | `sticker_slam` 9:16 | `slam-burst` used the same 84% × 58% `burst` box: a ×9.67 area blow-up. | Dedicated `stickerBurst` `[.36,.18,.28,.12]`; the burst stays above the sticker. |
| 4 | critical | `sticker_slam` both | `body-slam` used `paper` fill on the `prop.paper-sticker` plate. Paper type on paper loses both fill and the ink shadow. | Fill changed to `ink`; the cream cut edge and paper sticker stay. |
| 5 | critical | `portrait_iris` both | Caption and lyric band shared the `lyric` box (×2.82 area); the caption was top-flush and could not hold 18 px at 16:9. | Dedicated `lyricText` `[.10,.88,.80,.08]` inside the band; band stays `[.06,.86,.88,.10]`. |
| 6 | critical | `pullback_close` 9:16 | Body and strip shared `bodyLower`; nesting the text inside the strip preserved a 50% inset and left a 20.8 px box for 24 px body copy. | Dedicated `closeStrip` `[.08,.74,.84,.12]` and `closeBody` `[.10,.765,.80,.06]`. |
| 7 | high | 16:9 lower thirds | Six boxes could not hold a 14 px line at 390 px: `macro_prop_beat` caption 12.5, `paper_open` subtitle 12.75, `portrait_iris` caption 10.75, `pullback_close` body 12.5, `side_scroll_chase` caption 10.5, `stage_wide` caption 10.75. | Boxes widened/repositioned; the measured floor now runs 14.5–18 px. The authored size still auto-fits down where the box is tight. |
| 8 | high | `macro_prop_beat` 16:9 | Caption `[.08,.82,.52,.08]` ended at `.90`, inside the 12% bottom margin. | Caption `[.08,.78,.80,.10]`, ends at `.88`; fits 18 px on one line. |
| 9 | high | `pullback_close` 9:16 | Monogram `[.10,.84,.22,.06]` ended at `.90`, inside the 12% bottom margin. | Monogram moved above the close strip to `[.10,.64,.22,.06]`. |
| 10 | high | `paper_open` 9:16 | `core-burst` shared `openSun` with the sun (×4.46 area); it relied on the nesting rule to recover a 23% core. | Explicit `openCore` `[.383,.163,.233,.194]`, preserving the 16:9 inset. |
| 11 | high | `side_scroll_chase` 9:16 | `chase-arrow` shared `corridor` with the corridor plate (×15.91 area); nesting would have to recover a 22% arrow. | Explicit `chaseArrow` `[.64,.36,.24,.12]`. |
| 12 | high | `sticker_slam` 9:16 | Sticker, bed, copy and rule shared one anchor family; nesting the 16:9 sticker inset would put `stickerText` and `stickerRule` outside the sticker. | `stickerBed` `[.08,.18,.84,.50]`; `sticker` `[.20,.30,.60,.28]`; `stickerText` and `stickerRule` stay inside the sticker. |
| 13 | high | `type_stack` 9:16 | `title` and `body` were flush to the `titleCard` left and right edges; no cut-edge inset. | `title` and `body` inset to `[.12,..., .76,...]` inside the card `[.10,.16,.80,.46]`. |
| 14 | high | all 9:16 paired objects | Ten paired relationships depended on the prose nesting rule rather than an explicit, testable anchor. The rule is right, but a box-only renderer collapses the pair. | Ten dedicated anchors added: `openCore`, `lyricText`, `stickerBed`, `stickerText`, `stickerRule`, `stickerBurst`, `stageBurst`, `chaseArrow`, `closeStrip`, `closeBody`. |

## What the frozen pack proves

- **Text fit:** every content slot holds a 14 px line at 390 px in both aspects. The six former failures are 14.5–18 px. The 16:9 display and body still auto-fit below their authored 64/26 px where the composition is tight; that is the declared `text auto-fits` rule, not a floor failure.
- **No collisions:** no text/text overlap and no rule crossing text in either aspect.
- **Margins:** no content text enters the 12% bottom margin. The one exception is the `portrait_iris` lyric-band caption at `.86–.96`, which the HUD rule explicitly allows.
- **Paired anchors:** the sun and core, lyric band and caption, sticker bed/sticker/copy/rule, stage burst, chase arrow, and close strip/body are separate boxes; the inner box is fully inside the outer box in both aspects.
- **Contact and balance:** the macro object sits on the tabletop at `.66`; both stage figures stand on the stage floor at `.74`; explicit colour roles never exceed four.
- **Gate:** `node --import tsx --test test/paper-kpop-gate.test.ts` passes **9/9**, including the new geometry test; `npm test` passes **110/110**; `style:check` is REVIEWABLE with one open choice (`paper-shadow`).

### Card check

The card was re-opened at 900 × 700 and at a true 390 × 844 viewport (headless Chrome device metrics, not the clamped desktop window).

| Check | 900 × 700 | 390 × 844 |
|---|---|---|
| Document height | 4,265 px | 5,480 px |
| Horizontal scroll | none | none |
| Motion phone frame | 360 px (360 px grid column) | 375 px with a 15 px classic scrollbar; 390 px on a mobile viewport without one |
| Phone screen | 328 × 583 | 343 × 610 at 9:16 |
| Fonts | all four load | all four load |

At `max-width: 640px` the board is now full-bleed and the motion section drops its side padding, so the phone illustration fills the 390 px review frame instead of shrinking to 327 px. The card keeps 77 prose words / 222 visible tokens, three reference stills, three recognition specimens and both shadow panels.

Three audit notes remain, all accepted:

1. The `portrait_iris` caption is the one text allowed in the bottom 14%; it is the HUD exception, not a leak.
2. `small-object` maps from a 16% × 18% prop to a 44% × 36% contain anchor in 9:16 (×5.50 area). This is a deliberate macro re-stage of a contain-staged prop, not a crop.
3. 16:9 type auto-fits below the authored scale in the tightest boxes. The floor is met; the authored scale is a ceiling, not a promise of a 64 px title in every 16:9 box.

## Boundary of this proof

- It is a box audit at 390 px, not a render. It does not prove glyph pixels, line-break aesthetics, kerning, motion or phone legibility.
- The live blind is a fresh run on the final hash, *Last Cue* (run-18). The old *Rooftop Soundcheck* run is archived under `archive/run-17/` against `719e0582...`; it is not live. The final plan re-resolves 9/9 on `6c5765be...`.
- It does not update the historical watercolor 0.1.0 evidence. Watercolor 0.2.0 is a separate pack and gate.
