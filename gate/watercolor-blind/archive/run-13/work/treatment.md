# Treatment — Before the Keys

**Film.** 30 s, 9:16, six shots on the vertical page. Clara Ibarra's house is being
sold; the film is the inventory she makes on the last afternoon — 12 April, 4:10 —
before the keys change hands. All of it is fiction: the house, the address, the
family, the marks on the doorframe. Clara is moving out, not being remembered, so
the register is curious and exact, never solemn and never a greeting card. No
on-camera cast, no hands, no photograph and no footage; the objects are painted,
not handled. The song is a wordless felt-piano motif — no lyric and no song title,
so nothing is borrowed. The brief carries no hashtag, rsvp or photo field: no recipe
reads them and the style refuses a pasted photograph.

**Argument.** The refrain is "Only the light moved." It is what the house would
say. The plates answer it: the key still hangs by the door, the third tread is worn
pale, the height marks climb the frame, and the last mark is still being painted
when the film ends. The film asserts nothing the objects do not show, and it never
says what the house is worth.

**Director's choices.** Paint-in 1.8 s per painted form — the slower option; the
shots are 4.5–5.8 s and the look between the paint and the note needs the room.
Palette `garden-day`: paper #f3ead9, ink #2f2a24, wash #9fb7a4, petal #d9a6a0,
accent #c65438; five pigments at most in a frame, `deep` from more passes and never
a second tube colour. Camera: the recipes' own push-ins — title 1.00→1.04,
specimens 1.00→1.06 — and static quote, mist and close. No voice: `content.body` is
set, not spoken. One accent: the vermilion seal, 0.10 × 0.056 at 9:16, at the
title's top-right margin and the close's left margin only — no other vermilion in
the film. Seed: the lead's integer; stroke phase, fibre offset, wash-edge jitter,
paint-in order and sway phase are all seeded.

**Subjects, shot by shot.** 1 the porch arch and the ivy that stays behind;
2 the front-door key with its paper tag; 3 the kitchen window's brass catch; 4 the
erase of the window and the catch, no subject of its own; 5 the third stair tread,
worn pale at the front edge; 6 the pencil height marks on the kitchen doorframe.

**The 9:16 page.** Recomposed, never cropped, at a 390 px authoring width: display
44, body 24, caption 24, label 14, monogram 18, scaled proportionally with the
14 px floor kept. Boxes come from `tokens.layout.aspectBoxes["9:16"]` through each
recipe's `vertical` map:

- **title (1):** title 0.08/0.18/0.46/0.22 in the left column; arch 0.56/0.22/0.34/0.40
  on the right; horizon 0/0.55/1/0.30 full width; seal 0.80/0.04; monogram
  0.80/0.12; venue 0.08/0.76; date 0.08/0.82.
- **specimen (2 and 5):** specimen 0.16/0.12/0.52/0.40; edge-wash 0.14/0.16/0.56/0.40;
  note 0.08/0.58/0.60/0.12; label 0.08/0.82/0.60/0.05.
- **quote (3):** quote 0.08/0.24/0.48/0.30; object 0.58/0.16/0.32/0.46; object-wash
  0.56/0.50/0.36/0.16; note 0.08/0.60/0.48/0.14.
- **mist (4):** full frame; the recipe has no `vertical` map and needs none — the
  frame is the outgoing quote, not a new sheet.
- **close (6):** detail 0.52/0.16/0.36/0.46; wash 0.48/0.46/0.44/0.28; paper-gap
  0.82/0.18/0.05/0.34; seal 0.10/0.18; monogram 0.10/0.30; note 0.10/0.38/0.40/0.14;
  date 0.10/0.62.

The two `leader` ops are not in either `vertical` array, so I re-anchored them by
hand: specimen (0.40, 0.50) → (0.28, 0.578); quote (0.58, 0.52) → (0.46, 0.60).
Both specimen subjects are painted to fill the specimen box, so one path touches
the key's tag and the tread's front edge without moving. Leaders are the rigger at
1.5 px, ink at 0.7, grown from the note to the subject (question 5).

No text box covers a painted subject except the 0.02 sliver where the subtitle box
meets the arch box (question 6); the set subtitle stays short and left of it.
Words: title 15 characters in two lines, subtitle 29 in two, names 16 in one, body
45 in three, caption 21 in two at the tightest box — the close note, 0.40 wide.
Every slot is under the 16-word cap; the caption is 4 words, the body 9. Latin
script only.

**In-shot timing.** Each incoming transition sits inside its shot; each outgoing
wipe takes the last 0.3 s (question 9). Shots 2 and 5: the form paints 0–1.8 s, is
left alone 1.8–2.4 s (the look), then the leader grows and the note writes
2.4–3.4 s, the label sets, and the push-in carries the rest. Shot 3: the catch
paints 0–1.8 s while the quote writes 1.6–2.9 s, the note writes 2.9–3.7 s, static.
Shot 1: horizon 0–0.9 s, arch 0.9–2.7 s (the 1.8 s reference), the seal stamps
2.8 s, the title writes 2.9–3.7 s, subtitle 3.4–3.9 s, names 3.8–4.1 s, labels
4.1 s, wipe 4.37 s. Shot 4: the wave rises 0–3.8 s, the full pass lands 3.8–4.1 s,
the fibre stays over it, and 0.4 s of blank sheet is left before the exit. Shot 6:
the frame paints 0–1.8 s, the seal stamps 2.0 s (the one thump), the closing line
writes 2.1–2.9 s, the date sets 2.9 s, and the last wash pass creeps 3.2–4.5 s,
still short of the paper gap when the film ends.

