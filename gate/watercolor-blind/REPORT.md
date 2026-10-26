# Watercolor blind application — report

**Style:** `styles/watercolor` 0.1.0
**Final run:** run 15
**Pack hash:** `sha256:31b804d0530f5a7e4065f41dbfef683153dc9144a61336fa4b892ae74a9bafa5`
**Result:** 6 shots · 30 s · 9:16 · 9/9 assertions · pack and inputs unchanged after LF normalization · **post-build critics 9/10 GO** · **CI pass (run 40327935982)**
**Author:** a fresh sub-agent given only a temp copy of `inputs/`.

The byte seal proves the author did not edit the inputs; it does not prove the
author never opened the repo. The author was a fresh sub-agent prompted to work
only in the temp folder; the harness has no sandbox. Treat this as a
prompt-isolated, byte-sealed application, not a cryptographic read-seal.

**Normalization:** the two OFL texts were converted from CRLF/mixed to LF so the pack hash is identical on Windows and Linux. The content is unchanged; the baseline and used manifests were recomputed from the normalized files. This is a transport normalization, not an edit to the style.

## What the author made

- **Title:** *Before the Keys*
- **Subject:** a house measured for sale, a fictional empty house, on the last afternoon before the keys change hands; the film looks at the places where the paint stopped short of the edge.
- **Route:** `watercolor_title` → `watercolor_specimen` (first plate) → `watercolor_specimen` (second plate) → `watercolor_quote` (the line) → `watercolor_mist` → `watercolor_close`.
- **Allocation:** 4.667 / 5.833 / 5.833 / 4.667 / 4.500 / 4.500 s = 30.000 s. The author applied the min-then-capacity rule, not an equal split.
- **Palette:** `garden-day`; accent vermilion at the title and close; mist carries none.
- **Sound:** wordless felt-piano motif, no voice; `content.body` is set, not spoken.
- **No** real people, third-party lyrics, song titles, voice, music or photographs.

The treatment cites all six invariants by shot: paper as white, flying white, pooled edge, painting-in, annotation leader, no vector outline. It is in `work/treatment.md`.

## Mechanical result

```
6 shots · 30 s · 9:16
1. Every slot ... PASS
...
9. Every resolved content.* text slot is within the style's word limit — PASS
```

The full output is `resolve.txt`. The gate test checks the same plan, the live pack hash, the baseline input manifest and the author's used-input manifest.

## Sealed inputs

- `inputs/` — baseline: `pack/`, `MANIFEST.json`, `prompt.md`, `APPLICATION.md`.
- `used-inputs/` — the author's copy, returned after the run. Its manifest is byte-identical to the baseline, and every file hash matches both copies.
- `work/` — the author's brief, format, questions and treatment.
- `archive/run-1/` … `archive/run-14/` — earlier blind passes, kept as evidence of the findings.

## Run history

