# Fresh critic brief — *The Run* (M0 close-out)

You are a fresh, independent critic. You have no history with this film and no
loyalty to the people who made it. Your job is to find what is wrong with the
delivered picture, not to agree with the gate.

## The film

- Score: `Y:\NewVideoTest\proofs\kpop-crime-60\film.json` (21 shots, 60 s)
- Shots: `Y:\NewVideoTest\proofs\kpop-crime-60\shots.json`
- Lines and events: `Y:\NewVideoTest\proofs\kpop-crime-60\sync.json`
- Delivered picture: `Y:\NewVideoTest\proofs\kpop-crime-60\out\kpop-crime-60.mp4`
  (1920x1080, 30 fps, 1800 frames; you cannot watch video, so use the evidence)
- One still per shot: `out/stills/t*.png` (the times are in `shots.json`)
- Contact sheet: `out/sheet/contact-sheet.png`
- Cuts, both sides: `out/cut-pairs-1..4.png`
- Hands, every cast hand: `out/hands/hands-1..6.png`
- The ten-row gate: run `node scripts/quality-check.mjs proofs/kpop-crime-60/film.json`
  from `Y:\NewVideoTest`

## What the film is trying to be

A 60 s paper-cut crime short in the KPOP grammar: a thief steals, a detective
closes the case, and the film ends on a noose that is only a shadow. The film
must read as one continuous world: same props, same rooms, same light, same
characters from shot to shot, and every line answered by a picture event.

## What to judge (read-only — do not edit any file)

You may also pull any single frame out of the delivered MP4, which is stronger
evidence than a sheet. This is read-only:

```
& "Y:\NewVideoTest\studio\node_modules\ffmpeg-static\ffmpeg.exe" -y -v error -ss 18.4 -i proofs/kpop-crime-60/out/kpop-crime-60.mp4 -frames:v 1 proofs/kpop-crime-60/out/critic/at18_4.png
```

Score each axis 1–10 and give evidence by shot and second.

1. **Continuity** — props, costume, hair, cap, room layout, day counters, light
   direction. A prop that flips sides or changes size is a finding.
2. **Anatomy and contact** — hands, cuffs, sleeves, necks, feet, and anything
   that floats or is painted off-frame.
3. **Story legibility** — can you tell who did what, in what order, and why,
   from the pictures alone (no audio)? Name the first shot where you lose it.
4. **Performance** — does every body move for a reason, or is it a still doll
   being panned?
5. **Type** — hero, label, subtitle and sticker: legibility, collision with a
   face or a prop, and anything that says something the brief does not.
6. **World variety** — does the film change its room, palette and composition,
   or does it look like one set with a moving camera?

## Output

Write `critics/<your-role>.json` with:

```json
{ "role": "picture|story", "score": 0-10, "verdict": "GO|NO-GO",
  "findings": [ { "shot": "s07", "t": 18.4, "severity": "P0|P1|P2",
                  "what": "...", "evidence": "which sheet or still" } ],
  "named_strongest": "...", "named_weakest": "..." }
```

Be specific and adversarial. A finding with no shot and no evidence is not a
finding. Do not repeat the gate; the gate already ran. Find what the gate cannot
see.
