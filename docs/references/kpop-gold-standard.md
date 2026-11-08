# The KPOP gold standard — what actually made `out/claude-pop.mp4`

**Date:** 6 Nov 2026

> **The shot band is superseded (8 Nov 2026, decision 0065).** The band in this
> note (`1.0-4.5 s, median 2.5-3.0`) describes the gate the earlier films were
> made for. Shot length, shot count and aspect now belong to the system:
> `kpop-shot-policy.md` decides them, and `npm run shot:policy` checks a cut.
**Gold standard:** `Y:\NewVideoTest\out\claude-pop.mp4` — 156.6 s, 1920×1080, 30 fps, 4,699 frames.
**Source repo the user gave:** `https://github.com/JohnHeibel/PDoomVideo`
**Original film:** `https://oneshotted.io/v/opus-visual-design-test`

This is the reverse-engineering note. It is the base for the KPOP system, not a
new style theory.

## There were two generations

The PDoomVideo README is explicit:

1. **First generation** — `legacy/`, Claude Opus 5.5 (Medium).
2. **Second generation** — everything else, Claude Opus 5.5. All code generated
   by the model. The only direction was: use the Clawd character, give each
   lyric interesting visuals and transitions.

`ANIMATION_GUIDE.md` was written to brief subagents. `STORYBOARD.md` was written
after the first generation. That is the production method: **a written shot
list, a written animation guide, parallel chapter authors, and a review loop.**

## The original repo: p5.brush, nine chapters

`Y:\NewVideoTest\ref\PDoomVideo` is the original source.

- `src/ch/` — nine chapter files, one per act, each a private IIFE.
- `chapter(name, start, end, shots)` registers a chapter. A shot is
  `fn(t, lt, dur)` and paints the entire frame.
- `src/core.js` — p5.brush painting API, paper texture, camera, easing, hash.
- `src/clawd.js`, `src/cast.js`, `src/props.js` — characters, guests, recurring
  theatre set.
- `src/timeline.js`, `src/lyrics.js` — karaoke band, chapter wipes, P(doom) meter.
- `studio.html`, `render.mjs` — headless Chrome, frames, ffmpeg encode.
- `ANIMATION_GUIDE.md` — the subagent brief: canvas, API, characters, props,
  style rules, motion rules, review commands.
- `STORYBOARD.md` — 52 shots with set, camera, action, text and transition.

The guide's rules are the actual quality bar:

- **Everything moves.** Camera drifts or pushes; characters bounce on the beat;
  hits land on beats; squash, anticipation, overshoot.
- **One clear focal action per shot, big silhouette.** Shots are 1.4–4 s, so the
  gag must read instantly.
- **Pure function of `t`.** No state between frames, no `Math.random`; hash for
  scatter; jitter reseeded 12×/s for line boil.
- **Karaoke band covers y≈975–1070.** Faces and key action stay above y≈960.
- **Review sheets, not vibes.** Render `--sheet=times --cols=3 --w=640` and
  `--stills`; inspect first/last frames, 0.1 s around hits, transitions, and the
  karaoke band. Iterate until each shot is charming, readable, on-model.
- **Parallel, resumable render.** Frames render out of order; every shot must be
  pure.

## The rewrite: the paper K-pop gold standard

`Y:\NewVideoTest` is the rewrite that produced `out/claude-pop.mp4`. It keeps
the same production method and swaps p5.brush for flat cut paper.

- `src/core.js` — canvas, `paper()`, torn edges, halftone, fibre, grain, camera,
  palette, easing, hash.
- `src/type.js` — Anton/Archivo/Instrument/DM Mono/Permanent Marker; cream cut
  edge, hard ink shadow, per-glyph 12 Hz boil, karaoke band.
- `src/characters.js` — bradded paper rigs: `idol`, `mira`, `gato`, guests.
  Every joint has a brass brad; tapered limbs; three-layer head; drawn face;
  one ground shadow; hands with thumbs.
- `src/props.js`, `src/scene_kit.js` — stage, curtains, sunburst, speakers,
  crowd, confetti, spotlight, meter, pump, desk, clouds, shards, speed lines.
- `src/scenes/act1.js` … `act5.js` — **51 hand-authored shot functions**, each
  with its own set, camera, action, type and transition.
- `src/timeline.js` — scene registry, karaoke, P(doom) ticker, print marks,
  paper/grain/vignette finish.
