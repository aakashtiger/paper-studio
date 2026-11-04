# Assumptions made for *The Uber Cut*, and what is parked

**Date:** 5 Nov 2026 (rebuilt under 0055; first written 4 Nov 2026).
**Film:** `films/uber-model/` — 30 s, 10 shots, 5 narration lines, 91 words.

**0056 update (5 Nov 2026):** the visual contract now requires an exact
narration phrase, a unique device, no repeated recipe/phrase/shows, and a
physical action for every staged character; `diagram-show` makes cast optional at
20–60%; the probe records a face box and text-over-face fails; the rig draws both
hands with fingers and publishes hand anchors. The 0055 Uber score is
**pre-0056** and `visual:check` refuses it with 48 findings. Its delivered MP4
and 0055 gate are historical evidence. The next film is written under 0056; see
`docs/proposals/next-film.md`.

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
4. **Casting is role-first.** `Rider` is the star and `Driver` is the foil;
   both are paper-pop performers, not the old office pair. They are **roles**,
   not new personal names: the narration never claims a name, and no new fact
   is invented. The brief's Kiran/Vaz are retired from this film; the brief is
   still the source of the business model. No Uber logo, brand mark, city,
   date, person, revenue number or take rate is invented.
5. **The visuals are the subject, not the office set.** Six explainer recipes
   were added to the pack: a phone map with a route and pins, a paper city with
   a car, a fare split, an app menu with four revenue tiles, a rider/driver
   network, and coins moving to driver and platform. Every shot is a full-bleed
   paper stage; the phone, city and fare card are props beside the performer,
   not a cream plate between two wings. Rider/Driver are staged in 10 of 10
   shots. The film has no lamp, no banner, no office-worker lead and no
   sunburst title card; the first image is the network.
6. **Facts are public and general:** Uber is asset-light; the driver keeps the
   fare minus a service fee; the same app also sells delivery, freight,
   advertising and memberships (Uber One); more riders and drivers make the
   network more useful. No exact percentage is shown.
7. **Same Alarm is history.** It has no `story.json`, so the new `writing` gate
   fails it. Its picture and audio are left untouched; it is not re-rendered to
   make an old film pass a new row.
8. **The character library is the reusable cast.** Rider/Driver join Kiran/Vaz:
   each has 8 unique poses and 14 unique faces, a rig, an archetype, a licence
   and a hash. Vaz keeps the old pose names because Same Alarm's score names
   them. The library sheet is the visual proof. The 8/14 shapes are unique; a
   pixel-level proof of the 14 faces is still parked.
9. **`assets:new` adds missing entries but does not refresh a changed hash.**
   Editing `styles/paper-kpop/canvas/recipes.js` required a manual hash refresh
   for the film's recipe assets. A `--refresh` mode is parked.

## Parked (not done now)

| Item | Why / what remains |
|---|---|
| **P0.5 - 7 read-only analysis agents + up to 4 rebuild worktrees** | parked by the user earlier. The single agent/critic pass and the gate are what shipped. The analysis half still applies; the rebuild half is blocked until `canvas/recipes.js` is split and `manifest.ts` hashes more than that one file. |
| **P0.7 - the `reproduce` legacy marker** | probe/draft output, `--skip-render`, `--from gate|review`, whole-film render requirements, gate type/rig score ties and `--allow-none` are guarded. The inference now compares the existing picture to the render manifest: a re-render of the current film is not a reproduction, while an old file without a matching manifest still needs a `legacy` marker. Old scores are not edited. |
| **P0.9 - 3 s LU contrast, LRA, hand/face close-up count** | built in 0053 and **closed by 0054/0055**: a narration line may declare `gainDb`; *The Uber Cut* uses v04 at -16 dB, giving 17.8 LU 3 s contrast and 16.5 LU LRA with no narration hole. Close-ups are 30% of shots. The old "red by design" state is historical. |
| **A semantic vision check** | `visual:check` is textual: it proves the brief names the subject and the recipe declares it can draw that subject. A person still judges the frame. |
| **Exact Uber financials / take rate** | deliberately omitted; no number was invented. |
| **Music** | no score/music track; narration + 9 code-generated cues. |
| **`assets:sheet` for props and sets** | `library:sheet` draws characters; props/sets have no sheet. |
| **Asset-first derivation from scenes/shots** | `assets:new` derives from recipe ids, not from scene/shot slots. |
| **Immutable library versions** | hashes are pinned per library entry; version immutability is parked. |
| **Per-film character choice: reuse the library or design a new one** | the style contract must allow a new character built to the same paper-puppet construction, rig, face vocabulary and palette. The library is a source, not a membership rule. The choosing/creating workflow and its review surface are parked; the style rule itself is not optional. |
| **14 expressions → 14 unique pixel faces** | the 14 names now map to 14 different face parameter sets and shapes, and duplicate parameter sets are refused; a pixel-level uniqueness proof is not built. |
| **A true 3D walk** | the flat 2D rig cannot bend a knee toward camera; the walk is a paper stride with leg angles. |
| **`voice --from-story` word-level caption timing** | captions are proportional within the measured line; word times exist in `words.json` and could drive exact chunk boundaries. |

## What is proven

- `npm run style:identity -- films/uber-model/score.json --video` -> **PASS, 0 findings**; the report is tied to score, identity, frame and video hashes.
- `npm run gate:7 -- films/uber-model/score.json` -> **PASS, 28 checks, nothing manual**.
- `npm run film:review -- films/uber-model/score.json --gate --reuse` -> **PASS**; the one sheet is `build/uber-model/final-sheet.png`.
- ASR of the delivered file: **91/91 words, 100.0%**, even through the deliberate -16 dB v04.
- `npm run identity:accept` remains the 0053 calibration on the **old** film: the reference passes and the old Uber fails. The rebuilt film is now the positive example, not the negative control.
