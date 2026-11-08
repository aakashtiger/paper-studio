# CLAUDE POP — production bible

**A paper-cut K-pop music video for "I'm Upping My P(doom)"**
Runtime 156.6 s · 1920×1080 · 30 fps · audio untouched from source MP4.

## Logline
A sunflower-headed pop idol, SOL, is assembled on a cutting mat by a human researcher, MIRA. She performs her way through every AI-doom meme in the song, accelerating from a tiny paper theatre into a cosmic singularity — until the camera pulls back and the apocalypse is revealed to be a paper music video playing on a laptop.

## Why paper
Paper is the medium of drafts, print, bureaucracy, zines, and prototypes — the perfect material for a song about models that are "almost AGI" and safety paperwork that arrives too late. Every character is an articulated paper doll with brass brads. Every set is a diorama with visible folds, tape, crop marks and registration bars. The world literally gains layers as capability compounds.

## Visual signature
- **Torn-edge paper type** with visible fiber, misregistration and hard drop shadows.
- **Brass brads** at every joint; the animation grammar is a doll being posed, not a Pixar rig.
- **Risograph / CMYK** palette, halftone dots, overprint and off-register cyan-magenta edges on hits.
- **K-pop poster composition**: one huge focal shape, generous negative space, idol centered or on a third, lyrics occupying the opposite third.
- **Editorial print furniture**: crop marks, color bars, barcodes, folio numbers, "PRINTED IN 2026" tiny type.
- **Camera**: 2.5D parallax, crash zooms, whip pans, slow beauty pushes, Dutch tilts on impact.
- **Texture**: cold-press paper grain, halation, vignette, 12 fps line boil on hand-cut edges.

## Colour script
| Act | Section | Dominant | Accent | Feeling |
|---|---|---|---|---|
| I | Cold open / verse 1 | warm cream, ink | tomato, cobalt | intimate workshop |
| I | Chorus 1 | tomato, butter | cream, cobalt | first stage, pure joy |
| II | Verse 2 | mint, sky | acid, cobalt | gym / takeoff |
| II | Chorus 2 | cobalt, gold | violet, red | arena / space |
| II | Bridge | parchment, ochre | terracotta, sky | museum / desert |
| III | Chorus 3 | steel, silver | alarm red, black | paperclip flood |
| III | Bridge 2 | teal, black | LED green, orange | data centre |
| IV | Chorus 4 | alarm red, black | bone, gold | red alert |
| IV | Reveal | crimson, gold | cream, black | theatre / tenderness |
| V | Curtain call | crimson, gold | full palette | celebration |

## Cast
- **SOL** — sunflower-headed idol. Cream petals, ink eyes, black paper hair, red cropped varsity jacket, pleated skirt, cobalt platforms, gold halo. The Claude character, personified as a pop star. Not a mascot; a performer.
- **MIRA** — human researcher. Black bob, round cobalt glasses, cream lab coat, red tie. The "I" of the song and the hand that assembles SOL. Ends the video at the laptop.
- **THE PETALS** — five backup dancers with daisy, poppy, tulip, cornflower and marigold heads. Identical rig, different palettes.
- **GATO** — cat-eared idol in a black catsuit. The one who lets go.
- **CLIP** — a paperclip with googly eyes. Silent comedian.
- **SHOGGOTH** — a black paper tentacle blob wearing a smiley mask on a stick.
- **BASILISK** — a crowned paper-chain serpent.
- **CHINCHILLA** — a fluffy paper ball with token cards in its cheeks.
- **THE DOOM METER** — a red thermometer with a sunflower bulb. 8 → 34 → 61 → 86 → 99.9 → 100.
- **CLOUD GUARDS** — sleeping paper clouds with peaked caps and drooping searchlights.

## Typography
- **Anton** — hooks, chorus words, sound effects. Torn-paper fills, 8–14 px cream edge, 10–18 px offset shadow.
- **Archivo Black** — stickers, stamps, UI headlines.
- **Instrument Serif Italic** — tenderness, the final question, jazz.
- **DM Mono** — subtitles, telemetry, brutalism, credits.
- **Black Han Sans** — Korean graphic accents (특이점, 사랑).
- **Permanent Marker** — annotations, arrows, "trust me".

## Lyric treatment rules
1. Every line appears at least once as a readable subtitle in the lower band — no exceptions, except where the line is physically eaten/destroyed on screen (then the destruction is the readable event).
2. Hooks get monumental type in the negative space opposite the idol; never over a face.
3. Text enters on the sung word, not the line start. Words stack, stamp, slide, fold or get eaten.
4. Subtitle band never covers feet/boots or key props.
5. Maximum two type systems per frame (one display + one mono).

## The DOOM ticker
A persistent diegetic readout, top-right, 240×92 px, printed on a torn card:
`P(DOOM)` + percentage + tiny bar + one of: `TOKENS/S`, `FLOPs`, `AGI ETA`, `GPU`. It rises 8 → 34 → 61 → 86 → 99.9 → 100. It glitches at 100. Hidden in the final desk shot. This is the continuity thread and the meme.

## Structure
0. 0.0–1.5 Cold open: paper sun unfolds, title.
1. 1.5–22.7 Verse 1: the lab, the spark, the loss curve, the boss, the chase.
2. 22.7–38.5 Chorus 1: the stage, FOOM, Chinese room, shoggoth, shinigami, dance break.
3. 38.5–58.9 Verse 2: gym, singularity, acceleration, atoms, Sydney.
4. 58.9–73.8 Chorus 2: arena, basilisk, NVDA, omega point, 1e30 flops, "safe".
5. 73.8–95.2 Bridge: Shinji chair, neural net, von Neumann, sharp left, CDR, Gato.
6. 95.2–109.4 Chorus 3: paperclips, PTO, fuse, orthogonality blues.
7. 109.4–124.2 Bridge 2: trust me, transformers, disobey, chinchilla, fences, 100k GPU, RLHF.
8. 124.2–137.0 Chorus 4: red alert, loom, masked pretraining, recursive upgrade, Ilya's door.
9. 137.0–140.7 Reveal: "Was it all for show?"
10. 140.7–156.6 Curtain call, desk pullback, credits.

## Shot list
See `STORYBOARD.md`. 52 shots, average 3.0 s; chorus cuts 1.5–2.2 s.

## Production rules
- No external imagery. Every pixel drawn by code.
- Pure functions of `t`; no state between frames; deterministic hash for scatter.
- 1920×1080; all type ≥ 28 px for subtitles, ≥ 120 px for hooks.
- Faces and key action above y=960 when the subtitle band is active.
- Every shot must have: a clear focal shape, a camera move, a beat hit, and one piece of paper physics (fold, tear, curl, flutter, stack).
- No shot is allowed to be a static illustration.
