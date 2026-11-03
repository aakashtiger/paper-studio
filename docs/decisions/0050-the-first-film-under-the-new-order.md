# 0050 — The first film under the new order is *The Uber Cut*

**Status:** accepted · 4 Nov 2026
**Owners:** creative (`films/uber-model/**`), shared (the chain)
**Depends on:** 0025 (four documents), 0035 (measured clock), 0040 (voice first), 0041 (camera), 0043 (180–190), 0045 (assets), 0046 (body/reaction/pop), 0047 (writing), 0049 (cut to the read)

## Context

The user asked for a video explaining how Uber makes money, and for the whole
plan to be completed. The film is the first made through the new order:

```
idea → story → beats → voice:story → scenes → score → voice --from-story
     → camera:check → assets:new/coverage → audit:body → audit:reaction
     → preflight → inspect → determinism → collage → draft
     → render:film → deliver → audits → asr → gate:7 → film:review
```

It is 30 s, 10 shots, 5 beats, 5 narration lines, 91 words, 16:9, 30 fps.

## What the film says

Public, general facts only:

1. Uber does not own the cars, kitchens or freight; it owns the network.
2. Riders tap, drivers use their own cars, the platform matches the trip.
3. Uber takes a **service fee** from each fare; the driver keeps the rest.
4. The same app also sells **delivery**, **freight**, advertising and
   memberships (Uber One), so one network earns in more than one way.
5. More riders make each car busier; more drivers shorten the wait; the network
   is harder to leave.

No exact take rate, revenue figure, city, date, person or logo is invented.
Kiran (rider) and Vaz (driver) are the only invented names, and they live in
`brief.json`.

## Measured

- Voice: 91 words / 182 script wpm; speed 1.14; **25.37 s voiced (84.6%)**; last
  word 28.94 s; 93/93 words heard by Whisper in `voice:story`, 91/91 on the
  delivered master by `asr`.
- Cut: 10 shots, median 3.0 s, 2.0–3.7 envelope; 4 camera moves (push, orbit,
  pan, pull back), longest run 2; 4 scene pairs re-cut to the read at 0.1 s.
- Body/reaction: 422 legs, 0 unpaired, worst ankle jump 27.6 px; 5/5 word
  reactions at +0.0 frames.
- Sound: 9 cues; master −14.0 LUFS / −1.9 dBTP; delivered −14.1 / −2.3 dBTP;
  duck 8/8; 4 declared breaths; tail −28.5 → −80.8 dBFS.
- Picture: 900 frames, 15 cuts, 0 blank, 0 pops, 0 holds >0.4 s; palette/clipping
  pass; paint-match 31 frames, worst 38.1 dB.
- `gate:7` **PASS · 22 checks · nothing manual**; picture
  `sha256:570caa57db0…`; `film:review` **PASS**.
- One sheet: `build/uber-model/final-sheet.png`. Delivered:
  `films/uber-model/uber-model.mp4`.

## What this does not do

- The visuals are the existing paper office/city set, not a literal car, map or
  phone UI. A map/phone renderer is a style-pack addition, parked.
- No music; narration + code-generated cues.
- P0.7 bypasses and P0.9 sound-contrast/LRA/close-up rows are parked (see
  `docs/ASSUMPTIONS.md`); the gate that ran is the 22-check gate, all green.
- *Same Alarm* remains a historical film without a script; it is not repaired.
