# Treatment — Rooftop Soundcheck

## Route

Vera Lune plays the last soundcheck at The Fold, rooftop, before doors at dusk. The close's small object is a paper microphone standing on the diorama floor. Day-stage palette (the pack default). Four roles per shot: 1 paper/ink/acid/accent; 2 paper/ink/red/acid; 3 paper/ink/red/blue (the lead's lower torso is paper so the ink names read); 4 paper/ink/blue/acid (the second's sleeve is tinted blue, not accent); 5 paper/ink/red/accent (the flash is a light hit, not a fifth plate); 6 paper/ink/blue/acid (the diorama wall is blue, the floor paper so the ink close line reads). Accent recurs only in shots 1 and 5. HUD only where the recipe names it: lyric band in shot 3, meter in shot 4, corner marks in shot 6. Plan seconds are the resolver's min-plus-capacity split at whole milliseconds; the 88 BPM quantisation is S2. Total 30.000 s. No photograph, no 3D, no gloss, no dissolve, no handheld.

| # | Recipe | Beat role | Seconds | Grammar it proves |
|---|---|---|---|---|
| 1 | paper_open | open | 4.968 | Cut-paper edge; iris on the sun; 9:16 title/subtitle boxes. |
| 2 | type_stack | title | 4.855 | Cream type edge + hard ink shadow; halftone; beat cut. |
| 3 | portrait_iris | portrait | 4.968 | Paper portrait; torn lyric band; iris; 9:16 portrait column. |
| 4 | stage_wide | list | 5.161 | Two-cast rig; beat-locked orbit; meter; 9:16 lead/second boxes. |
| 5 | sticker_slam | quote | 4.855 | Torn bed + sticker; display body; accent; halftone. |
| 6 | pullback_close | close | 5.193 | Diorama pull-back; corner marks; monogram; hold. |

## Grammar check

- **Cut-paper edge:** Shot 1 — the acid sun's cut petals and the accent core carry the cream lip and the dark ink undercut; Shot 5 — the accent sticker's cream cut edge and the torn red bed. No soft edge or bevel in the six.
- **Cream type edge and hard ink shadow:** Shot 1 — the ink display title and the caption subtitle; Shot 2 — the paper display title and body on the red card. Both use the cream cut edge and the one fixed down-right misregistered ink shadow. The type shadow is the same under Collage or Print.
- **Torn fibre or sticker:** Shot 5 — the red torn bed and the accent sticker slam; Shots 1 and 6 — the paper fibre at 18 percent. The torn edge and the fibre step at 12 fps, not a smooth shimmer.
- **Halftone:** Shot 2 — the fixed-angle halftone at 0.22 behind the title card; Shot 4 — the stage halftone at 0.18; Shot 5 — the sticker halftone at 0.24. A dot screen, not an airbrush.
- **Two-cast rig:** Shot 4 — `stage_wide` stages Vera (lead) and an unnamed second paper drummer on the flat rooftop stage. The 9:16 map gives them separate `lead` and `second` boxes; the narrower shoulder and longer hair carry the second. The sleeve is blue, not accent, to keep four roles.
- **Beat cut or beat-locked move:** Shot 2 — the hard cut from the title card to the portrait is planned on the 88 BPM grid with the 0.21 s offset; Shot 4 — the 6 percent orbit is locked to the bar and moves the camera around the flat stage, not the paper. S2 quantises the plan seconds to the grid.
- **9:16 re-stage:** Shots 1–6 — each uses its recipe's `vertical` map, not a crop: images cover, text auto-fits, rules keep 1.5-2 px, and nested ops keep their 16:9 inset. Shot 3 stacks names and the lyric band in the portrait column; Shot 4 re-stages both cast into the central `lead`/`second` boxes; Shot 6 pulls back the diorama and re-anchors the monogram to the lower-left with the body above it. Type uses the 9:16 scale (56/24/16/14/32) and the 14 px floor. Shot 4's caption sits below the stage with a paper fill; that is a contrast risk (see Questions). Shot 5's sticker uses the pack's 68 percent composite `sticker` box; see Questions.

## Questions

The full list is in `questions.md`. The questions that change this treatment are:

- **paper-shadow:** Collage or Print? Collage gives the card, window, two-cast stage, sticker and diorama soft contact shadows and a visible cut edge; Print keeps them flat with only the fixed type shadow. The route is drawn to work both ways; the choice is the director's.
- **Print and the cut edge:** Does Print keep the cream cut edge on paper layers, or only on the type?
- **Contact shadows at 9:16:** Under Collage, do the soft shadows follow the re-staged layers and keep the top-left direction? The vertical map has no shadow anchors.
- **Vertical map nesting:** `paper_open` puts sun and core in one `openSun` box; `sticker_slam` puts bed and sticker in one `sticker` box. Which op is the parent, and what inset rule should the renderer use?
- **Sticker width:** The 9:16 `sticker` box is 68 percent wide, outside the central 60. Is a graphic event exempt, or should the sticker be inset?
- **Title card containment:** `type_stack`'s 9:16 title box starts above its title card. Can paper type fall on paper, or should the title be inset?
- **Stage caption contrast:** `stage_wide`'s caption sits below the stage on the cream card while its fill is paper. Should it be re-filled ink or moved onto the stage?
- **Six-role sequence:** The pack's example uses `detail`, but the only two-cast recipe is `stage_wide` (`list`). Is open / title / portrait / list / quote / close valid?
- **Duration rounding:** The pack does not say how the whole-ms remainder is rounded or tied. The table uses a largest-remainder split; a cumulative split moves a shot by 1 ms.
- **88 BPM quantisation:** Which beat does each cut land on, and does the 0.21 s offset start beat 0 or shift the phase?
- **HUD type shadow:** Does the fixed ink type shadow apply to the meter's acid readout on a black sticker, where it would disappear?
- **Audio and loudness:** The format schema has no audio or loudness field, and the brief has no audio slot. Who supplies the track, the optional voice line and the delivery loudness?
- **Second cast:** The brief has one `names` slot; the two-cast shot has an unnamed second. Is that allowed?
