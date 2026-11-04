# Style identity — the Paper K-pop contract

**Status:** accepted and enforced (0053)
**Date:** 4 Nov 2026
**Why:** the Uber film was script-relevant but not channel-relevant. A style is a
set of invariants plus controlled variation, not a repeated opener.

## The rule

A person should recognise the channel with the sound off: same **character
construction**, same **paper material**, same **palette family**, same **light**,
same **type**, same **composition and camera grammar**, same **cut/motion
rhythm**. The story, place, props, layout, opener and which motifs appear change.

## Invariants

| Axis | What stays | What may change |
|---|---|---|
| Cast | Paper-puppet construction: two-bone limbs, visible eyelets, chest/head/hand/foot anchors, the rig's face vocabulary, the pack's palette roles. A character is a **type**, not a fixed identity. | The character's name, face, hair, clothes, age, role. A **new character is allowed** if it meets the construction contract. Library characters are reusable sources, not a membership requirement. |
| Palette | Roles from `tokens.json`: cream paper, ink, bright blue, red, gold, one accent. Contrast and saturation inside the reference band. | Which roles dominate; whether the accent is red or gold. |
| Material | Flat cut paper, torn/cut edge, visible fibre, halftone, ink; every shot is a paper layer. | The subjects and props; the shape of the tear. |
| Light | One key, hard paper shadow, one lit side; the light has a source in the frame. | The hour, direction and colour temperature inside the band. |
| Type | The pack's display/body/caption families, scale hierarchy and safe area. | The words and the layout. |
| Composition | Layered paper depth, a ground line, a safe area, a readable focal plate. | The arrangement, number of plates, camera side. |
| Camera | Push / pull / pan / orbit, never static; varied and motivated. | The sequence and speed. |
| Cut / motion | Median 2.5–3 s for a short, cut on the beat, paper performance. | The rhythm inside the band, the number of shots. |
| Motifs | A small optional library: banner, sticker, window, lamp, clock, stack. | Whether a motif appears, and why. No motif is mandatory. |
| Opening | A first image from this film's subject. | The default title card is not an identity; it needs a reason. |

## Cast policy (corrected)

- **Not** “every film must use the shared library.”
- **Not** “a new character is a style break.”
- **Yes**: every staged character must be built to the same paper-puppet
  construction, rig, anchor set, face vocabulary, pose/expression grammar and
  palette. The library is the easy reuse path; a film may design a new
  character that conforms.
- The per-film decision **library or new** is a product capability, parked. The
  style check must accept a conforming new character now.

## Enforcement

`style:identity -- <score> [--video]` is one verdict from three sources: the
pack's nine-group `tokens.identity`, the score's `performance` / `paletteScript`
/ `motifs`, and the painted frame report. The report is tied to the score hash,
the identity hash, the frame-report hash and - on delivery - the video hash.
Missing or null is a finding.

- `collage` writes `build/<id>/frame-report.json`: one sample per shot, a
  chest/head/leg aperture box, side bars, the largest flat field, a 30%-padded
  local-contrast ring, blue-on-blue and palette families.
- `preflight` reads the score/cast half before a browser opens.
- `render:film` requires the report chain; `render:film --check` proves it
  without painting.
- `film:review` re-runs the identity check on the delivered video; `gate:7` has
  the `styleIdentity` row plus `preflight`, `closeUps`, `lra` and
  `soundContrast` - **28 checks**.

Measured on the reference film: luma **100.9**, saturation **21.8**, edges
**12.6**, all inside the film bands. Measured on *The Uber Cut*: luma **144.8**,
saturation **35.7**, bars **21.7% / 24.2%**, centroid band **0%**, height sd
**6.3** / one tier, local contrast median **27.4**, blue-on-blue **30%**,
close-ups **100%**, LRA **1.9**, 3 s contrast **2.1 LU**. The film fails 17
identity findings and 5 gate rows **by design**; its delivered MP4 is unchanged.
This is the calibration, not a regression.

The final sheet remains the human review of whether it *looks* like the channel.

## Non-goals

- It is not a template: no required sunflower, banner or lamp.
- It is not a colour filter: the story still decides the image.
- It is not a library loyalty test: a new character on the same construction is
  inside the style.
