# 0007 — Watercolor pilot: one Lemo style, one pack

**Status:** frozen for the S1b gate · accepted **9/10 GO** · 2026-10-26
**Owners:** both
**Spec:** `docs/specs/0004-style-pilot-watercolor.md`
**Pack:** `styles/watercolor/` 0.1.0, **REVIEWABLE**
**Blind report:** `gate/watercolor-blind/REPORT.md`

## Context

S1a proved a style can be a machine-checkable, reusable package. The Lemo-Opuscar
review found 59 prose style bibles and 59 bespoke demos, but no schema, tokens,
recipes, validator or conformance. The next question was not "can we convert all
59?" but "what does one honest conversion cost?"

We chose `watercolor`: 2D, romantic, universal, and hard to fake. It has a clear
medium (paper as the white, transparent layering, flying white, painting-in,
annotation layer, one accent) and a lot of demo-specific content to leave behind.

## Decision

Convert **one** Lemo style into a Paper Studio pack, with no renderer and no video:

- Six artifacts plus six recipes: `BRIEF.md`, `STYLE.md`, `tokens.json`,
  `capabilities.json`, `recipes/*.json`, `card.html`.
- Bundled OFL fonts and notices; no network at render.
- An 11-section `STYLE.md` (Intent, Materials, Colour, Type, Composition, Motion,
  Sound, Signature, Refusals, Not for, Questions) proven in this pack. The
  `styles/_template` change is deferred until a scaffold smoke test exists.
- Two formats: `watercolor-page` (1:1, 45 s, 8 shots, locked journal) and
  `watercolor-scroll` (16:9, 45 s, 4 shots, one continuous walk).
- A prompt-isolated, byte-sealed blind application at 30 s / 9:16 / six shots,
  in a temp copy outside the repo, with a baseline manifest, a used-input manifest
  and a live pack hash. The seal proves bytes, not that the author never opened the repo.
- A gate test (`test/watercolor-gate.test.ts`) that proves counts, durations,
  aspects, hashes, regressions, card evidence and the 11 headings.

The pack is a **watercolour field journal**, not a generic paper pack. It keeps:
paper as the white; transparent layering; 3-pass pooled edges; flying white on wide
strokes only; painting-in tied to entry; a hand annotation with a leader; one
recurring accent; a limited camera grammar (`static`, `pan`, `tilt`, `push_in`,
`pull_back`, `parallax`); `wipe`/`page_turn`/`hold`; a silent mist; an acoustic
sound palette. It refuses vector-with-texture, pure white, gloss, impasto,
calligraphic gesture, hard cuts, dissolves, photographic likeness, non-Latin
fallback, opaque pigment fills and more than five pigments.

## What was excluded

No Lemo demo story, characters, map, rainfall journey, specific plants or animals,
113.6 s timing, Kokoro voice, Scott Buckley track, vendor data, stills, `poster.jpg`,
`.srt` or LemoLab end card. No Lemo code. `sources/lemo/watercolor-source.md`
records the D01–D27 extraction and the not-taken list. `THIRD_PARTY.md` and the
pack's `LICENSE-THIRD-PARTY.txt` carry the MIT and OFL notices; the demo's CC BY
4.0 status is recorded and nothing is reproduced.

## The blind loop is the cost

The plan assumed one blind author. It took **fifteen**. Each early run found a real
contract defect; the fifteenth applied the pack without an edit.

| Run | Finding | Fix |
|---|---|---|
| 1 | The 30 s page could not use the walk; title arch under the title; quote wash behind its own refused text; no 9:16 scale; no allocation rule. | Page contracts vs walk; arch moved right; quote wash moved to the object base; 9:16 scale; allocation rule. |
| 2 | No measured-label slot; 9:16 title guidance conflicted with the arch; scale not tied to a frame width; `evening-blue` accent too close to its wash; unused fields/mist order unclear. | Date/venue carry the measured label; title left/arch right; scale tied to 390 px; accent vermilion; notes added. |
| 3 | 9:16 boxes partial; assets read as subjects; mist source unnamed; accent recurrence undefined; `sequence[].count` and loudness unstated. | `aspectBoxes` expanded; assets are types; mist erases the preceding shot; "recurs" means at least twice; counts/loudness notes. |
| 4 | Seal/quote boxes broke 9:16 margins; specimen push-in exactly 6% vs "under six"; mist composite ambiguous. | More 9:16 boxes; "six percent or less"; mist composite note. |
| 5 | Close boxes, title label stacking, leader re-aiming, repeated note, paint after mist, mist opacity, score stop, quote attribution still open. | More 9:16 boxes; mist/close notes. |

