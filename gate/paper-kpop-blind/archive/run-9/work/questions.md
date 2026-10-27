# Questions

These are the questions the pack leaves open for *Last Light Check*. No `paper-shadow` answer is assumed.

1. **Paper shadow — Collage or Print?** The pack leaves `paper-shadow` open, and the answer changes every paper layer, not the edit.
   - **Collage:** every layer gets a soft contact shadow and the cut edge is explicitly visible. Does the shadow fall on the layer below or on the table? At 9:16, does it re-anchor with each vertical box or stay fixed to the 16:9 plate? Does the shadow tone count against the four-colour frame, or is it outside the palette roles?
   - **Print:** the layers stay flat and only the type keeps the hard offset shadow. The card's Print panel also removes the 2 px cream lip from its paper pieces and gives the type only an ink shadow. STYLE says the cut edge is visible and the type always carries a cream cut edge. Which is authoritative? If Print is chosen, how should the required cut-paper edge be shown? This is the defect that needs a ruling before the cut-edge check is valid.
   - The answer matters most in shots 1, 3, 4 and 6, which carry the sunburst, portrait window, sticker and diorama. Shot 5's cast also gains or loses contact shadows.

2. **Palette — day-stage or night-stage?** The treatment names `day-stage` for last light, the pack default. Do you confirm, or do you want `night-stage`? Night changes the paper stock and ink set, makes the accent pink, and turns the closing city into a night plate. Palette is a director choice and not a resolver field, so it needs a sign-off.

3. **Second performer — who and how credited?** `stage_wide` is the only two-cast recipe, but the brief has one `names` string. Is the second performer an unnamed drummer/foil, or do you want them named? If named, does `names` carry both within eight words, and is there a credit outside the film?

4. **Track and voice — what is the actual audio?** The pack supplies no audio. Is the cleared track exactly 88 BPM with the 0.21 s offset? Who supplies the master? Is there a vocal line? If yes, it is one short line, not a lyric wall, and who performs it? Does that line appear in the portrait lyric band, whose only slot is `content.caption` and currently carries the venue/time?

5. **Loudness — where does it live?** STYLE says delivery loudness belongs to the format, but `format.json` has no loudness field and the application forbids adding one. What is the target, and where should it be recorded? This is a schema gap.

6. **Date, door time and venue copy.** `content.date` and `content.venue` are not read by the pack. The film says "doors at dusk" and puts "The Fold, rooftop" in the caption. Is there a real date or door time to show? If yes, it must replace the caption or subtitle; there is no extra slot. Is the exact on-screen form "The Fold, rooftop" with the comma?

7. **CTA, RSVP or hashtag.** `content.hashtag` and `content.rsvp` are not read, and `pullback_close` has only `monogram` and `body`. Do you want a ticket, RSVP or hashtag line? If yes, it replaces `content.body`, which is also the sticker quote, the stage lower third and the type-stack body. Tagline or CTA — which one body line?

8. **Track title.** `content.title` is the film title; a separate track title belongs in `subtitle`. The subtitle currently carries the artist and "soundcheck". Is a track title required? If yes, it replaces that line; there is no second subtitle slot.

9. **HUD readout and corner marks.** STYLE says the meter reads beat and palette, but `stage_wide`'s `hud.meter` has no content slot and no readout format. Should it print "88 / DAY", "88 BPM", a level bar, or something else? Is that HUD furniture or invented content? The close's corner marks also have no colour or weight specified.

10. **Six-shot pacing.** The six chosen minima sum to 14.4 s; the maxima sum to 33.0 s. Starting at the minima and sharing 15.6 s by remaining capacity lands at 4.855–5.193 s per shot, about 7.1–7.6 beats at 88 BPM and near each recipe's maximum. Is that the intended cut rate for a six-shot music Short? The pack's 8-shot 9:16 format would cut more often. Should the lead also plan an 8-shot release variant while keeping this six-shot application?

11. **Close hold and room tone.** `pullback_close` ends on `hold`, and the film is exactly 30 s. Does the final hold sit on the last beat, or is there room tone after it? The pack says the close may hold on room tone but supplies no audio.