| Run | Pack hash | What the author found | What changed |
|---|---|---|---|
| 1 | `sha256:505ee89fa910adfb306e058402400162e15fb6402c270484ba37110f863a2810` | The 30 s page could not use the walk; the title arch sat under the title; the quote wash sat behind the text its own failure list refuses; the 9:16 scale was missing; the allocation rule was unstated. | Brief page/walk wording; title arch moved right; quote wash moved to the object base; 9:16 scale; allocation rule in the application guide. |
| 2 | `sha256:efd435216a3b9399aae1f32beba901fd3493f1cfdfe5b564b53bcb9f8b7752a0` | The measured label had no slot; the 9:16 title guidance conflicted with the arch; the 9:16 scale was not tied to a frame width; the `evening-blue` accent was too close to its wash; unused fields and the mist/page-turn order were unclear. | Date/venue carry the measured label; title left/arch right; scale tied to 390 px; accent changed to vermilion; unused fields and mist notes added. |
| 3 | `sha256:32a3ddf6a839eb51a4114352b5936d99fdb0ffc8d8c54ac304fa9508ab0b65ff` | The 9:16 boxes were partial; assets read as subjects; the mist source was unnamed; accent recurrence was undefined; `sequence[].count` and loudness had no note. | `aspectBoxes` expanded; assets are types, not subjects; mist erases the preceding shot; "recurs" means at least twice; counts and loudness notes. |
| 4 | `sha256:753e560118ec9e54f86909e10b1054ffbcb58700ad33f1da29a1a37d67e38e90` | The seal/quote boxes broke the 9:16 margin; the specimen push-in was exactly 6% while the signature said "under six"; the mist composite was ambiguous; the 9:16 close boxes and label stacking were missing. | Seal square, quote object margin, "six percent or less", mist composite note, more 9:16 boxes. |
| 5 | `sha256:214cfa6f423227c67b18b57730f4f41ef01f89c532e6e0169a285ad3a3b8549a` | The close's monogram/refrain/date/seal boxes, title label stacking, leader re-aiming, repeated note, paint after mist, mist opacity, score stop and quote attribution were open. | More 9:16 boxes; mist/close notes; blind report. |
| 6 | `sha256:9f8ee45db7e432373d7ca268b5e38ef4fd37dc27ffc04146f330790c1d67c7de` | `names` was read by the title but the guide said it was unread; no recipe mapped its 1:1 ops to the 9:16 boxes. | Per-recipe `vertical` maps; names in the title; close/label boxes. |
| 7 | `sha256:fa60d4a75837d5ecf1663212678b587ca4fd4ef076b76bcd447658e8e1b7d4ab` | Rounding to the last millisecond; repeated recipe subjects; 9:16 gaps; title horizon unmapped. | Exact rounding rule; subject limit documented; horizon map. |
| 8 | `sha256:fbea555249124084b41404a8478b56810e8a33bbaaa87d28c00b64f8744d3a23` | Title horizon missing; mist half-frame; note/leader gap too short. | Horizon map; full-paper mist pass; note moved. |
| 9 | `sha256:f02fc9557340bf7273f9d8211cb5ca7a3de9d266f14518e13fd49af90c1dde1d` | `names` label/body mismatch; caption too narrow at 9:16; mist half-frame. | Names body; two-line caption rule; full mist. |
| 10 | `sha256:b7c6dd3f44ef7083bcd0ebb87c9351a7af021d0a3601f95de1e2dd4c44f625a7` | Caption/names fit; stroke widths absent; mist paper base. | Below-specimen note; `strokeWidths`; mist composites. |
| 11 | `sha256:866878ca9afb4c7ea405918435968571ad8f959683217d05fbc8bc0ba21d6c80` | Brief still said italic subtitles; title/close seals differed in size. | Brief aligned; seal same size. |
| 12 | `sha256:d9b0895d23fc7c045d1c2f41fbec22b20ca5bf2b4e1fe023f51f91580a2b4b99` | `specimenNote` still too narrow; paper gap read as opaque fill; bristle threshold at 1080. | Note below specimen; paper gap is the sheet; 390 px threshold. |
| 13 | `sha256:75da66b3001aa7674dcba5b4aecaf19ea51ffbee8ec0b4e94cab2b48a3253b03` | **Final run before the last card pass.** The route is clean; remaining questions are S1a limits: one caption across four plates, one venue, the title's six slots, leader endpoints, no transition durations, mist order, paint-in per form vs shot, per-shot subject. | Selected for the last card/walk pass; these are S2/0.2.0 items, not gate blockers. |
| 14 | `sha256:321d39e7e2b024b396c4527fe4ff40d986750a12f95fcf4e7d5c7a43cae10e6f` | **Pre-final.** The route is clean; remaining questions are S1a limits plus the `names` meaning for a place, display-type entry, and paper-gap shape vs stopped wash. | Card/world polish; selected for the last pass. |
| 15 | `sha256:31b804d0530f5a7e4065f41dbfef683153dc9144a61336fa4b892ae74a9bafa5` | **Final run.** The route is clean; remaining questions are S1a limits: which page contract to repeat, wipe handover, flying-white op, 14 px scale, music-out frame, names/venue for a house, one venue across rooms, optional photos/hashtag/rsvp. | Post-build critics: contract 9/10 GO, creative 9/10 GO, product 9/10 GO. |

