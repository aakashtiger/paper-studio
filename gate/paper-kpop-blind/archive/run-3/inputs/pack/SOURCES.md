# Sources and frame provenance

## The source film

The style was extracted from the author's own 157-second paper-cut music film: 1920 x 1080, 30 fps, 4,699 source frames. The film is the author's own work and is read-only evidence. Its story, lyrics, character names, audio, shot order and title are not part of this pack. The pack uses the measured paper grammar, not the film.

The full extraction, with the D01-D27 evidence table and the not-taken list, is in the project's `sources/paper-kpop/autopsy.md`.

## Reference frames

Six local crops live in `references/frames/`. They are visual evidence only, never rendered output and never a shot plan. The card uses exactly three of them: portrait, chorus and macro.

| Local file | Source frame | Source timecode | Crop box (x,y,w,h) | What it proves | Removed text | Card timecode |
|---|---|---|---|---|---|---|
| `references/frames/portrait-paper-cast.jpg` | f00105 | 00:00:03.500 | 925,160,635,740 | Paper portrait: layered hair, petal collar, brad joints, cream edge, offset shadow. | Lyric band, source title, source character labels. | 00:03 |
| `references/frames/chorus-stage.jpg` | f00700 | 00:00:23.333 | 920,100,720,720 | Stage grammar: sunburst, repeated cast, blue floor, confetti, costume rhythm. | Lyric band, source title, source character labels. | 00:23 |
| `references/frames/macro-prop.jpg` | f00516 | 00:00:17.200 | 600,160,700,760 | Macro prop: stacked cut cylinders, contact shadow, negative space. | Lyric band, source title, source character labels. | 00:17 |
| `references/frames/open-sunflower.jpg` | f00027 | 00:00:00.900 | 800,300,320,480 | Cut-paper sun: radial petals, gold centre, dark ground, no soft brush. | Lyric band, source title, source character labels. | evidence only |
| `references/frames/throne-orbit.jpg` | f00426 | 00:00:14.200 | 900,100,560,600 | Prop-portrait: paper chair, seated lead, halo, red room, limited palette. | Lyric band, source title, source character labels. | evidence only |
| `references/frames/desk-diorama.jpg` | f04590 | 00:02:33.000 | 280,600,280,240 | Desk diorama: paper figure on a ruled sheet, cutting mat, tabletop scale. | Lyric band, source title, source character labels. | evidence only |

The crop box is the delivered crop inside the 1920 x 1080 source frame. Every crop removes the source lyric band, the source film title and the source character labels. The text gate cannot read pixels; the crop table above is the manual on-image check.

## What is not included

- No song, lyric, vocal, music, stem, sound effect or audio file.
- No source character name, source scene name, film title or source story.
- No uncropped source frame and no frame used as a rendered asset.
- No third-party code. The read-only `reference/paper-kpop/` modules are not imported.
- No external URL, network request or path outside this pack at runtime.

## Rights

The film, its frames and the style extraction are the author's own work. The six crops are included as evidence with the pack; they are not a licence to reuse the film outside this project.

The fonts are third-party works under open font licences. See `fonts/FONT-LICENSES.md`, `fonts/OFL.txt` and `LICENSE-THIRD-PARTY.txt`.

The pack itself is proprietary Paper Studio work. It is not CC0 and it is not a redistribution of the source film.
