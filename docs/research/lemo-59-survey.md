# Lemo-Opuscar: all 59 styles, read in detail

**Source:** `C:\Users\Aakash\Downloads\Compressed\lemo-opuscar-main\lemo-opuscar-main\styles`
**Read:** 2026-10-28, 59 style packs plus `_template`.
**Method:** every pack's `STYLE.md`, `DEMO.md`, `style.json`, `.srt`, and the demo timeline, cast/pose/set code, engine and mix were read. Numbers below are from the packs, not estimated.

This is the evidence base for the production model in
`docs/decisions/0012-scored-film-model.md`.

## The pack anatomy (true for all 59)

| File | Role |
|---|---|
| `STYLE.md` | invariants: material, colour, type, motion, camera vocabulary, native moves, pitfalls, what to refuse |
| `DEMO.md` | one worked film: story, shot list, timings, sound, what this demo does not prove |
| `style.json` | gallery metadata: slug, title, film name, duration, frame reference |
| `.srt` | captions generated from the same cue list as the picture |
| `demo/` | the film's engine core, per-film cast/sets, one timeline/event list, `lines.json`, `mix.py`/`music.py` |
| `poster.jpg` | one frame or poster |

The template enforces the split: `STYLE.md` must not contain a BPM, key, score
arc, demo duration or shot timing. Those belong to `DEMO.md`. A measured demo
value becomes a rule only when it is promoted deliberately.

## All 59, one line each

