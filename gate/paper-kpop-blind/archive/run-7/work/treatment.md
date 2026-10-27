# Treatment — Rooftop Fold

## Route

| # | Recipe | Beat role | Seconds | Grammar it proves |
|---|---|---|---|---|
| 1 | `paper_open` | open | 4.968 | Open sun, cut-paper edge, 18% fibre, 5% push, iris out |
| 2 | `type_stack` | title | 4.855 | Cream type edge + hard ink shadow, halftone, hard cut |
| 3 | `portrait_iris` | portrait | 4.968 | Cut-paper portrait and window, lyric band, 12% push |
| 4 | `stage_wide` | list | 5.161 | Two-cast rig, 6% orbit, acid burst, meter, 9:16 re-stage |
| 5 | `sticker_slam` | quote | 4.855 | Torn red bed, sticker slam, halftone, accent |
| 6 | `pullback_close` | close | 5.193 | Diorama pull-back, corner marks, held close |

Plan split (ms): 4,968 / 4,855 / 4,968 / 5,161 / 4,855 / 5,193 = 30,000 ms. Fit: min 14.4 s ≤ 30 s ≤ max 33.0 s. Every shot starts at its recipe minimum; the remainder is shared by remaining capacity. The lead's resolver is authoritative, and S2 quantises the cuts to 88 BPM.

Palette: `night-stage`. Roles per shot: 1 paper/ink/acid/accent; 2 paper/ink/red/acid; 3 paper/ink/red; 4 paper/ink/blue/acid; 5 paper/ink/red/accent; 6 paper/ink/blue/acid. The accent recurs in 1 and 5; no frame exceeds four colours. The second performer's accent sleeve is dropped in shot 4 to hold the budget.

Sound: 88 BPM electronic pop, paper snap/tear/slap/whoosh; the pack supplies no audio, so track and optional voice are cleared per film.

## Grammar check

- **Cut-paper edge:** Shot 3 — Vera Lune's hair, jaw and the paper window are separate flat cards with a cream lip and a dark cut line; the same edge cuts the sun in shot 1.
- **Cream type edge and hard ink shadow:** Shot 2 — the title is paper-fill display on the red title card, with a cream cut edge and one hard misregistered ink shadow; shot 3's ink names show the same edge against the sheet.
- **Torn fibre or sticker:** Shot 5 — a torn red bed and a paper sticker; shots 1 and 6 carry the 18% fibre field.
- **Halftone:** Shot 4 — the fixed-angle dot screen lies at 0.18 over the blue stage; shot 2 uses 0.22 under the type and shot 5 uses 0.24.
- **Two-cast rig:** Shot 4 — Vera Lune and the unnamed second are separate layered paper puppets with visible eyelet joints, placed in the 9:16 `lead` and `second` boxes; no third figure.
- **Beat cut or beat-locked move:** Shot 2→3 — a hard cut on the 88 BPM grid after the title card; shot 4's 1.00→1.06 orbit runs the shot's beat span, not a handheld drift. Shot 1's push is 5%, under the open limit.
- **9:16 re-stage:** Shot 4 — stage, burst, lead and second are re-anchored to the 9:16 `stage`, `burst`, `lead` and `second` boxes, not cropped from the 16:9 stage; shot 3's portrait sits in the central column and shot 1's sun/title/subtitle stack in the 9:16 boxes.

## Questions

- **`paper-shadow`:** Collage or Print? I have not chosen. Collage would add a soft contact shadow to every paper layer (shots 3, 5 and 6 gain depth); Print would keep the layers flat with only the type's hard offset shadow. Does the choice also lift the HUD and the fibre/halftone effects, or only the layer stack?
- **Cut edge under Print:** is the dark ink line under the cream lip part of the cut edge (kept) or part of the contact shadow (dropped)? Do `softness` 0.5 and `opacity` 0.2 apply only to Collage?
- **Palette:** is `night-stage` approved, or does the director want `day-stage`?
- **Second performer:** who is the second in shot 4? The brief has one `names` slot and no second name; I staged an unnamed foil. Is the second allowed only in shot 4, or should the close hold both?
- **Venue:** `content.venue` is not read. I put "The Fold, rooftop" in `content.caption`; should it stay there, or move off-screen?
- **Caption as lyric:** the HUD is a lyric band, but `content.caption` need not be a lyric. My line is a place line; does the director want an original lyric line instead? No third-party lyrics are used.
- **Track and clearance:** is "Nine Flights to the Roof" the cleared original track title, and who supplies music and the optional voice?
- **Loudness:** the format schema has no loudness field; where is the delivery target recorded?
- **Date, hashtag, RSVP:** these are in the brief but not read; should any appear, and in which read slot?
- **Meter:** what should the stage meter read, and is it generated from tokens rather than the brief?
- **Close line:** is "One roof, one take." the close line, or should it be a CTA/RSVP line?
- **Offset and snap:** does 0.21 s set the first downbeat, and do the six cuts snap to the nearest beat or bar?
- **Type drop / sticker slam:** `type_stack` and `sticker_slam` are static recipes; where are the drop and slam entrances, squash and anticipation authored?
- **Double iris:** `portrait_iris` has an `effect` iris and a `transition` iris; is the effect an animated iris that doubles the transition?
- **9:16 rules (pack defect):** five recipes map a rule and its copy to the same 9:16 box, and the rule aligns to the lower edge, so it flips below copy that sits above it in 16:9. Which anchor is intended?
- **Six-shot order:** the application's example order uses `detail` and no `list`, so it cannot show the two-cast rig; is open/title/portrait/list/quote/close acceptable, or should a detail beat replace one?
- **One body, four jobs:** `content.body` is one value used as body, lower third, display quote and close line; is that intended? The full list is in `questions.md`.
