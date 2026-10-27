# Treatment — Last Light Check

## Route

| # | Recipe | Beat role | Seconds | Grammar it proves |
|---|---|---|---|---|
| 1 | `paper_open` | open | 4.968 | Cream card and cut-paper sunburst; accent core; "Last Light Check" / "Vera Lune — soundcheck" stack; iris out. |
| 2 | `type_stack` | title | 4.855 | Cream type edge and hard ink shadow; halftone; "Last Light Check" and "One take." drop as stacked type on the beat. |
| 3 | `portrait_iris` | portrait | 4.968 | Vera's cut-paper portrait; names "Vera Lune"; red band reads "The Fold, rooftop — doors at dusk"; 12% push; iris. |
| 4 | `sticker_slam` | quote | 4.855 | Torn red bed and paper sticker; "One take." in display; hard type shadow; halftone; accent; slam on the beat. |
| 5 | `stage_wide` | list | 5.161 | Two-cast rig: Vera and the second paper performer; body and caption lower third; beat-locked orbit and cut; halftone; 9:16 re-stage. |
| 6 | `pullback_close` | close | 5.193 | Pull back from a red paper moon to the diorama; monogram "VL"; close line; fibre and cutaway edge; corner marks; hold. |

Palette: `day-stage`. Roles by shot: 1 paper/ink/acid/accent; 2 paper/ink/red/acid; 3 paper/ink/red; 4 paper/ink/red/accent; 5 paper/ink/blue/acid; 6 paper/ink/red/acid. The accent recurs in shots 1 and 4 only.

Fit: 14.4 s of minima plus 15.6 s shared by remaining capacity equals 30.000 s; the maxima total 33.0 s.

## Grammar check

- **Cut-paper edge:** Shot 1 (`paper_open`) — the acid sunburst's cut petals and the cream card lip. Shot 6 repeats the cutaway edge on the rooftop diorama. See Q1 for the Print-panel conflict over the cream lip.
- **Cream type edge and hard ink shadow:** Shot 2 (`type_stack`) — "Last Light Check" and "One take." set as paper letters on the red card, with one fixed misregistered ink offset. Shot 4 repeats it on the sticker.
- **Torn fibre or sticker:** Shot 4 (`sticker_slam`) — the torn red bed and the paper sticker, with paper fibre at 18% on shots 1 and 6.
- **Halftone:** Shot 5 (`stage_wide`) — the fixed-angle dot screen over the cobalt stage at 18%; shot 2 also carries it.
- **Two-cast rig:** Shot 5 (`stage_wide`) — Vera and the second paper performer, separate eyelet-jointed figures in the lead and second boxes; no third figure.
- **Beat cut or beat-locked move:** Shot 5 (`stage_wide`) — the 1.00→1.06 orbit is locked to the 88 BPM grid and cuts on the bar; shot 4's sticker slam lands flat on the beat. Plan seconds are quantised to the grid in S2.
- **9:16 re-stage:** Shot 5 (`stage_wide`) — the vertical map re-stages lead and second at x 0.20–0.42 and 0.58–0.80 inside the central 60%, stacks body and caption below them, and re-anchors the meter top right. Shot 1's sun and title stack are the opening re-stage; nothing is cropped from 16:9.

## Questions

1. **Paper shadow — Collage or Print?** Collage adds contact shadows and makes the rooftop a tabletop diorama; Print keeps it a flat print with only the type shadow. Does the shadow fall on the layer below or the table, does it re-anchor at 9:16, and does its tone count against the four colours? The card's Print panel drops the cream lip, which conflicts with the fixed cut-paper edge. Which is authoritative, and how should the cut edge be shown? Shots 1, 3, 4 and 6 change most.
2. **Palette — day-stage or night-stage?** The treatment names day-stage; confirm it, or switch to night-stage for a different paper stock, ink set, pink accent and night city.
3. **Second performer — who and how credited?** `stage_wide` needs two cast, but the brief has one `names` string. Is the second an unnamed foil, or do they need a name and credit within eight words?
4. **Track and voice — what is the actual audio?** Is the cleared track exactly 88 BPM with the 0.21 s offset, who supplies the master, is there a vocal line, who performs it, and does that line use the portrait lyric band?
5. **Loudness — what target and where does it live?** STYLE assigns delivery loudness to the format, but `format.json` has no loudness field and no fields may be added.
6. **Date, door time and venue copy.** `content.date` and `content.venue` are not read. Should "doors at dusk" become a real date or time, and is "The Fold, rooftop" the exact on-screen form with the comma?
7. **CTA, RSVP or hashtag.** These brief fields are not read, and the close has only monogram and body. If a CTA is required, it replaces the body line used by shots 2, 4, 5 and 6. Tagline or CTA?
8. **Track title.** The subtitle carries the artist and "soundcheck"; a separate track title would replace it. Is one required?
9. **HUD readout and corner marks.** STYLE says beat and palette, but the meter has no slot or readout format. What should it print — "88 / DAY", "88 BPM", a level bar, or something else? The close's corner marks also lack a specified colour and weight.
10. **Six-shot pacing.** The resolver lands at 4.855–5.193 s per shot, near each recipe's maximum and about 7.1–7.6 beats at 88 BPM. Is that the intended cut rate, or should an 8-shot release variant be planned alongside this six-shot application?
11. **Close hold and room tone.** Does the final hold sit on the last beat, or run on room tone after it? The pack supplies no audio.