| Style | Medium | Clock / audio | Cut rhythm | Quality lever |
|---|---|---|---|---|
| archive-lighttable | WebGL light table + 2D annotation | 90 BPM, 7 VO lines | 16 shots, median 2.0 s | loupe is transition and evidence tool |
| art-deco | Canvas 2D | 116→138→116 BPM, 7 VO | 20 shots, median 2.3 s | transitions are architecture; counted light |
| ascii-crt | glyph atlas + CRT shader | 100 BPM, 5 VO | 10 scenes, 1–12 s | text is the only action the machine can take |
| backrooms | three.js + VHS | no score, diegetic, 10 VO | one take | recording medium is the narrator |
| blueprint | Canvas drafting + cyanotype | 108 BPM, 6 VO | 4 camera segments | strict drawing convention buys one exception |
| brick-toy | three.js PBR | 143.55 BPM, 8 VO | 21 shots, median 2.29 s | physical rules generate events |
| briefing-board | Canvas board + cut-outs | 120 BPM, 9 VO, 34 camera moves | 17 shots, median 2.5 s | compose the final wall first; judgement holds |
| caption-news | Canvas over footage | 120 BPM half-beat, 12 VO | 19 shots, median 3.0 s | reads muted; caption clock outranks shot clock |
| cel-anime-80s | Canvas cels + CRT | 116 BPM, 8 VO | 20 shots, median 2.07 s | 4-layer contrast; step drawings, smooth camera |
| city-symphony | Python/ffmpeg real footage | 120 BPM, no voice | 36 shots, 0.5–4 s | the score is the script |
| countdown | Canvas + NASA footage | 60 BPM (1 beat = 1 s), 2 VO | 16 layouts, median 2.6 s | real time and a trustworthy clock |
| crayon-book | WebGL + Canvas stroke | 72 BPM 3/4, 7 VO | one take, 9 beats | material rules in shaders; 12 fps drawing |
| dark-keynote | Canvas 2D | 120 BPM, 6 VO | 9 beats, median 4.5 s | one note table for picture and score |
| data-physical | three.js PBR | 96 BPM, 7 VO | one take, 9 beats, median 4.7 s | one plate = 10 GW; countable geometry |
| dataviz | Canvas 2D | 90 BPM, 5 VO | 11 beats, ~4.5 s | chart operations are the transitions; sonification |
| engraving | Canvas burin | 96 BPM, 5 VO | 8 beats, median 4.4 s | cutting order is the animation |
| game-show | SVG DOM | 150 BPM, 51 cues, no VO | 93 bars, 10 set pieces | one bar/event table for picture and sound |
| glass-product | three.js glass | 120 BPM, 4 VO | 11 shots, median 2 s | material and light are the subject |
| halftone-dossier | SVG + Canvas | 120 BPM, 18 cards, no VO | 10 scenes, median 3 s | dot wipe; print world in every frame |
| hd-2d | three.js pixel art | licensed track, 8 lines | 7 segments, median 10 s | stepped sprites vs smooth 3D light |
| hologram-hud | Canvas additive HUD | 120 BPM, 5 VO | 8 segments, median 4.5 s | loop→explode→leader→roll→dock |
| impasto | WebGL knife | 80→132 BPM, no voice | 9 shots, median 4.09 s | colour re-laid by the knife is the story |
| ink-wash | Canvas brush + WebGL paper | 60/90 BPM, 5 VO, free opening | 7 beats, holds 5.5–8.2 s | brush order is choreography; one hard cut |
| iso-infographic | Canvas isometric | 100→80 BPM, 6 VO | one take 58.8 s | one tracked subject replaces cuts; arithmetic |
| kino-montage | Canvas archive | 120 BPM, 11 VO | 17 shots, median 3.0 s | evidence recut; cut-conflict rule |
| lidar-survey | WebGL points | 96 BPM, 11 VO | one take, 12 framings | one measured object and one measured number |
| living-screencast | HTML/CSS + pixel sprite | 100 BPM, 17 VO | 12 shots, median 5 s | mascot action causes a real UI change |
| lowpoly-island | three.js ortho | 96 BPM, 5 VO | 12 shots, median 2.5 s | picture emits the score; one piece per slot |
| microgame | Canvas + 8 media modules | 120→160 BPM, 17 VO | 19 segments, median 2.57 s | format as a ladder; one command word |
| microscope | Canvas + real slide | 90 BPM, 7 VO | 12 shots, median 3.0 s | one registered asset at many scales |
| midcentury-toon | Canvas 2D | 132 BPM, 6 VO | 8 sections, median 5.45 s | one hand action per step; voice→bars |
| news-package | Canvas broadcast | 120 BPM, 8 VO | 11 shots, median 4.5 s | package layer drawn inside the wipe |
| newsreel | Canvas archive | 200 BPM, 10 announcer | 22 sections, median 2.4 s | music is the edit clock; one place/material/line |
| one-line | Canvas 2D | no BPM, 6 VO, curvature time | 9 chapters, median 4.2 s | one continuous gesture; pen track is time |
| paper-lantern | three.js paper layers | voice durations + GAP table | 19 shots, median 5.96 s | light transmission per layer is a first-class track |
| paper-popup | three.js + Canvas art | licensed tracks, 15 VO | 3 takes | real units, one light, one rig across shots |
| papercut-red | Canvas paper rig | 120 BPM, 5 VO | 14 shots, median 2.85 s | fold–cut–unfold causes the ending |
| pictogram-motion | Canvas 2D | 150 BPM, no voice | 79 shots, median 1.6 s | EDL as data; 79/79 onset check ±15 ms |
| pixel-rpg | indexed framebuffer | per-era BPM, 5 VO | 8 sections, median 6.7 s | palette depth is emotion; one timeline |
| risograph | Canvas + WebGL print | 120 BPM, 5 VO | 11 shots, median 3 s | each ink is a layer; no per-frame jitter |
| rubber-hose | Canvas 2D | 144 BPM, 7 VO | 14 shots, median 3.33 s | split rates; one global breathing oscillator |
| satellite-briefing | WebGL + Canvas | 100 BPM, 10 VO | one take, 12 framings | world-anchored annotations; real data |
| scifi-toon | Canvas 2D | 120 BPM, 18 VO | 29 shots, median 1.7 s | world = palette + cue + creature + tag |
| shadow-puppet | Canvas + WebGL | 100 BPM, 6 VO | 13 shots, median 3.6 s | lamp count is the story state |
| silent-film | Canvas + WebGL print | tempo map 96→144→88→60→72, no voice | 13 sections | post-process is the house style; intertitles |
| silkscreen-poster | Canvas print | 100 BPM, no voice | 6 sections, median 7.2 s | reading time is edit length; pull is pacing |
| spy-titles | Canvas cut-paper | 132 BPM, 6 VO | 11 set pieces | type is the set; credits are the rhythm |
| stained-glass | Canvas glass + WebGL | 80 BPM, 8 VO | 15 shots, median 4.2 s | light is clock, camera and story state |
| swiss-motion | Canvas 2D | 120 BPM, 8 VO | 8 sections | two easing curves; one score file for picture+music |
| teardown | three.js PBR | 96 BPM, 9 VO | 13 shots, median 2.7 s | assets from source data; never invent a number |
| telestrator | Canvas over footage | 120 BPM, 8 VO | 23 segments, median 1.84 s | tracked world anchors; freeze state |
| tilt-shift | three.js DOF | 120 BPM, 6 VO | 8 shots, median 5 s | band follows subject; step rate = subdivision |
| ukiyoe | Canvas print | 72/96 BPM, 5 VO | 5 views, median 7.5 s | one subject, five compositions; print as object |
| urban-sketch | Canvas + WebGL | 150 BPM, no voice | one take, 12 phases | ink and wash stay separate; colour is an event |
| visual-investigation | Canvas 2D | 0.5 s grid, 8 VO | 11 sections, median 6.0 s | uncertainty drawn; clock is a layout variable |
| watercolor | Canvas 2D 60 fps | 103.4 BPM licensed, 13 VO | one dolly, 5 zones | camera move is the argument; palette is data |
| white-model | three.js + overlay | 100 BPM, 8 VO | one take, 10 beats, median 3.9 s | light is the only actor; readouts from mesh |
| whiteboard | Canvas marker | 120 BPM, 21 lines | one board, 44 camera keys | stroke deadlines; foley from strokes |
| woodcut | Canvas + WebGL print | 60→90 BPM, 4 VO | 17 shots, avg 3.4 s | material logic; reveal times on strokes |
| _template | specification only | no BPM or timing allowed | none | separates rules from one proof |

