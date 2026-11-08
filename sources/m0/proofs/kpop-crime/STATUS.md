# THE RUN — crime proof status

**Date:** 7 Nov 2026
**Stage:** first vertical slice, not the 60 s film.

## What is built

| Layer | State |
|---|---|
| **Gate** | `scripts/quality-check.mjs` now derives its root from the film path, reads `film.cast` for geometry, and **exits 1 below 10/10**. Verified: `kpop-test` still 10/10 exit 0; a copy with `look.luma = 110` prints 9/10 exit 1. |
| **File split** | `proofs/kpop-crime/` — `characters/man.js`, `sets.js`, `props.js`, `shots/s01..s04.js`, `test-scenes.js`, `test-words.js`, `index.html`, `render-crime.mjs`. |
| **Male rig** | `man` (4.1 heads, short hair, jaw, moustache option, 4.1-head face), `detective` (brown coat, fedora, moustache), `warder` (navy uniform, cap, badge), `judge` (robe, glasses). Costumes: shirt, coat, prison, suit, robe, uniform. |
| **Sets** | alley (brick, rain, streetlamp), city chase (blocks, windows, searchlights), hideout (window, table, calendar), cell (bars, high window, bench), court (bench, flag, light), yard (wall, gallows, bell, dawn). |
| **Props** | knife, case file, tear-off calendar, handcuffs, noose, gavel, covered body. |
| **4-shot slice** | s1 alley (day 1), s2 chase (day 3), s3 court (day 10), s4 yard (dawn). 12 s, 4 lines, 34 words. |

**Stills:** `out/stills/t1_50.png` (alley), `t4_50.png` (chase), `t7_50.png` (court), `t10_50.png` (yard).

## Critic pass 1

The independent critic failed 3 of 7 checks:

- **s2 chase** read as a lineup; the man's hand was on the detective; both arms out.
- **s3 court** judge's legs over the bench; empty bench; floating gavel and GUILTY tag.
- **s4 yard** noose on the mouth; rope above the beam; empty second noose; floating bell; post between the legs.
- **s1** inverted knife, straight file arm, flat covered body.

Fixed: the court bench is chest-high with the judge behind it, arms down, gavel block and GUILTY placard on the bench; the chase has a stride, a forward lean and pumping arms, the detective smaller/behind; the yard has two gallows posts, a platform/trapdoor, a hung bell, a noose at the neck; the alley has a body-shaped sheet, a flat knife and a bent file arm.

## What is not done

- **The 60 s film.** No 60 s script, no 186-word read, no 21-shot score, no `sync.json`, no `shots.json`, no narration/word clock.
- **The gate artifacts.** No `film.json` (crime), `rig.json`, `measured.json`, `frame-diff.json`, `twin.json`, `look.json`, `sound.json`, `mix.wav`.
- **The render.** No MP4, no contact sheet, no 15 fps sheets, no 30 fps cut strips.
- **Critic pass 2.** The 4-shot slice has not been re-critiqued after the fixes; the noose still sits at the chin, the bench front is blank, and the male rig is a first pass.
- **The second film.** No proof that a different cast/palette/sets still passes 10/10.
- **The orchestration.** The 7-analysis / 4-rebuild workflow is still manual; no worktrees, no `FIXLIST.md`, no continuity linter.

## Next steps, in order

1. **Finish the 60 s script** — 186 ± 4 words, 12–14 lines, 180–190 wpm, the 10-day calendar, the court, the yard.
2. **Speak it and measure it** — word clock, `test-words.js`, `sync.json`.
3. **Write the 21-shot score** — `film.json`, `shots.json`, cast/prop/set per shot, the one return to the cell.
4. **Add the continuity linter** — `day`, `location`, `state`, `setId`, prop state, wardrobe, `DAY n`.
5. **Measure, render, gate** — `--measure`, `--frames`, `--encode`, `frame-diff`, `twin`, `look`, `quality-check` 10/10.
6. **Critic pass 2** — contact sheet + 15 fps sheets + 30 fps strips; fix; repeat.
7. **Second 60 s film** — different cast/palette/sets; same gate; 10/10.
8. **The 7+4 orchestration** — file split, worktrees, `FIXLIST.md`, per-shot critics, film critic.

The 4-shot slice is the male-rig proof, not the deliverable. The 60 s film is the next gate.