Runs 6–15 continued the loop: names and 9:16 maps, rounding, the title horizon,
the half-frame mist, caption width, stroke widths, the brief/type mismatch, the
seal size, the paper gap, the specimen-note placement, the names box and the
full-paper mist end state. The full table and every run's questions are in
`gate/watercolor-blind/REPORT.md`.

The first fourteen runs are archived; the fifteenth is the live `work/`.

## Gate evidence

```text
typecheck                         pass
tests                             93 / 93
style:check watercolor            REVIEWABLE, 0 hard, 1 open choice (paint-in speed)
style:check keepsake              REVIEWABLE, 0 hard, 1 open choice (unchanged)
style:check template              DRAFT, 6 known hard failures, exit 0 (unchanged)
resolve page (garden + song)      8 shots, 45 s, 1:1, 9/9
resolve scroll (garden + song)    4 shots, 45 s, 16:9, 9/9
blind (run 15)                    6 shots, 30 s, 9:16, 9/9
pack hash                         sha256:e4a75b7843c73645c63ad6224ae6413631285a161aabdc28673d17581e6d0b2b
pack                              21 files, 2,584,134 bytes (mostly four OFL fonts)
manifests                         baseline and used byte-identical; every hash matches
card                              no external requests; six evidence tests; six-frame strip; both paint-in speeds
critics                           contract 9/10 GO · creative 9/10 GO · product 9/10 GO
```

The open choice is **paint-in speed: 1.2 s or 1.8 s per painted form**. The pack
stays REVIEWABLE; the director signs. This is the same pattern as S1a's keepsake.

## What the pilot proved

- A fresh author can apply the pack to a different film without the source bible;
  the seal proves bytes, not that the author never opened the repo.
- The pack is reusable across a garden wedding page, a song page, a 16:9
  handscroll and a 9:16 vertical page.
- The contract catches content, engine terms, asset references, transitions,
  word limits, bindings and card defects without a renderer.
- The 11-section human brief is better than the old six-section template: it
  forces medium, colour, type, composition, motion, sound, signature, refusals and
  fitness to be written down.

## What the pilot did not prove

- Pixels, motion feel, phone legibility, paint-in feel, mist opacity in a real
  frame. That is S2.
- Per-shot content variation, per-shot notes or a measured-value slot. S1a has one
  value per slot and twelve closed slots.
- 9:16 wedding invitations (the blind film is a song/memory), non-Latin scripts or
  photo-led weddings.
- The full 9:16 song cut or a 9:16 wedding; the blind is a memory film.
- Per-run pack snapshots for runs 1–14; the report records their hashes as the
  lead's record and archives the work.
- Delivery loudness: the formats carry `"loudness": "-16 LUFS"` as passthrough
  metadata; the resolver ignores it and the renderer is S2.

## Cost

The honest cost was **fifteen blind iterations, not one**. The pack is 21 files
and 2.58 MB, mostly fonts. The gate is 12 tests and runs in under a second; the
full suite is 93 tests. The conversion needed one source autopsy, three pre-build
critics, fifteen blind authors and three post-build critics. Most of the work was
not writing the pack; it was discovering what the prose bible left implicit.

## Deferred

- `gallery.json` and the Phase 4 gallery app.
- The template-wide 11-section `STYLE.md` (prove it here first; adopt with a
  scaffold smoke test).
- 60 s duration, non-Latin scripts, photo-led weddings.
- A 9:16 song fixture and a 9:16 wedding format.
- Per-shot slots and per-shot subjects.
- Renderer implementation of the declared walk world and three entries; the
  recipe carries `world.width 2.4`, `repeat: continuous` and three entries.
- The mist two-state schedule; the close's paper-gap overlay is allowed as the
  sheet, but the renderer must schedule it.
- Paper K-pop and the `styles/paper-vows` migration (S1c).
- Renderer, frames, video, pixel conformance (S2).

## Recommendation

1. Keep the 11-section `STYLE.md` structure; adopt it in `styles/_template` after a
   smoke test.
2. Add the per-shot slots and implement the declared walk world before a real 1:1
   or 16:9 job.
3. Convert `papercut-red` next if the wedding/festive vertical is the priority;
   otherwise run S1c Paper K-pop. The watercolor pilot shows one conversion is
   several days of contract work, not an afternoon.
4. Do not convert the other 58 styles until the second conversion is cheaper than
   the first.

## Open director choice

Paint-in speed: **1.2 s** or **1.8 s per painted form**. The card shows both at the
same seven-second loop. The director answers, then signs.

## Rights

Pack: **Proprietary — Paper Studio internal pilot**. Fonts: SIL OFL 1.1. Source
grammar: Lemo-Opuscar watercolor, MIT docs, Copyright (c) 2026 LemoLab; demo film
CC BY 4.0, not reproduced. Legal review before commercial sale.
