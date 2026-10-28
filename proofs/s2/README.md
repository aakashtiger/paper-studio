# S2 motion proof — Paper K-pop / Watercolor 0.2.0

**Built:** 2026-10-28
**Format:** 15 s · 1920 × 1080 · 30 fps · H.264
**Stills:** three per style
**Command:** `node scripts/s2-proof.mjs`

## What this is

A deterministic 15-second visual proof with **three shots per style**:

- **Paper K-pop 0.1.0** — open sun / title card / two-cast stage.
- **Watercolor 0.2.0** — title page / 16:9 walk / unfinished close.

The two styles play side by side. Each shot is five seconds. The motion is
authored from the packs' tokens, palettes, type, boxes and composition grammar in
`proofs/s2/proof.html`.

## Files

| File | What it is |
|---|---|
| `s2-motion-proof.mp4` | 15 s, 1920 × 1080, 30 fps, no audio |
| `paper-kpop-still-1/2/3.png` | open / title / stage |
| `watercolor-still-1/2/3.png` | title / walk / close |
| `contact-sheet.html` | the six stills on one page |
| `contact-sheet.png` | the same contact sheet as an image |
| `proof.html` | the authored proof renderer |
| `scripts/s2-proof.mjs` | the command that renders it |

## How to view

Open `contact-sheet.html` in a browser, or play `s2-motion-proof.mp4`.

## How to rebuild

```powershell
node scripts/s2-proof.mjs
```

The script uses local Chrome/Edge and `ffmpeg-static` from the workspace. It
renders 450 frames, checks that the same time twice produces identical pixels,
encodes the MP4, crops the six stills and writes the contact sheet.

## What it proves

- The two style grammars are legible in motion: paper cut/snap/type/drop versus
  watercolour wash/paint-in/leader.
- The palettes, type registers, composition logic and aspect boxes can produce a
  moving frame without the source film's story, lyrics or characters.
- The proof is deterministic at the frame level: the same time renders the same
  pixels.
- The command is repeatable.

## What it does not prove

- **It is not the plan renderer.** It does not read a resolver plan or execute
  the full recipe op set (camera, transitions, effects, assets, rigs).
- **It is not the 15 s / 3-shot S2 gate.** That gate needs a plan-driven engine
  and byte-identical output on two machines.
- It is not a full film, not audio, not a phone test, not every recipe.
- The assets are simplified paper/wash forms, not the final character, prop and
  set plates.
- The 1:1 and 16:9 text-fit proof is still unverified/S2; this proof is 16:9.

## Why this exists

The handover asked for a short render test, contact sheet and motion comparison
before a full renderer. This is the first visual proof: it shows the two styles
moving, and it makes the remaining renderer gap explicit instead of claiming a
video that does not exist.