The archive keeps each run's `work/`; the pack hash in this table is the lead's
record of the pack that run used. Runs 1–14 are archived with their work; run 15
is the live `work/`. The pack was edited between runs 1–14; run 15 used the final
pack without an edit. Fifteen blind runs is the honest cost of converting a prose
bible into a contract.

## Residual questions from run 15

The full 13-question author log is in `work/questions.md`; the 17 items below are
the selected S1a/0.2.0 synthesis, not a claim that the author asked only 17.

1. **One caption, four plates.** Two specimens, the quote and the close all read
   `content.caption`; the same line appears four times. The pack permits a running
   refrain; per-shot notes are S2.
2. **One venue, two specimens.** The latch and the sill cannot carry different
   labels; the address/time is a running label. Per-shot labels are S2.
3. **Title slots.** The title recipe requires title, subtitle, names, date, venue and
   monogram. A memory film with no event date/venue must make them diegetic or use
   another page. This is the title contract, not a bug.
4. **Leader endpoints.** The specimen and quote leaders are 1:1 paths; the renderer
   re-anchors them to the 9:16 boxes. The author names the subject each leader
   points to. The pack does not encode per-subject endpoints.
5. **Transition durations.** A recipe has a shot duration, not a separate wipe
   duration. The renderer gives the wipe a slice of the shot; the style does not pin
   the split.
6. **Mist order.** The mist is the erase in progress: the wavy `mist` is the rising
   edge, `mist-full` is the end state. The renderer schedules the reveal; the
   composition lists both end states.
7. **Paint-in per form vs shot.** The 1.2/1.8 s choice is per painted form; a title
   with an arch, a seal and labels shares the window in structure-first order. A
   renderer may need to stagger the forms inside the shot.
8. **Per-shot subject.** A repeated page contract reuses its composition and slots;
   the treatment names the subject. Per-instance subjects are S2.
9. **Fixed in run 14: 9:16 subtitle/arch overlap.** The subtitle box is 0.46 wide,
   ends at 0.54, and the arch starts at 0.56. Kept as a regression note.
10. **Fixed in run 14: mist z/fiber.** The fiber effect is z=3 above `mist-full`
    z=2. The two-state schedule remains S2.
11. **Names as a place.** `content.names` is a people slot. A place-only film can
    use it as a title label, but the contract does not bless it; a title variant for
    a place is S2.
12. **Display-type entry.** The title type is painted in; the 1.2/1.8 s rule names
    painted forms, not type. The renderer decides the type reveal.
13. **Paper gap shape.** The close uses a paper-coloured shape; the style also
    allows a stopped wash. Both are the sheet showing through; the renderer must
    schedule the pass.
14. **Which page contract repeats.** A six-shot page must repeat one of five page
    contracts; the pack permits it and gives no rule for choosing. That is a
    director/format choice.
15. **Wipe handover.** The quote's wipe and the mist's wipe are one erase; the
    renderer decides where the handover happens and how long `mist-full` holds.
16. **Flying-white op.** No recipe names which form uses the 8 px `wide` brush;
    the treatment requests it, the renderer applies it.
17. **14 px floor.** The floor is authored at 390 px; whether it scales with a
    larger frame is a 0.2.0 type rule.

None blocks the pilot gate: the author resolved a real film, the pack hash is
unchanged, and the questions are about renderer placement and S1a slot limits, not
about whether the style can carry a second film. They are candidates for S2
conformance or a 0.2.0 pack revision.

## What this proves

- A fresh author can read the pack, choose a route, fill a brief, compute the allocation, and resolve a 30 s / 9:16 / six-shot film without the source bible; the seal proves bytes, not that the repo was never opened.
- The pack is free of demo story content: the author invented a room, a latch, a sill, a hook and a jamb from the brief, not from the demo.
- The pack is reusable: the same recipes carry the garden wedding page, the song page, the handscroll and the blind vertical page.
- The pack is rights-clean: no Lemo code or media, MIT/OFL notices, descriptive specimen copy; no exact third-party work.

## What it does not prove

- Pixels, motion feel, phone legibility, paint-in feel, mist opacity in a real frame.
- Per-shot content variation or per-shot notes (S1a has one value per slot).
- A 9:16 wedding invitation; the blind film is a song/memory.
- Non-Latin scripts or photo-led weddings.