- `PRODUCTION.md` — logline, cast, colour script, lyric rules, structure.
- `STORYBOARD.md` — 52 shots with camera, action, text and transition.
- `render.mjs` — headless Chrome, `--frames`, `--clip`, `--stills`, `--sheet`,
  `--encode`; parallel workers; resumable frames.
- `out/check/` — the actual review sheets used to iterate (act1, act2, act45,
  fix3, full, final frames).
- `out/frames/` — 4,699 final frames.

## Why it reads as the gold standard

1. **Coverage.** The cast is on screen for almost the whole film; there is no
   30 s stretch of empty stage.
2. **Per-shot authorship.** Every shot is written for its lyric. There is no
   generic recipe doing 19 sentences.
3. **Continuous motion.** Every frame has 5–10 live layers: body bounce, sway,
   head, hair, petal pulse, type boil, fibre, grain, confetti, dust, secondary
   props, camera. A still camera still has a moving frame.
4. **Expressive characters.** 8+ poses, 14+ expressions, mood changes, dance
   moves, hands, brads. The face is not a sticker.
5. **Recurring theatre.** Stage, curtains, sun, speakers, meter, pump, karaoke
   band, print furniture. Props are paper objects with contact shadows, not
   floating icons.
6. **Type is a paper object.** Cream cut edge, hard ink shadow, per-glyph boil,
   karaoke highlight, monumental hooks in the negative space.
7. **Review loop.** Sheets at many times, frame-by-frame checks, iteration until
   the shot reads. The final film is the last pass of that loop.

## Why the current pack and *The Understudy* are ~30%

The studio pack is a **reduction** of the source:

- 6 painters instead of 51 authored shots; 2–4 cast; fewer props; static sets.
- `Understudy` has 5/9 staged shots and 67.7% staged time, but only 6 recipes;
  the source has 51 shots and a full theatre.
- `Same Alarm` is slower still; `Diwali` had 34.6 s with no cast, zero type and
  camera-only motion.
- The pack's gates measure pixel change and negative rules, not whether the
  paper is performing. A 30% push passes the motion probe.

The quality gap is not a palette or a texture. It is **coverage, per-shot
authorship, character performance, props, and the review loop.**

## The KPOP system to build

Keep the source's production model, make it reusable:

1. **Chapter/shot authoring.** A film is a list of shots; each shot is a pure
   function of `t, lt, dur` with a set, cast, camera, action, type and paper
   event. No shot is a recipe JSON with prose events.
2. **Reusable theatre.** Port the source's `stageSet`, `stageFront`, `meterProp`,
   `pumpProp`, `sunburst`, `spotlight`, `crowd`, `confetti`, `paperShards`,
   `drawCloud`, `drawMic`, `drawDesk`, and the paper rig.
3. **Reusable cast.** Port `idol`, `mira`, `gato` and the construction rules:
   brads, taper, 3-layer head, 8 poses, 14 expressions, hand anchors.
4. **Per-film authoring.** The script/story/beats/scenes choose the cast, sets,
   palette, props and shot list; a human/agent writes the shot functions and
   reviews sheets.
5. **Quality checks.** Add to the existing gates:
   - no run >7 s without a cast member;
   - every shot has ≥3 independent motion layers and ≥1 character action;
   - every shot has type (display or subtitle);
   - camera amplitude ≤12%;
   - shot lengths 1.0–4.5 s, median 2.5–3.0;
   - the painter must read the score's pose/event times.
6. **Proof first.** A 10 s proof with a new script, source rig, source stage,
   source type, continuous motion, and a voice track. Only then a full film.

## The first KPOP proof

`Y:\NewVideoTest\proofs\kpop-proof\`

- 10.2 s, 1920×1080, 30 fps, four shots: 3.10 / 2.07 / 3.70 / 1.33 s.
- Script: *The Understudy* cue-lamp beat, spoken by the measured Understudy
  voice (0–10.2 s).
- Cast: KIRAN, a new flower-headed paper idol on the source rig, teal/coral/
  mustard palette.
- Set: source stage, portrait window, empty wings; source speakers, crowd,
  confetti, spotlights, cue lamp, type and karaoke band.
- Video: `out/kpop-proof-v3.mp4`; sheet: `out/contact-sheet-v3.png`.

It is a proof of the grammar, not the 157 s film. The next pass adds more cast,
more props, more sets and the full script.
