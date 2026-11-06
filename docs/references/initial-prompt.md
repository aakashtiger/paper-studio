# Initial prompt and reference inventory

**Saved:** 6 Nov 2026. This is the prompt the user supplied for the CPOP/KPOP rebuild.

## The creative brief

> I've included an MP4 file and an original link to a video called “Claude Pop”
> (https://oneshotted.io/v/opus-visual-design-test). It's a pop song about the
> increasing rate of progress and the experience of the singularity approaching.
>
> Make an updated version of this video, a little different: different
> characters, different colours. Use the exact same audio track. Think deeply
> about the best way to visually represent all of the lyrics. You do not need to
> anchor to the current style; you can do anything that best expresses the song,
> including abstract motion graphics.
>
> Make a new music video with beautifully rendered JavaScript animations with a
> papery feel in a similar style to the reference, but push the aesthetics in any
> direction. Think about the modern zeitgeist.
>
> You can use the internet freely to pull in references, 3D models, motion design.
> You can use the ElevenLabs API for sound design, and the foul API for character
> sheets and sets. The final video must be generated through code only.
>
> A pop protagonist that represents Claude, inspired by the sunflower character
> but more personified. K-pop is a good anchor point visually. Do not fit too
> heavily to Pixar. Think about what performs on Twitter for a San Francisco tech
> audience.
>
> Use strong, compelling visual hooks. Study music videos and how K-pop directs
> attention. Nail the timing of the voice delivery. Text on screen matters:
> sometimes lyrics are monumental motion graphics, sometimes subtitles. At the
> start the lyrics should be visually present. Vary the density and placement.
>
> You can use generated character/set sheets as a foundation, then reconstruct
> the video in JavaScript as an overlay so the final picture is code-drawn.
>
> Length: 157 seconds. Aspect: 16:9.
> Visual palette: papery, K-pop-inspired, internet-brutalism accents.
> Typeface: big expressive lyric motion graphics, subtitle-style at times.
>
> Watch the entire video multiple times, take screenshots, compare against the
> reference, and iterate. The reference is good but not there; it can be much
> stronger. Quality below the reference is not acceptable.

## Current work rules

1. Remove files the project does not need; the folder has become too heavy.
2. Focus on what the K-pop style was using and stick to it. The reference films
   are `Y:\NewVideoTest\out\claude-pop.mp4`, `proofs/s2-paper/paper-proof.mp4`,
   `films/same-alarm/same-alarm.mp4` and `films/understudy/understudy.mp4`.
3. No constant 2/3/4-second shots. Minimum 1 s, median 2.5–3 s, maximum 4.5 s.
   No constant zoom in/out.
4. Continuous motion in every frame, even when the camera is still — as in
   *CLAUDE POP* and *The Understudy*. The drift away from this is the defect.
5. Colours may change per video; do not fixate on red/yellow/orange.
6. Characters may change per video but must use the same core construction as
   the reference films.
7. Assets must look like the reference films, not floating paper.
8. Characters must read like the reference films — dress, clothes, hair and
   colour may change, the core remains, even for a god.
9. Colour, style and props remain in the same family as the reference films;
   they may change, but the overall look and feel must remain.
10. The goal is two styles, **CPOP** (faithful to the *CLAUDE POP* source) and
    **KPOP** (the repo's extracted style), without drifting from either.
    Buttery smooth, frame-by-frame quality; anything below the reference is not
    acceptable.

## Reference files that are present

| What | Path |
|---|---|
| Source film *CLAUDE POP* | `Y:\NewVideoTest\out\claude-pop.mp4` |
| Source project (renderer, rig, scenes, song) | `Y:\NewVideoTest\src\`, `render.mjs`, `studio.html` |
| Production bible | `Y:\NewVideoTest\PRODUCTION.md` |
| 52-shot storyboard | `Y:\NewVideoTest\STORYBOARD.md` |
| Song and word-level transcript | `Y:\NewVideoTest\assets\song.mp3`, `song.wav`, `transcript.json` |
| 4,699 final frames | `Y:\NewVideoTest\out\frames\` |
| Review stills / contact sheets | `Y:\NewVideoTest\out\check\`, `out\stills\` |
| Read-only source modules | `studio/reference/paper-kpop/core.js`, `type.js` |
| Six reference crops | `studio/styles/paper-kpop/references/frames/` |
| Frame provenance | `studio/styles/paper-kpop/SOURCES.md` |
| 27-decision autopsy | `studio/sources/paper-kpop/autopsy.md` |
| Measured source bible | `studio/build/research/claude-pop/bible.json`, `camera-reference.json` |
| Identity specification | `studio/docs/research/identity/KPOP-IDENTITY.md` and A–J docs |
| Style spec | `studio/docs/specs/0005-paper-kpop-pack.md` |
| First rendered proof | `studio/proofs/s2-paper/paper-proof.mp4` |
| First full film | `studio/films/same-alarm/same-alarm.mp4` |
| Preferred KPOP film | `studio/films/understudy/understudy.mp4` |

## What is not present

- No `/asic` folder.
- No ElevenLabs key.
- No foul/seedance API access.

The proofs are therefore code-drawn. If those keys/folders are added, generated
character/set sheets can be produced as reference only; the final picture stays
code-drawn.