**Sound.** One felt-piano motif at the 48 BPM breath, unhurried; brush rustle for
each paint-in, pencil scratch for the two notes, a soft page turn at 10.5 s and
25.5 s. Music is out at the mist (15.167 s) and stays out through the close — paper
and room only — with one quiet stamp thump at the close seal (27.5 s). No drums, no
voice, no third-party audio.

## Route

| # | Recipe | Beat role | Seconds | Invariant it proves |
|---|---|---|---|---|
| 1 | `watercolor_title` | title (opening) | 4.667 | Paper is the white — the sheet above the horizon is left unpainted; painting-in — the arch, 1.8 s |
| 2 | `watercolor_specimen` | detail (firstPlate) | 5.833 | Pooled edge — the three-pass edge-wash; annotation leader — the note on its leader |
| 3 | `watercolor_quote` | quote (said) | 4.667 | Painting-in — the object by the same 1.8 s rule; pooled edge — the object-wash |
| 4 | `watercolor_mist` | transition (erase) | 4.500 | Paper is the white — the erase ends on full paper, fibre over it; no vector outline — the rising edge is a wash |
| 5 | `watercolor_specimen` | detail (lastPlate) | 5.833 | Flying white — the 8 px tread edge with 3–9 bristles; annotation leader — the shared path |
| 6 | `watercolor_close` | close (closing) | 4.500 | Paper gap — the sheet through the stopped pass; no vector outline — no contour on the unfinished edge |

**Allocation.** The resolver's rule, not an equal split: minimums 4+5+4+4+5+4 = 26 s;
the 4.000 s remainder is shared by remaining capacity 4+5+4+3+5+3 = 24, i.e.
166.667 ms per unit. Shares 666.667 / 833.333 / 666.667 / 500 / 833.333 / 500 ms;
the floors 666/833/666/500/833/500 sum to 3 998 ms, and the 2 leftover ms go to the
two largest fractional remainders (title and quote, both .667). Totals
4.667 / 5.833 / 4.667 / 4.500 / 5.833 / 4.500 = 30.000 s. No shot is 5.0 s.

**Transitions.** wipe (1→2), page_turn (2→3), wipe (3→4 — the quote's outgoing wipe
and the mist's rising edge are one erase, with no page turn between), wipe (4→5,
paper to paper and invisible by design), page_turn (5→6), hold (6). No cut and no
dissolve. The walk is not used: its 12 s minimum cannot fit a 30 s six-shot page
and a page is a locked sheet; `open` and `list` have no recipe in this pack.

## Invariants

- **Paper is the white:** every frame begins on the sheet (#f3ead9); in shot 1 the
  area above the horizon is left unpainted rather than painted white; shot 4's mist
  is `paper` and ends on the full sheet with the fibre over it; shot 6's gap is the
  sheet showing through — a paper-coloured shape that only reads once the wash
  surrounds it, not a white fill. The key's worn bow and the tread's worn edge let
  paper through instead of adding a white.
- **Flying white:** the arch's piers and beam (shot 1), the key's bow (shot 2), the
  tread's front edge (shot 5) and the doorframe's stile (shot 6) are `wide` strokes,
  8 px at 390 with the 6 px threshold scaled alongside, so they carry 3–9 bristle
  tracks that break into dashes. The 4 px `standard` and the 1.5 px `rigger` never
  carry bristles, so the key's shank, the tag string and every leader are one clean
  stroke.
- **Pooled edge:** shot 2's edge-wash, shot 3's object-wash and shot 6's close-wash
  are three passes of the same shape with jittered vertices, so the edge darkens
  where the passes disagree. The pooled edge is the form's own edge, never a
  contour drawn over it.
- **Painting-in:** structure before detail at 1.8 s per form — the arch (1), the key
  (2), the catch (3), the tread (5), the doorframe (6). Nothing is revealed by a
  pan; the mist is a wipe, not a paint-in; finished forms are cached and only sway,
  so the ivy on the arch sways at 0.006 after 2.7 s.
- **Annotation leader:** shots 2 and 5 carry one Caveat note on the leader, drawn
  twice over a 12 px paper halo and revealed left to right; shot 3 carries the
  quote's note on its own leader. The title is a title plate and carries none, the
  mist is silent, and the close's line is a closing line, not a leader note — its
  recipe has no leader.
- **No vector outline:** no form has a contour. The specimen, the catch and the
  doorframe are built from washes and brush strokes; the only drawn lines are the
  1.5 px leaders; the arch's edge is a brush stroke of varying width, not a uniform
  line; shot 6's unfinished edge is a stopped wash with the sheet showing, and
  shot 4's rising edge is a wash shape, not a stroked cloud.

## Questions

Full detail in `questions.md`; numbering matches.

1. One caption lands on four of six plates: is a single refrain the intended
   reading, or should the route avoid it?
2. Attribution when the caption is the refrain and the body is the line.
3. One venue for two specimens in two rooms — is a per-plate label S2?
4. A title plate for a film with no date or venue: six required slots, no shorter
   contract.
5. `leader` is missing from both `vertical` maps: is the author's re-anchor
   authoritative, or should the map carry it?
6. The subtitle box ends at 0.58 and the arch box starts at 0.56: is the arch inset
   inside its box, or is the subtitle capped?
7. Line caps for title, subtitle and body: only the caption and names have them.
8. Is the card's uppercase labelling a rule, or the card's own setting?
9. Wipe, page_turn and hold have no duration, and no rule for whose seconds they
   occupy.
10. Is 1.8 s per painted form or per shot, and is a wash a form?
11. How does set type appear — written, revealed, or present at frame 1?
12. The mist's `mist` / `mist-full` / fibre order, the wavy edge's y at 9:16, and
    how long the erase takes.
13. May a painted plate follow the mist, or is the mist only a bridge into the
    close?
14. Is the title's stamp silent, or does it share the close's one thump?
15. What pins the per-shot subject when the treatment is not a sealed input?
