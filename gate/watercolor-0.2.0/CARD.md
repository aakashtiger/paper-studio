# Watercolor 0.2.0 card — density and height

**Card:** `styles/watercolor-0.2.0/card.html`
**Command:** `node scripts/card-audit.mjs styles/watercolor-0.2.0/card.html <width> <height>`
**Caps:** ≤150 prose words (p/figcaption), ≤240 total visible words.
**CI:** the height measurement runs when Chrome/Edge is available; the gate skips that one measurement when the CI image has no headless browser. The static density, media and structure checks always run.

| Measure | 900 × 700 | 390 × 844 |
|---|---|---|
| Document height | 4,158 px | 4,691 px |
| Document width | 885 px | 375 px |
| Horizontal overflow | none | none |
| Phone frame | 390 px | 375 px with a 15 px classic scrollbar; 390 px on a mobile viewport |
| Phone screen | 372 × 661 px | 359 × 638 px |
| Phone aspect | 9:16 | 9:16 |
| Fonts | Cormorant, Caveat, Plex Mono load | same |

Density:

- **78 prose words** (p and figcaption).
- **237 total visible words** (all text, including SVG labels and palette roles).
- Required sections: hero, legend, visuals (16:9 walk), phone, anti, palette, type, motion (paint-in), sound, rules, fit, proof, signoff.
- The card makes no external request, uses no raster still, names no Lemo source, and pre-fills no choice.
- 1:1 and 16:9 text fit is labelled **unverified / S2** with box diagrams; the 9:16 phone shows the 44/24/24/14/18 scale and the 14 px floor.

Corrections from run-1:

- The 9:16 phone date is 14 px and sits inside the 11% bottom margin.
- The phone title is 44 px, names 24 px, note 24 px, monogram 18 px.
- The first-run card used 32/16/8 and is not the final card.
