# Questions the pack did not answer

Ordered roughly by how much they change the film. Each one names the evidence I found
and the call I made in the four files.

## 1. Can a 30 s, six-shot film use `watercolor_walk` at all?

No. The walk's minimum is 12 s. The six recipe minima sum to 33 s
(4 + 5 + 4 + 4 + 12 + 4), and even five 4 s companions only reach 32 s. So
BRIEF.md §4 ("each shape uses the same six shot contracts") and
`capabilities.governance.decisions[format-structure]` ("9:16 blind page, six shots")
cannot both be taken literally at 30 s: the pack's own sealed proof must have left
the walk out. `portrait` is then a closed beat role that no 30 s film can reach,
and `open` and `list` have no recipe at all.

**Call made:** the route uses five contracts and repeats the specimen.
**Question:** is 30 s meant to be five contracts plus a repeat, or is walk's
minimum wrong for the vertical page? Should the 9:16 format say "no walk" outright?

## 2. By what rule does the resolver allocate the 30 seconds?

APPLICATION says only that it "takes the smallest common duration and allocates it".
The pack gives min, max and default per recipe and nothing else. This route's
defaults sum to 36 s (6 + 7 + 6 + 7 + 5 + 5), so defaults cannot be used raw.
An equal split gives 5.0 s per shot, which is the only allocation that keeps every
shot inside its own range (4–8, 5–10, 4–8, 5–10, 4–7, 4–7) and lands on the 48 BPM
bar grid (one 4-beat bar is 5.0 s; 30 s is six bars).

**Call made:** the treatment is written for 5.0 / 5.0 / 5.0 / 5.0 / 5.0 / 5.0.
**Question:** is equal split guaranteed, or is allocation proportional to
`duration.default`? If it is proportional, every second in the treatment is wrong.

## 3. May a beat role appear twice in `sequence`, and does it reuse the same recipe?

I need `detail` twice (two plates). The format schema allows any number of sequence
entries and the pack has exactly one `detail` recipe, but nothing says whether a
duplicate role is legal, whether the resolver reuses `watercolor_specimen`, or
whether it allocates each occurrence separately (5.0 + 5.0 rather than one 5.0 split
in two).

**Question:** if duplicate roles are illegal, a six-shot 9:16 film is impossible
without also breaking question 1.

## 4. One `content.caption` carries every hand note in the film.

`watercolor_specimen`, `watercolor_quote`, `watercolor_walk` and `watercolor_close`
all bind `content.caption`. In this route the same string is the
specimen note (shot 2), the quote's note (shot 3), the second plate's note (shot 4)
and the closing line (shot 6) — one note, four appearances, four different leaders or
none.

