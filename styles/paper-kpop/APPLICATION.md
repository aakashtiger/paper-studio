# Applying Paper K-pop

This pack is a style contract. It is not a video and it contains no renderer. A film is made later from a content brief and a format. This page is enough for a fresh operator to fill the brief, choose a format and resolve a plan.

## Read order

1. `STYLE.md` — the human contract, signature, refusals and open choice.
2. `tokens.json` — palette, type, layout, motion, sound and seed.
3. `capabilities.json` — limits, assets, rigs, proof and governance.
4. `recipes/*.json` — eight shot recipes, one per beat role.
5. `card.html` — the visual index.

## Brief JSON

```json
{
  "content": {
    "title": "Static Bloom",
    "subtitle": "Paper Weather · The Lantern Room",
    "names": "Nia Vale",
    "body": "Bring a coat",
    "caption": "Doors 8:30 · 31 Oct",
    "monogram": "NV"
  }
}
```

Only `title`, `subtitle`, `names`, `body`, `caption` and `monogram` are read. `date`, `venue`, `hashtag`, `rsvp` and `photos.*` are not read by this pack. A release date or city goes in `subtitle` or `caption`. There is no photo slot.

`content.names` is one billing string, not a cast count. Write “Lead and Second” when both performers are credited. A one-name film may use an uncredited foil in `stage_wide`; the portrait is one lead and the close is a diorama/prop close. `content.caption` may be the lyric-band line or a short event caption, never a third-party lyric.

## Format JSON

```json
{
  "id": "static-bloom",
  "name": "Static Bloom — 9:16 Short",
  "beatRoleMap": {
    "opening": "open",
    "title": "title",
    "portrait": "portrait",
    "formation": "list",
    "quote": "quote",
    "closing": "close"
  },
  "sequence": [
    { "beat": "opening", "role": "open", "count": 1 },
    { "beat": "title", "role": "title", "count": 1 },
    { "beat": "portrait", "role": "portrait", "count": 1 },
    { "beat": "formation", "role": "list", "count": 1 },
    { "beat": "quote", "role": "quote", "count": 1 },
    { "beat": "closing", "role": "close", "count": 1 }
  ],
  "durations": [30],
  "aspects": ["9:16"],
  "primaryAspect": "9:16",
  "palette": "day-stage",
  "loudness": "-14 LUFS"
}
```

`beatRoleMap` values are the closed roles `open`, `title`, `portrait`, `detail`, `list`, `quote`, `transition`, `close`. `sequence` repeats roles. `durations` must overlap `capabilities.limits.durations`. `aspects` must overlap `capabilities.limits.aspects`. `primaryAspect` must be one of `aspects`. `loudness` is optional passthrough metadata.

## Resolve a plan

From the repository root:

```powershell
npm run style:resolve -- --style styles/paper-kpop --seed 42 --brief <brief-a.json> --format <format.json> --brief <brief-b.json> --format <format.json>
```

Two briefs are required: assertion 4 proves the plans differ. The resolver starts each shot at its recipe minimum and shares the remainder by remaining capacity in whole milliseconds. Leftover milliseconds go to the largest fractional remainders, ties to the earlier shot. The plan is not a render; S2 quantises cut boundaries to the 88 BPM grid.

## Limits

- 16:9 and 9:16. 30 s and 45 s. Up to 2 performers. 8 words per content slot. 14 px minimum at 390 px.
- 8 recipes, one per beat role. All 8 are used across the song and Shorts formats.
- 9:16 is a re-stage, not a crop. `tokens.layout.aspectRules.9:16` defines anchors and insets. Paired objects have dedicated anchors (`openCore`, `lyricText`, `stickerBed`, `stickerText`, `stickerRule`, `stickerBurst`, `stageBurst`, `chaseArrow`, `closeStrip`, `closeBody`); do not collapse a bed, sticker, copy and rule onto one box.
- Text auto-fits inside its box. No content slot may fall below 14 px at 390 px width. The only text inside the bottom 12 percent is the portrait's lyric-band caption.
- Palette is a production choice, default `day-stage`; `night-stage` is the alternate named by the treatment. It is not a second sign-off choice.
- The one open director choice is `paper-shadow`: Collage (soft contact shadow) or Print (flat with a visible cut edge and only the type shadow).

## Rules

- No third-party lyric, song title, voice, footage or photograph.
- No source-film title, character name, scene or audio.
- No new recipe and no edit to a sealed pack. A pack change invalidates a blind run. A contract-only clarification that changes no slot, recipe, duration or format structure and re-resolves 9/9 may be recorded as a disclosed exception with both hashes.
- Do not claim pixels, video or phone motion. Those are S2.
- The style supplies no audio files; music and voice are cleared per film. Delivery loudness belongs to the format.
