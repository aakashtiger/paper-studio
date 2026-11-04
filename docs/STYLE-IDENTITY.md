# Style identity — the Paper K-pop contract

**Status:** accepted and enforced (0052)
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

`style:identity -- <score>` checks the axes the score and frames can prove:
cast construction (not library membership), at least half the shots staged, and
the global luma / contrast / saturation / edge / palette bands against the
pack's reference frames via the existing `style:measure`. `render:film` refuses
without a passing report tied to the score; `film:review` re-runs it on the
delivered video (`--video`), and `gate:7` has a `styleIdentity` row tied to the
frozen picture. The final sheet remains the human review of whether it *looks*
like the channel.

Measured on *The Uber Cut*: 9/10 shots staged, Δ luma −1.0, Δ saturation −4.1,
palette 43.0, all inside the bands; `gate:7` PASS 24 checks.

## Non-goals

- It is not a template: no required sunflower, banner or lamp.
- It is not a colour filter: the story still decides the image.
- It is not a library loyalty test: a new character on the same construction is
  inside the style.