**Call made:** a two-word refrain, "still here", so the repetition reads as an
inventory tick and not as a copy error.
**Question:** is a repeated note intended (a running margin note, like a field
journal's header), or should the brief carry per-shot notes
(`content.notes: [ ... ]`)? As it stands, no six-shot film can write three different
hand notes, which is a content limit, not a style choice.

## 5. Does the 9:16 page recompose the recipe boxes, and what is its type scale?

STYLE.md says the 9:16 page is "a vertical journal page, not a crop of the scroll …
Never stretch a page to fit a new aspect; recompose it." But each recipe hands the
resolver one set of normalized boxes, and `tokens.type.scale` is absolute
(display 64, body 28, caption 24, label 14). On a 390 × 693 frame:

- title box 226 × 125 px; a three-word title at 64 px needs two or three lines
  (118–177 px), so it only just fits or overruns;
- subtitle box 195 × 55 px; one 64 px line is already about 59 px at the card's 0.92
  line-height, and this brief's six-word subtitle needs about three lines (177 px);
- the label role is 14 px, exactly the floor.

**Call made:** the treatment assumes the resolver widens the boxes and drops the
display size to about 44 px for 9:16.
**Question:** if the boxes and scale are taken as authored, `watercolor_title`
cannot hold a real subtitle at 9:16. What is the 9:16 scale, and does the 14 px floor
survive it?

## 6. In `watercolor_title` the arch sits directly under the title.

The garland is composed at x 0.02–0.38, y 0.12–0.62; the title box is
x 0.08–0.66, y 0.22–0.40 and the subtitle x 0.08–0.58, y 0.42–0.50. The arch runs
under both lines at 0.9 opacity, against "the title lives in the top-left quiet zone"
and "no text over the subject". The card's own title frame draws no arch at all.

**Question:** which moves — does the resolver drop the arch from the title plate, or
is the arch meant to be a pale wash the title sits on? Its opacity is 0.9, not pale.

## 7. Annotation coverage is uneven across the recipes.

STYLE.md: "One hand annotation per view, with a leader line and a measured label."
`watercolor_quote` composes a leader and `content.caption` but has no label slot at
all. `watercolor_close` composes `content.date` as a label and `content.caption` but
has no leader path. `watercolor_mist` has neither, by design.

**Call made:** the quote's note is a footnote and goes unlabelled; the close's note
is a closing line, not an annotation.
**Question:** which is the exception — a quote without a measured label, or a close
without a leader line? Or is the rule meant for specimens only?

## 8. Where is a director's choice recorded?

`capabilities.governance.choices` offers paint-in 1.2 s or 1.8 s. The palette is
`garden-day` or `evening-blue`. The sound plan has to say when the music stops. The
repo's determinism rule needs a seed. None of these has a field in `brief.json` or
`format.json`, and neither file has a notes area.

**Call made:** 1.2 s (a 5.0 s plate needs the shorter reveal), `garden-day`, music
out at 20.0 s, seed 9.
**Question:** where do they live — a third file, a `director` block, or fields the
two schemas are missing? If the seed is not recorded next to the brief, two runs of
the same film cannot be checked against each other.

## 9. Is the accent required in every frame?

The card's parameter block says "accent one per frame"; STYLE.md says a single
vermilion or rain-blue mark "recurs". `watercolor_mist` composes no accent and
`watercolor_quote` composes none either.

**Call made:** I read "recurs" as governing, and put the vermilion mark only in
shots 1, 4 and 6.
**Question:** is a frame without the accent legal? If not, the mist recipe is missing
a mark it needs.

## 10. How long is the silence before the close?

The mist is shot 5 and the close is shot 6, so "music out at the mist and before the
close" means the music stops at 20.0 s in a 30 s film: ten seconds of silence, one
stamp thump around 27 s, then a held blank. `watercolor_close` also lists "music
under the close" as a failure mode, so the music cannot return.

**Call made:** silence from 20.0 s to the end, with a single stamp thump as foley.
**Question:** does "before the close" mean the whole mist plus the close, or a
shorter pre-roll (the last bar, say)? And is a foley thump allowed at the close, or
does the rule bar all sound there but paper and room?

## 11. The brief schema is invitation-shaped, and this film has no invitation.

`content.rsvp` and `content.hashtag` mean nothing in a memory film and no recipe uses
them; I omitted both. Two larger gaps:

- `photos.hero` may be the only place a brief can name a subject, since the style
  allows a photograph as reference for a painting. A wholly invented subject — a
  latch, a stair nosing, a key, a keyhole — then has no field at all, and all four of
  this film's subjects exist only in the treatment, not in the brief that is supposed
  to be the contract.
- `photos` itself may or may not be required to exist as an empty object.

**Call made:** `photos` omitted, `names` kept for provenance.
**Question:** which fields are required for a non-invitation brief, and where does a
brief declare what each specimen is?

## 12. One `venue` label for every plate.

`watercolor_title` and `watercolor_specimen` both bind `content.venue` as their IBM
Plex Mono label, so the same string labels the street plate, the latch and the key —
three labels, one string. A naturalist's plate is labelled with the specimen's own
place and time ("KITCHEN, 11:40"), not with the street.

**Call made:** the street on all three, so the label repeats.
**Question:** is `venue` meant to repeat as a running header, or does a specimen need
its own label? If it needs its own, the schema has nowhere to put it — which is the
same gap as question 11.

## 13. `watercolor_quote` composes the thing its own failure list refuses.

The recipe puts a `wash` shape at x 0.06–0.56, y 0.20–0.54 (petal, 18%) and the quote
text at x 0.08–0.54, y 0.24–0.54, entirely inside it. Its own `failureModes` starts
with "a wash rectangle behind a quote", and STYLE.md's authoring log answers "Is the
quote a wash rectangle behind text? — No." As authored, shot 3 is that rectangle.

**Call made:** the wash is the late light on the stair wall — three irregular passes
whose edge stops short of the text's line ends, so the words sit on paper.
**Question:** is a soft, jittered wash patch behind text legal? If only a hard
rectangle is refused, the failure list should say so; if any wash behind text is
refused, the recipe needs recomposing before shot 3 can ship.