## What is common to all 59

1. **One timed score.** Picture, voice, subtitles, score and foley all read the
   same timeline or event list. Event counts run 31–2,182. Cue alignment is
   checked at 0 ms or within one frame.
2. **The film is authored, not generated.** Each pack contains one bespoke film
   with its own cast, sets, props and edit. The style bible is reusable; the film
   is not.
3. **Per-film assets, shared engine core.** Characters, poses, sets and props are
   made for the film. The rig, print, brush, HUD or 3D helpers are shared code.
4. **A declared clock.** Most use a BPM grid; several do not: voice durations
   (`paper-lantern`), real time (`countdown`), stroke geometry (`one-line`),
   reading time (`silkscreen`), free time (`ink-wash`). The clock is a film
   decision inside the style.
5. **Split motion rates.** Characters step at 8–12 fps while camera, light and
   effects run at 24–60 fps. This is near-universal in character styles.
6. **One accent, one native move.** Every style reserves one accent colour and
   one signature action: a loupe, a dot wipe, a print pull, a crack, a lamp, a
   pen stroke, a paper cut.
7. **Silence is a beat.** A held silence before the largest hit is standard.
   Mixes target −14 LUFS, music ducked 5–12 dB under voice.
8. **In-world typography.** Text lives on the object: cartouche, board, poster,
   HUD, plate caption, road sign. It is not a generic lower third.
9. **Read-time holds.** Captions and cards hold for at least
   `max(1.8 s, speech + 0.6 s)`; edit length is often computed from reading time.
10. **Scripted QA.** Cue checks, read checks, ASR checks, subtitle checks, motion
    checks, model sheets and deterministic `render(t)`. Quality is verified, not
    asserted.
11. **Style and proof are separate.** `STYLE.md` holds invariants; `DEMO.md` holds
    one film. Demo numbers become rules only when promoted deliberately.
12. **Compose the whole, then move through it.** The strongest packs design the
    final wall, board, poster or diagram first; every shot is a crop of it.

## What varies, and therefore cannot be a global rule

- **Cut density:** 0 cuts (`one-line`, `watercolor`, `iso-infographic`,
  `whiteboard`) to 79 shots in 161.6 s (`pictogram-motion`, median 1.6 s).
  `ukiyoe` holds 7.5 s. There is no universal "cut every 3 s".
- **Clock:** music, narration, real time, reading time, free time.
- **Audio:** 0–25 narration lines; some styles forbid voice entirely.
- **Medium:** Canvas 2D, WebGL, three.js, SVG, indexed framebuffer, real footage.
- **Asset origin:** invented, real archive, measured data, 3D scans.

## What this means for Paper Studio

1. **The score comes first.** A film is a timed score (events, voice, captions,
   sound) that the renderer plays. A shot list alone is not enough.
2. **The style owns the envelope, the film owns the choice.** Each style declares
   duration min/median/max and clock modes; each film picks inside them.
3. **Assets are per film by default.** Build cast, poses, sets and props for the
   film; reuse the engine core; promote approved assets to a library with a
   version.
4. **Split animation and camera rates.** Paper characters on twos (12 fps),
   camera and light on ones (24 or 30 fps). This is both the look and a simpler
   QA surface.
5. **One native move per style.** Paper K-pop: slam, peel, iris. Watercolor:
   paint-in. Build the film around it.
6. **Design the final frame first.** Compose the poster/stage/board, then move
   the camera through it. This is how the strongest packs avoid "coverage".
7. **Audio modes are first-class.** Music, narration, SFX-only, hybrid. The score
   declares the clock; the renderer does not assume a beat grid.
8. **QA is scripted.** Cue alignment, read time, rig seams, per-frame audit,
   determinism, palette and caption checks. Every gate has a command.
9. **Six fixed critics.** Architect, senior developer, designer/DOP, motion
   director, editor, QA/UAT. They review at four gates, not continuously.
10. **Do not clone a demo.** The template's own rule: style invariants are
    reusable; the demo's story, shots, palette and timings are not.

## What not to copy

- The demo stories, characters, props, palettes, timings or end cards.
- 40–60 s as a rule; the range is 30–163.6 s.
- One continuous take as a universal grammar; it is a style choice.
- 20–50 KB bespoke `scenes.js` files as if they were a shared runtime.
- Per-frame grain/registration jitter that fights compression.
- Narration, music or captions where the style forbids them.

## Remaining unknowns

- Exact cut lists are not in `DEMO.md` for every style; where a median is given it
  comes from the shot table or the demo code.
- Some event counts include only picture cues, others include sound; they are
  compared within a pack, not across packs.
- No style is a template for another; the numbers above are evidence, not targets.
