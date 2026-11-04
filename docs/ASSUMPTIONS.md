# Assumptions made for *The Uber Cut*, and what is parked

**Date:** 4 Nov 2026
**Film:** `films/uber-model/` — 30 s, 10 shots, 5 narration lines, 91 words.

The user asked for the whole plan to be completed, best-case assumptions
recorded, and anything not done moved to a parked list. This is that record.

## Assumptions

1. **30 seconds, not 45 or 60.** A 30 s film in the 180–190 wpm band needs
   90–95 words. The read is **91 words at 182 script wpm**, spoken at Kokoro
   speed 1.14, measured **25.37 s of voice (84.6% coverage)**, last word
   28.94 s. Five lines, not nine: a 30 s film with nine spoken lines cannot fit
   the band (the line breaks alone are ~4 s). The earlier 60 s proof remains
   `fixtures/story-long`.
2. **The cut is quantised to 0.1 s (3 frames)** after the read, because the
   score audit requires shot, clock and caption times on the frame grid. The
   measured voice is not stretched; the largest move is 0.04 s. The audio comes
   from the measured read, the score times are the nearest 0.1 s.
3. **Captions are chunks.** A 20-word narration line cannot be one 8-word
   caption. `voice --from-story` now writes `<line>.<n>` chunks, and
   `checkCaptions`, the score audit and the SRT generator accept a chunk that
   is a contiguous word run of its line.
4. **Casting.** Kiran is the rider, Vaz is the driver. This is the only invented
   fact; both names live in `brief.json`. No Uber logo, brand mark, city, date,
   person, revenue number or take rate is invented.
5. **The visuals are the subject, not the office set.** Six explainer recipes
   were added to the pack: a phone map with a route and pins, a paper city with
   a car, a fare split, an app menu with four revenue tiles, a rider/driver
   network, and coins moving to driver and platform. The film has no lamp, no
   banner and no sunburst title card; the first image is the network. The
   narration carries the business model, and the frame now shows it.
6. **Facts are public and general:** Uber is asset-light; the driver keeps the
   fare minus a service fee; the same app also sells delivery, freight,
   advertising and memberships (Uber One); more riders and drivers make the
   network more useful. No exact percentage is shown.
7. **Same Alarm is history.** It has no `story.json`, so the new `writing` gate
   fails it. Its picture and audio are left untouched; it is not re-rendered to
   make an old film pass a new row.
8. **The character library is the reusable cast.** Kiran/Vaz have 8 unique
   poses and 14 unique faces; Vaz keeps the old pose names because Same Alarm's
   score names them. The sheet is the visual proof.
9. **`assets:new` adds missing entries but does not refresh a changed hash.**
   Editing `styles/paper-kpop/canvas/recipes.js` required a manual hash refresh
   for the film's recipe assets. A `--refresh` mode is parked.

## Parked (not done now)

| Item | Why / what remains |
|---|---|
| **P0.5 — 7 read-only analysis agents + up to 4 rebuild worktrees** | parked by the user earlier. The single agent/critic pass and the gate are what shipped. |
| **P0.7 — `reproduce`, `--skip-render`, `--from`, whole-film probes** | `gate:7` now fails on pending; `reproduce` still turns missing story/scenes into warnings for a film with an MP4, and the chain can still reuse a picture without proving every skipped report. |
| **P0.9 — 3 s LU contrast, LRA, hand/face close-up count** | the mix measures loudness, true peak, duck, cue levels, declared silence, undeclared holes and tail; it does not yet measure the quietest 3 s against the loudest 3 s, gate LRA, or count close-ups. |
| **A semantic vision check** | `visual:check` is textual: it proves the brief names the subject and the recipe declares it can draw that subject. A person still judges the frame. |
| **Exact Uber financials / take rate** | deliberately omitted; no number was invented. |
| **Music** | no score/music track; narration + 9 code-generated cues. |
| **`assets:sheet` for props and sets** | `library:sheet` draws characters; props/sets have no sheet. |
| **Asset-first derivation from scenes/shots** | `assets:new` derives from recipe ids, not from scene/shot slots. |
| **Immutable library versions** | hashes are pinned per library entry; version immutability is parked. |
| **14 expressions → 14 unique pixel faces** | the 14 names now map to 14 different face parameter sets and shapes, and duplicate parameter sets are refused; a pixel-level uniqueness proof is not built. |
| **A true 3D walk** | the flat 2D rig cannot bend a knee toward camera; the walk is a paper stride with leg angles. |
| **`voice --from-story` word-level caption timing** | captions are proportional within the measured line; word times exist in `words.json` and could drive exact chunk boundaries. |

## What is proven

- `npm run film:review -- films/uber-model/score.json --gate --reuse` → **PASS**.
- `gate:7` → **PASS · 23 checks · nothing manual**; picture `sha256:2a9c9a7bff0…`.
- ASR of the delivered file: **91/91 words, 100.0%**.
- Delivered audio: **−14.1 LUFS / −2.3 dBTP**.
- `npm test` → **471 tests**, typecheck clean.
- The film is `films/uber-model/uber-model.mp4`; the one-sheet is
  `build/uber-model/final-sheet.png`.
