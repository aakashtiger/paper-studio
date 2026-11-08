# The gold standard — pinned, in git

The KPOP reference is **one film**. Every number this repo compares a KPOP film
to comes from it. This folder holds the *measurements*; the film itself never
goes in the repo.

| | |
|---|---|
| File | `Y:\NewVideoTest\out\claude-pop.mp4` (outside the repo) |
| sha256 | `fb85200bc5315ad7ad3b6be8676261bf02efd35713a15ff1a607600e9aaee85a` |
| Size | 289,495,829 bytes (276 MB) |
| Container | 156.63 s · 1920×1080 · 30 fps · 4,698 frames · H.264 + AAC |
| Look | luma **100.98** · saturation **22.11** · edges **4.54** (night act 79.79 / 18.68 / 4.55) |
| Edit | **54** authored shots · median **2.90 s** · 53 transitions |
| Variety | 8 world types · 9 palettes · 7 performance modes · 9 compositions |

## What is here

| File | What it is |
|---|---|
| `GOLD.json` | the pin: hash, container, look, edit, variety. **The one file a tool reads.** |
| `REPORT.md` | the human version — how the 54 shots were read, the acts, the gaps |
| `gold-authored-shots.json` | the **54-shot authored map** (O1): every shot's in/out and what it is |
| `gold-classify.json` | each shot's performance mode, composition and set type |
| `palette-shots.json` | per-shot palette, for the palette-family audit |
| `scene-stats.json` | per-act luma / saturation / edges |
| `look-final.json` | the whole-film look reading in the one unit (`docs/references/kpop-units.md`) |
| `gold-sheet-5s.png` | the gold, one frame every 5 s, for a human |
| `test-sheet-9.png` | the 25 s look proof on the same sheet, for comparison |
| `stills/s01…s54.jpg` | **one still per authored shot**, at its midpoint, 960 px — regenerate with `npm run gold:stills` |
| `proof-kpop-25s-proxy.mp4` | the 25 s look proof, **720p proxy** (3.6 MB): how the pack looks *in motion* against the gold |

## How a clone sees the gold without the film

The film is 276 MB and stays outside. A style cannot be built from a hash, so the
reference is three things that *are* in git:

1. **The map** — `gold-authored-shots.json`: all 54 shots with start, end, title,
   set, camera, type and transition, in plain English. This is the most useful
   artifact in the folder: it is what "the gold look" means, written down.
2. **The stills** — `stills/s01…s54.jpg`, one per shot at its midpoint, named in
   map order. Every shot in the film, ~5 MB. `npm run gold:stills -- --ref <film>`
   regenerates them from any copy of the gold and refuses a file whose hash is not
   the pin.
3. **The numbers** — `GOLD.json` (look, edit, variety) and `palette-shots.json`
   (per-shot palette). These are what `style:measure` and the palette audit
   compare against.

What is deliberately **not** here: motion. A still cannot show a camera move or a
cut's rhythm. Those are carried by the map's `camera` and `trans` lines and by the
measured edit (median 2.90 s, 53 transitions), not by pixels. If a film needs a
motion reference, use a release-asset proxy of the gold rather than putting the
master in git.

`proof-kpop-25s-proxy.mp4` is the one moving reference in the repo: the pack's
own 25 s look proof, re-encoded to 720p from
`proofs/kpop-test/out/kpop-test.mp4` (24.90 s, 51 MB), so that a reader can see
**our** look move before M1 re-renders it. **It is a proxy, not the delivered
cut** — no hash of it is evidence. When M1-E ports the proof into the pack, the
new film's own MP4 replaces it and this file is deleted.

## Why the MP4 is not here

It is 276 MB. GitHub refuses a file over 100 MB, and a git repo is the wrong
place for an output that will never change: every clone would carry it forever.
The repo's own rule says the same thing (`.gitignore`: `*.mp4`, `out/`, `build/`).

Nothing in M1 needs the pixels. The pack is made of recipes, painters, maps,
policy and variety floors; those are checked against **numbers**, and the numbers
are in `GOLD.json`. The pixels are needed for exactly two things — re-deriving
the gold, and the look-delta at K1.2/K1.4 — and both are done on the machine that
holds the file.

## If you are on another machine

The film is published as a **release asset** on this repo, because a release allows
2 GB where git allows 100 MB:

```
gh release download gold-2026-11-08 --repo aakashtiger/paper-studio -D ./refs
```

That brings `claude-pop.mp4` (276 MB), its `.sha256`, and `gate-gold.zip` (this
folder, 11 MB) so a clone without the repo still has the reference. The repo is
private, so `gh` must be authenticated (`gh auth status`).

1. Get the file from there, or from wherever it lives (a shared drive).
2. Check the hash before trusting a single number:
   ```
   certutil -hashfile claude-pop.mp4 SHA256
   ```
   It must be `fb85200bc531...`. A different file is a different gold; stop.
3. Re-derive the evidence you need:
   ```
   npm run style:measure -- --ref <path to claude-pop.mp4>
   npm run gold:stills -- --ref <path to claude-pop.mp4> --verify
   ```
   Do **not** re-pin the gold as a side effect of a measurement. If the numbers
   move, the file moved, and that is a finding, not a refresh.

## Provenance of this copy

Copied from `build/audit-gold/` on 8 Nov 2026, because `build/` is gitignored and
a fresh clone would otherwise have no reference at all. The only edit is
`GOLD.json` → `sources`, whose two paths now point at this folder instead of
`build/audit-gold/`. No number was changed.

The raw dumps that produced these numbers (`gold-signal.txt`, `gold-edge-1fps.txt`,
`palette-out.txt`, 4 MB together) are deliberately not copied: they are derivable
from the film, and only the reductions are evidence.
