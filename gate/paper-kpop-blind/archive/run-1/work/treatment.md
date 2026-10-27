# Treatment — Last Check

*A last rooftop soundcheck for the fictional artist Mira Voss. 30 s, 9:16, six shots, day-stage paper. `paper-shadow` left open.*

## Route

| # | Recipe | Beat role | Seconds | Grammar it proves |
|---|---|---|---|---|
| 1 | `paper_open` | open | 5.0 | cream type edge and ink shadow; paper snap; cut-paper sunburst; 9:16 title stack; iris out |
| 2 | `type_stack` | title | 5.0 | cream type edge and hard ink shadow; halftone; beat-locked type drop |
| 3 | `portrait_iris` | portrait | 5.0 | cut-paper portrait; lyric band; iris on a face |
| 4 | `stage_wide` | list | 5.0 | two-cast rig; halftone; stage orbit; 9:16 re-stage |
| 5 | `sticker_slam` | quote | 5.0 | torn fibre and sticker; halftone; beat-locked slam |
| 6 | `pullback_close` | close | 5.0 | cut-paper edge and diorama; fibre; monogram; corner marks; hold |

Fit: minimum sum 14.4 s, maximum sum 30.0 s. The resolver starts at 14.4 s and has 15.6 s of remainder against 15.6 s of total capacity, so every shot reaches 5.0 s. Total 30.0 s.

Sound: 88 BPM electronic pop with paper snap, tear, slap and whoosh; one beat of silence before the shot 5 slam; shot 6 holds on room tone. The body line is a printed slate, not a lyric; the caption is the single HUD/caption line.

## Grammar check

- **Cut-paper edge:** Shot 6 `pullback_close` — the diorama's cutaway edge, cream card lip and dark ink under-line are the reveal; Shot 1's title lip and sunburst cut edges carry the same edge.
- **Cream type edge and hard ink shadow:** Shot 2 `type_stack` — "LAST CHECK" in Anton carries the cream cut lip, the fixed down-right ink shadow and the 12 Hz step boil; "VOSS / TAKE NINE" sits below it on the ink card. Shot 1 repeats the treatment on the open title.
- **Torn fibre or sticker:** Shot 5 `sticker_slam` — the red torn-strip bed and the paper sticker slap; the torn bed carries the fibre edge, and the sticker lands on it. Shot 1 and Shot 6 also carry the paper fibre effect.
- **Halftone:** Shot 4 `stage_wide` — the fixed-angle dot screen at 18 percent over the stage; Shot 2 at 22 percent and Shot 5 at 24 percent keep the same screen angle.
- **Two-cast rig:** Shot 4 `stage_wide` — Mira Voss as `character.lead` and the second as `character.second`, two layered paper puppets with visible eyelet joints and no third figure.
- **Beat cut or beat-locked move:** Shot 5 `sticker_slam` — the sticker lands flat on the 88 BPM beat with the fixed squash and overshoot; Shot 2's display stack drops line by line on the beat, and Shot 1 snaps the paper sun into place on the first beat. The transition pattern is iris, cut, iris, cut, cut, hold at the resolver's 5.0 s marks.
- **9:16 re-stage:** Shot 4 `stage_wide` — the vertical map sends the stage to `stage`, lead and second to separate `lead` and `second` boxes, body and caption to the central stack, and the meter to top right. The 16:9 wide stage is rebuilt, not cropped.

## Questions

- Six shots at every recipe's 5.0 s maximum fill 30 s exactly, so the resolver never varies a shot. Is that intended?
- At 88 BPM, 5.0 s is 7.333 beats; cuts at 5 s intervals cannot all land on the beat. Should the edit snap to the nearest beat, accept off-grid cuts, or carry the beat only in-shot?
- `paper-shadow` is open. Shot 5's `sticker_slam` includes a contact shadow and its failure modes call a sticker without one a failure; shot 6's `pullback_close` includes a `diorama-shadow`. If the director chooses Print, are those shadows suppressed, and is shot 5 then a failure?
- In Collage, which layers cast: paper only, or paper and type? Does the type keep only its fixed hard shadow? What offset and angle does the shadow use at 9:16?
- The brief schema is invitation-shaped: `date`, `venue` and `rsvp` are present, but there is no song title, release date, ticket link or voice slot. I used only the six slots the selected recipes read; is that the intended music brief?
- `content.body` is used as body copy, a lower-third line, sticker display type and close copy. Is it a tagline, a lyric, a CTA or a list? `sticker_slam` sets it in display, against the closed mapping that sends body to Archivo Black. `content.caption` also appears as both a text line and a lyric-band asset in `portrait_iris`; does it appear twice?
- The HUD is incomplete: `STYLE.md` requires a six-bar colour row, but no asset or recipe provides one; the lyric band, meter and corner marks each appear in only one recipe. Is the HUD global or per recipe?
- No recipe uses the `accent` colour role, though `STYLE.md` requires one accent swatch per frame and at least two appearances per film; the only explicit accent in the rigs is the second's sleeve, and the second appears only in shot 4. Is the acid the accent, or is an accent op missing?
- Neither schema declares a palette, and the character/stage assets have no colour bindings, so `stage_wide` can exceed four colours. Is `day-stage` a resolver default, and which four roles are locked?
- `stage_wide`'s 9:16 `body` box (y 0.43–0.59) sits over the lead and second boxes (y 0.18–0.62); `pullback_close`'s 9:16 body moves to mid-frame rather than the 16:9 bottom. Are those placements intended?
- The 9:16 map is box-only: nested shapes sharing a box (sunburst and core burst; torn bed and sticker; diorama and shadow) and thin rules mapped to text boxes have no inset, anchor or thickness field. Does the resolver preserve the 16:9 relative placement, or fill the box? This affects shots 1, 2, 5 and 6.
- `paper_open` and `sticker_slam` each combine several graphic events. Are they single composite events under the "one graphic event" rule?
- `BRIEF.md` says 12 px minimum; `STYLE.md` and `tokens.json` say 14 px. Which governs?

The full list with pack references is in `questions.md`.
