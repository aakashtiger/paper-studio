# Questions the pack did not answer

Route: `watercolor_title` → `watercolor_specimen` → `watercolor_quote` → `watercolor_mist` → `watercolor_specimen` → `watercolor_close`, 30 s at 9:16. The six invariants are all showable in this route; none is listed below as unshowable. These are contract gaps, not requests for a new look.

## 1. One caption has to do four jobs

Six shots drawn from five page contracts force one repeat. I repeated `specimen` because a second plate is native to a field journal, but that makes `content.caption` the plate note in shots 2 and 5, the note beside the quote object in shot 3, and the closing line in shot 6.

What I did: one value, "the hour the house kept", read as a running note and as the close.

What the pack does not say: how a repeated caption should read in four different compositions, or whether the close is allowed to share its closing line with a plate note. If the close needs its own sentence, S1a has no second caption slot; per-shot notes are S2.

## 2. What does the mist erase?

`watercolor_mist` has no `slots`, no `image` op and no source reference. It is paper, a `paper`-coloured wash and a rising edge. The S1a note says to place the mist after a quote rather than after a specimen; I did.

What the pack does not say: which painting the mist washes back. Does the resolver feed the previous shot under the mist, or does the preceding wipe leave it erasing a blank sheet? Without an answer the shot is either an erase or a breath on nothing.

## 3. Where are the 9:16 coordinates?

The recipe `composition` boxes are normalized 1:1 placements. The pack fixes the 9:16 type scale (44 / 24 / 24 / 14, monogram 18) and says keep the title left and the arch right, but gives no 9:16 placement for the arch (0.6–0.94 × 0.16–0.64), the specimen's note column (0.54–0.92) or the quote's object (0.64–0.94).

What I did: kept the title, subtitle, body and caption short enough for a narrow left column.

What the pack does not say: whether those boxes scale — which would stretch a 0.46 × 0.6 plate into a 9:16 frame — or whether a 9:16 placement table exists that the application guide does not show. I cannot verify the note and leader placement without it.

## 4. One prop asset, three named subjects

`prop.painted-specimen` is the hero asset in `watercolor_specimen`, `watercolor_quote` and `watercolor_close`. The style asks for one named hero subject per view, and the guide says the treatment may name what is painted. I name a stair tread (shot 2), a stair window (shot 3) and a baluster (shot 5).

What the pack does not say: whether the prop is parametric per shot and which parameters it exposes, or whether a real film needs three prop variants. A new prop would be a pack change I am not allowed to make.

## 5. Is a two-appearance accent a recurrence?

Only `watercolor_title` and `watercolor_close` carry `prop.stamp-seal`; specimen, quote and mist have no accent element. The style says the accent recurs and the mist may carry none.

What the pack does not say: whether two vermilion marks in a six-shot page satisfy "recurs", or whether a plate or the quote should carry the accent, which the recipes cannot do without a change. I kept it to shots 1 and 6 rather than adding an element the pack does not define.

## 6. There is no attribution slot

`content.body` is the only quote slot and `content.caption` is a hand note.

What I did: the line is original prose, so it needs no attribution and is not a lyric.

What the pack does not say: if a client's remembered sentence needs a speaker, where the attribution lives. The only candidate is the caption, which would then repeat in four frames; a spoken attribution is a film decision, not a style rule.

## 7. Is `evening-blue` proven?

The card, the proof frames and the pack's examples are all `garden-day`. `evening-blue` is declared in `tokens.color.palettes` with hexes but has no proof frame at any aspect.

What the pack does not say: whether a 9:16 page may use the second palette in S1b, or whether it is a director choice that waits for S2 pixels. I chose it because a house at 4:10 pm wants the cooler wash and the ochre light, and I flagged it here rather than pretending it is proven.

## 8. Does the mist paint in?

The 1.2 / 1.8 s choice applies to "any painted form", with the specimen as the reference. The mist is a paper-coloured wash, not a painted form, and it has a 4 s minimum with a pull-back.

What the pack does not say: whether the mist is exempt from the paint-in choice, or whether it also takes 1.8 s — and if so, from which edge. My mist is 4.5 s, so either reading fits the duration, but not the same film.

## 9. One label set for six shots

`content.date` and `content.venue` are the only label slots. The title, both plates and the close all read them.

What I did: made the film one afternoon in one stairwell, so "12 APRIL 2026" and "STAIRWELL, 4:10 PM" are true in every frame that carries them.

What the pack does not say: what to do if the close needed the sale date (three weeks later) or the title the house's name rather than the room. There is no second date or place slot, and a house number is not a measured label.

## 10. What does `sequence[].count` mean?

The example uses `count: 1`. The guide says a beat role may appear more than once in `sequence`, that each occurrence is a separate shot and that each gets its own allocation.

What the pack does not say: whether `count: 2` produces two shots with two allocations, or one shot. I avoided the ambiguity with two beat keys (`first-plate`, `second-plate`) that both map to `detail`; the format is explicit, but I do not know if that is the intended way to repeat a page contract.

## 11. Loudness has no field

The pack says delivery loudness belongs to the format, and the format schema carries id, name, beat roles, sequence, durations, aspects and primary aspect only.

What the pack does not say: where the loudness value is recorded so the lead can pass it to the mix. The treatment can name a sound plan, but a director note is not a format field.
