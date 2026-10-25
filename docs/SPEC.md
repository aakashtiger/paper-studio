# Product spec — v1

## Problem

A couple planning a wedding can buy a template-based invitation video, or commission a studio. The template is cheap and forgettable. The studio is expensive and slow.

There is no middle: a film that feels made for them, delivered in days, at a price that is not a studio price.

The same gap exists for creators. AI video tools generate clips; they do not hold a visual style across many videos, and they do not give a timeline a creator can actually edit.

## Users

**Primary (v1): the couple.** They care about how it feels, not how it is made. They will share it on WhatsApp. They watch it on mute first.

**Secondary: the planner.** They bring repeat volume. They care about turnaround and how easy the intake is.

**Later: the creator.** They make songs, Shorts and long-form. They want style consistency and control, and they will pay a subscription.

## Jobs to be done

- "Make our invitation feel like us, not like a template."
- "We have photos. Use them, but make them look beautiful, not pasted in."
- "We need it for WhatsApp, for the projector, and as a printed card."
- "We need to change the date/venue/photo without starting over."
- "We do not want our family photos uploaded to someone's server."

## v1 scope

- One style: **Paper Vows** (the quiet sibling of Paper K-pop).
- One format: wedding invitation film, 30/45/60s.
- Three aspects: 9:16, 16:9, 1:1.
- Inputs: names, families, events, venue, date, RSVP, text, photos, music, palette, motif, tone.
- Outputs: master video, WhatsApp cut, projector cut, still card, RSVP QR, captions.
- Deterministic: seed + style version reproduce the film.
- Revisions: change one field, re-render only affected shots.

## Non-goals for v1

- self-serve creator studio
- long-form YouTube
- research, script and narration
- 3D and camera-heavy work
- multi-language UI (Hindi output text is supported; the UI is English)
- marketplace
- cloud rendering
- mobile app

## Inputs

See `src/core/brief.ts` for the authoritative schema and `fixtures/wedding-min/brief.json` for an example.

| Group | Fields |
|---|---|
| Couple | names, roles, display order |
| Families | relation, names |
| Events | type, date, time, venue, city |
| RSVP | method, value |
| Text | invite line, quote, blessing, hashtag |
| Photos | path, must-use, consent |
| Art | palette, motif, tone |
| Delivery | duration, aspect, deliverables, music, locale |

## Outputs

| Output | Spec |
|---|---|
| 9:16 master | 1080×1920, H.264, 30fps, AAC 192k |
| WhatsApp cut | 9:16, compressed for chat |
| Projector cut | 1920×1080 |
| Still card | PNG + PDF, print-safe margins |
| RSVP QR | PNG, verified link/phone payload |
| Captions | burned in, plus SRT |

Loudness target: −16 LUFS for wedding films, −14 LUFS for social.

## Tiers

| Tier | What varies | Price (India) |
|---|---|---|
| Classic | content only, 3 curated sequences | ₹4,999 |
| Signature | content + composition + motif pack | ₹9,999 |
| Bespoke | + new assets and human art direction | ₹24,999+ |

The template is the emotional arc. The novelty is the composition. New artwork is the premium tier, not the default.

## Success metrics

- Time from brief to first preview: under 24 hours (service), under 10 minutes (studio).
- Revision turnaround: under 30 minutes.
- Approval on first or second cut: above 70%.
- Support time per film: under 20 minutes.
- Referral: at least one other couple per film.

## Risks

| Risk | Mitigation |
|---|---|
| Output looks templated | composition variation + motif packs |
| Bad photos ruin the film | photo quality gate before render |
| Wrong name or date | confirmation screen before render |
| Determinism drift between machines | golden fixture + bundled fonts + pinned ffmpeg |
| Inference cost at low price | service pricing per film; creator tier is BYO LLM |
| Style IP copied | compiled style packs, licensing, continuous updates |
| Provider terms | user-driven local agent, API fallback, legal review before scale |
