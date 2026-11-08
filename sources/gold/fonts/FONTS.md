# The gold's fonts

Nine files, taken from `Y:\NewVideoTest\assets\fonts` — the fonts the gold film
actually loads. They are here as evidence of the look, **not** as the pack's
fonts: the pack's own copies live in `styles/paper-kpop/fonts/` with their
licence files, and that is what a render may use.

## What the pack already has

`styles/paper-kpop/fonts/` carries five of these nine:

- `Anton-Regular.ttf`
- `ArchivoBlack-Regular.ttf`
- `DMMono-Medium.ttf`
- `DMMono-Regular.ttf`
- `PermanentMarker-Regular.ttf`

## What the pack is missing

Four fonts the gold uses and the pack does not carry:

| File | Where the gold used it |
|---|---|
| `BlackHanSans-Regular.ttf` | the heaviest display type — Korean-capable poster weight |
| `InstrumentSerif-Regular.ttf` | the serif voice: titles and the `a paper singularity` line |
| `InstrumentSerif-Italic.ttf` | the same, slanted — emphasis inside serif lines |
| `SpaceGrotesk.ttf` | the geometric sans used for small type and numerals |

**This is a finding, not a change.** Adding them to the pack changes what a
sealed style can draw, so it is a creative decision for M1 with a `style:check`
pass and a new pack hash — done under the pack's own rules, not by copying a file
into `styles/` because it is convenient. `docs/M1-HANDOVER.md` names it in the
open questions. Until then the four files sit here, unused, as the record of what
the gold looked like.

## Licence

All nine are Google Fonts, distributed under the SIL Open Font License 1.1 except
`PermanentMarker-Regular.ttf`, which is Apache-2.0. The pack's
`styles/paper-kpop/fonts/OFL.txt`, `LICENSE-Apache-2.0.txt` and
`FONT-LICENSES.md` carry the full texts for the five it ships; the four above are
OFL 1.1 like the rest and would ship with the same files if M1 adopts them.

OFL permits redistribution, including inside a repository, provided the licence
travels with the font — which is why these are inside a folder that names them.
