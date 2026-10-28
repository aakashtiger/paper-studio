# Reference artifact inventory

**Date:** 2026-10-29
**Question:** how many images were generated for the K-pop film and across the
Lemo styles, and what else is generated to be used?

Counts are from the local files, not estimates.

## 1. The K-pop source film (`Y:\NewVideoTest`)

| Artifact | Count | What it is |
|---|---:|---|
| Final frames | **4,699** | one 1920×1080 JPG per frame of the 156.6 s film, 30 fps |
| Review stills | **251** | PNGs at key times across 28 folders (`act1`, `act3*`, `act4*`, `review1–9`, `fix1–3`) |
| Contact sheets / checks | **18** | 7 contact sheets (`act1`, `act2`, `act3`, `act45`, `act45b`, `fix3`, `full`) plus final/first/last frames |
| Written shot list | **52 shots** | `STORYBOARD.md`: set, camera, action, text and transition per shot; average 3.0 s |
| Production bible | 1 | `PRODUCTION.md`: cast, colour script, structure, lyric rules, ticker |
| Audio | 1 song + transcript | `song.mp3`, `song.wav`, `transcript.json` with word-level timings |
| Source code | 13 JS files | renderer, type, characters, props, scene kit, timeline |
| Fonts | 9 TTF | bundled |

**There is no pre-drawn storyboard image set.** The storyboard is a 52-shot
text document. The large image sequence people remember is either the **251
review stills** generated during iteration or the **4,699 final frames** — not a
Pixar-style pre-vis board.

## 2. The Lemo-Opuscar repo

| Artifact | Count | What it is |
|---|---:|---|
| Styles | **59** + `_template` | each a style bible plus one bespoke film |
| Posters | **59** | one `poster.jpg` per style |
| Style stills | **89** | 1–6 per style in `demo/stills/` (`styleframe.jpg`, `modelsheet_v2.jpg`, `frame_v2_*.jpg`) |
| Gallery frames | **59** | one `docs/frames/<style>.jpg` per style |
| Styleboard thumbnails | **60** | `styleboard/img/` |
| Style-level images total | **150** | posters + demo stills + asset images |
| All repo images (approx.) | **269** | 150 + 59 gallery frames + 60 thumbnails |

Only a few styles ship a model sheet: `art-deco` has `modelsheet_v2.jpg`,
`kit_v2.jpg`, two frames; `paper-popup` has `modelsheet_v2_styles.jpg`;
`silent-film` has five stills. Most styles have one styleframe and one poster.

### Generated data per style

| File | Count | Purpose |
|---|---:|---|
| `lines.json` | 50 | narration lines, voice, speed, language |
| `events.json` | 47 | timed picture/SFX events |
| `score.json` | 24 | music score / cue map |
| `cues.json` | 22 | cue list |
| `timeline.json` | 16 | edit timeline |
| `.srt` | 57 | captions generated from the lines |
| `mix.py` | 54 | mix and loudness |
| `score.py` / `music.py` | 31 / 5 | score generation |
| `cuecheck.py` | 17 | cue alignment check |
| `subs.py` | 15 | subtitle generation/check |
| `final_asr.py` / `asr.py` | 12 / 4 | transcript check |
| `sheet.py` | 5 | model/contact sheet |
| `motioncheck.py` | 4 | motion check |

The dense artifacts are **data**, not images: voice lines, word timings, event
lists, cue maps, SRT, checks. The visual artifacts are one poster, one
styleframe, and a handful of model sheets.

## 3. What this means for our process

1. **Do not build a storyboard image farm.** The references did not generate
   hundreds of storyboard images. A 45 s film needs **15–25 storyboard stills**
   (one per shot or key beat), reviewed as a contact sheet.
2. **The “big sequence of images” is review, not pre-vis.** Generate a contact
   sheet every 0.5–1 s during animation; that is where the 251 K-pop review
   stills came from.
3. **The score is the dense artifact.** Voice lines, word timings, events,
   cues, SRT and checks are what make the film exact. Images are the output.
4. **Model sheets are generated per film, not per style.** A character sheet
   (views, poses, expressions) and a prop/set sheet are needed before
   animation; they are not a 100-image storyboard.
5. **The first film’s artifact budget:**
   - 1 brief,
   - 1 script,
   - 1 voice track + transcript,
   - 1 SRT,
   - 1 cue sheet,
   - 15–25 storyboard stills,
   - 1 animatic,
   - 2–4 character/prop sheets,
   - 1 contact sheet per act during review,
   - 1 final film + audit.

This keeps the process simple and matches how the references were actually made.
