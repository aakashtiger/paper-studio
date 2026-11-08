# M0 FIXLIST — The Run (60 s)

Started: 2026-11-08. Target: 3–4 h wall clock. Clean picture: `out/kpop-crime-60-scratch.mp4` (sha `404f0282…`).

| # | Shot / frame | Finding | Owner file | Fix | Status |
|---|---|---|---|---|---|
| 1 | s01 0.0–3.4 | `CASE 044` sticker and poster case number appear before the detective opens the file | `shots/s01.js`, `sets.js` alley poster | Remove s01 sticker; alley poster says `SUSPECT`, not `CASE 044` | done |
| 2 | s02 3.4–4.9 | Coral neon slash reads as police tape across the alley | `sets.js` alleySet | Remove the neon slash | done |
| 3 | s04 8.7–10.3 | Station clerk reads female (round head, bun) | `sets-60.js` stationSet | Square jaw, short flat hair, sideburns, tie | done |
| 4 | s05–s15 | Thief hair is a smooth bob; reads female at 480 px | `characters/man.js` manHead | Short spiky cut, jagged fringe, no part line | done |
| 5 | s07→s08→s09 | Bag, money, flat cap and chair flip sides; calendar moves | `shots/s07.js`, `s08.js`, `s09.js` | One layout: bag 940, money 610, calendar 890, chair 700, cap 760 | agent |
| 6 | s07–s09 | Duplicate bag: satchel on the table + bedroll in the corner | `sets.js` hideoutSet | Remove the bedroll | done |
| 7 | s07–s09 | Three day counters: small planner, nine scratches, hero page | `sets.js` hideoutSet | Remove planner and scratches; hero page is the only counter | done |
| 8 | s12 33.0 | Flat cap too large on the barrier | `characters/man.js` drawFlatCap | One cap size: 0.82 everywhere | done |
| 9 | s14 38.5, s15 41.0 | Flat cap too large in the detective's hand; s15 used the old `grayHat` | `shots/s15.js`, `characters/man.js` | Use `flatCapProp` at the rig size | done |
| 10 | s10/s12 | Background fedoras have a gold band; detective's is dark | `shots/s10.js` queueBack | Dark band everywhere | done |
| 11 | s15 39.2–43.1 | Second cuff on the detective's finger, not the thief's other wrist | `shots/s15.js` | Both cuffs on the thief's wrists; chain between | done |
| 12 | s15 39.2–43.1 | Two background civilians at 0.32 read as children | `shots/s15.js` | Adult scale 0.44 | done |
| 13 | s19 51.5–56.0 | Folded court jacket's white collar reads as the CASE 044 file in the cell | `shots/s16.js` foldedCourtJacket | Navy collar, cream edge; reads as a jacket | done |
| 14 | s18 47.8–51.5 | Knife drawing in the file reads as a second loose knife | `shots/s17.js`, `s18.js` | Boxed exhibit photo with a caption bar | done |
| 15 | s20 56.0–58.1, s21 58.1–60.0 | Noose shadow is a flat oval on the far wall, not at the neck | `shots/s20.js`, `s21.js` | Beam shadow at 1340, loop at 760/380, one rope | done |
| 16 | all shots | Two day counters: hero `DAY n` / mono `DAY n` plus the calendar | all `shots/s*.js` | Calendar page only; hero becomes the location; mono loses the `DAY n ·` prefix | done |
| 17 | s16→s17 | 044 prison shirt can read under the court jacket | `shots/s16.js` | Verify the jacket covers it; s17/s18 already use the suit shirt | pending critic |
| 18 | s20/s21 | Cuffs are in front, not behind the back | `shots/s20.js`, `s21.js` | Keep the staged re-cuff; verify the warder's hand is the hand at the cuff | pending critic |
| 19 | alley/hideout | WANTED poster face is a generic silhouette | `sets.js` | Keep the deliberate unknown-suspect silhouette; verify it is the same poster in both | pending critic |
| 20 | s06 13.0–17.3 | Tunnel window is a still black rectangle; 18 frames under 1.0 (motion row FAIL) | `sets-60.js trainWindow60/trainLampGlow`, `shots/s06.js` | Wall ribs, cable and sodium lamps slide past at 1180 px/s; warm wash + light band in the carriage; crouch re-blocked as a lunge (16 px bounce, staggered feet) so the body never locks | done |
| 21 | s01 0.0–3.4 | 1.53 s still while the knife presses | `shots/s01.js` | `pressB/C/D` keys shift the weight and grind the blade; longest still 0.63 s | done |
| 22 | s17 45.2–47.8 | The accused does not clasp on "read"; the judge's cuff stops behind the card | `shots/s17.js` | Hands come together at the belt on the word; sleeve cuff painted over the card's edge, fingers and thumb over its face | done |
| 23 | s21 58.1–60.0 | The body is a still doll at the bell | `shots/s21.js` | Pre-bell lean into the wall, shoulders and elbows brace back on the bell, then settle; tremor kept | done |
| 24 | s03 4.9–8.7, s10 26.1–28.7, s11 28.7–30.9 | Performance row FAIL: no gesture in three shots, and s03 holds 2.43 s | `shots/s03.js`, `s10.js`, `s11.js` | s03 lifts the bagged knife to the light beside the file on "name" (213 px), leans in to read at 1.86 and rocks back at 2.10; its ambient drift is raised above the 0.2 rad/s floor (head 0.045, lean 0.035, file hand 0.030) so the longest still is 0.23 s. s10 and s11 share one far-hand gesture, held across the cut and dropped on "face." (175 px). The far arm is painted behind the coat, so the hand goes clear of the silhouette | done |
| 25 | s02 3.4–4.9 | The performance row reports `no cast registry` for a hand-and-prop shot | `film.json`, `scripts/quality-check.mjs` | `performance: "macro"` is a declared mode, exempt from rig metrics only when no rig was drawn; motion still applies (decision 0064) | done |

## Evidence after the fix
- New scratch: `out/kpop-crime-60-scratch.mp4` (new sha)
- 21 stills: `out/review-now/`
- Contact sheet: `out/review-now-sheet.png`
- `quality-check` 10/10, `chain-check` 233/233, `review-check` PASS
- `review.json` tied to the delivered MP4

## Round 2 — the two fresh critics (picture 7/10 NO-GO, story 6/10 NO-GO)

Every P0 and P1 from `critics/picture.json` and `critics/story.json` is a row.
Where a finding was argued down, the argument is in the row, not in chat.

| # | Shot / time | Finding | Owner file | Fix | Status |
|---|---|---|---|---|---|
| 26 | s20 56.0 | P0 picture: prisoner has no forearms or hands for the whole shot | `shots/s20.js` | Cuffed-in-front pose (`armL [0.55,-1.55]`, `armR [-0.55,1.55]`), both hands drawn, chain and rings over the wrists | done |
| 27 | s11 30.9 | P1 picture: the loot vanishes on the cut to s12 | `shots/s11.js`, `shots/s12.js` | Bag let go on "face.", falls to the ground at x 595; s12 draws the same bag at 595 for the whole shot | done |
| 28 | s18 47.8 | P1 picture: the type block is clipped by the left frame edge | `shots/s18.js` | Type starts at x 120 like every other shot | done |
| 29 | s07 18.5 | P1 picture: pale muzzle panel comes and goes with the expression | `characters/man.js` | One opaque jaw shade (`ellipse 32x12 at y 56`, alpha 0.30) plus sideburns; no mouth-sized pale oval | done |
| 30 | s15 39.2 | P2 picture: torn-cream matte only in this shot | `src/props.js`, `sets-bridge.js` | `paperBg` and the bridge deck overscan; the matte is gone | done |
| 31 | s18 49.5 | P2 picture: "THE COURT IS EMPTY" over a court that is not empty | `shots/s18.js` | Subtitle reads "THE GALLERY WAS EMPTY"; the empty gallery benches are in frame | done |
| 32 | s17 45.2 | P2 picture: warder's belt mirrored between shots | `shots/s17.js`–`s21.js` | Cuffs at `wx - 52` in every shot, the baton/keys stay where the rig draws them | done |
| 33 | s15 41.5 | P2 picture: bystander is a thief double (tan coat, grey flat cap) | `shots/s15.js` | Crowd is three dark adult backs at 0.42–0.48; no cap/coat matches the leads | done |
| 34 | s20–s21 58.4 | P0 story: the ending is only in the words | `shots/s20.js`, `shots/s21.js` | s20 walks him from the yard door to the trapdoor on "yard," and the noose shadow closes at his neck; s21 holds them on the platform under the beam | done |
| 35 | s11 29.8 | P1 story: the detective never looks from the file to the man; thief waves | `shots/s10.js`, `shots/s11.js` | s10 head down over the page; s11 lifts his head to the man; the raised hand is gone (right hand at the collar, then the chest) | done |
| 36 | s12 33.4 | P1 story: the hat decoy is not readable | `shots/s12.js` | Cap taken at 32.12, on the barrier by 33.3; the detective's head is down on the cap from 33.5 | done |
| 37 | s14 38.5 | P1 story: "waited at the far end" over a shoulder-to-shoulder two-shot | `shots/s14.js` | He holds at the gate until "far" (38.32), then walks; at 38.6 he is still at the far end | done |
| 38 | s15 39.7 | P1 story: cuffs close late | `shots/s15.js` | `cuffT = "closed."` 39.68; the ring shuts on that frame, the far ring stays open in the detective's fingers | done |
| 39 | s15 41.0 | P1 story: two lead doubles at the arrest | `shots/s15.js` | Removed; three dark backs only | done |
| 40 | s01 1.5 | P1 story: premise not legible; poster invented | `shots/s01.js`, `sets.js` | Body-contoured sheet (head wrap, chest, waist dip, feet); wanted poster removed from the alley and the hideout | done |
| 41 | s07–s09 21.0 | P1 story: one room, one pose, a still doll | `shots/s07.js`–`s09.js`, `sets.js` | Three cameras, calendar 5→6, clock 2:09→5:40→11:20, bag packed and lifted, knock step-back and raised hand | argued: the room is one location by design; each shot owns one action |
| 42 | s10 27.5 | P1 story: checkpoint is not an obstacle | `sets-60.js`, `shots/s10.js` | Clerk behind the hut glass, boom barrier, queue, CHECKPOINT sign; thief at the barrier end | done |
| 43 | s18–s21 46.5 | P1 story: cast asleep on its feet | all shots | All 53 `eyes:"narrow"` replaced with `"normal"`; s18 reopens at `gavelT+0.72`, s19 blinks at `calT+0.45` and reopens at `calT+0.62`; s20/s21 eyes open | done |
| 44 | s19/s21 53.4 | P2 evidence: stills did not match the MP4 | `stills`/deliver chain | Full re-render and re-delivery; every sheet is regenerated from the new cut | done |
| 45 | s12 31.5 | P2 story: "turned his collar up" not played | `shots/s12.js` | Right hand at the collar 31.3–32.0, collar rises before the cap is taken | done |
| 46 | s07–s09 18.5 | P2 story: clock frozen across days | `shots/s07.js`–`s09.js` | 2:09 / 5:40 / 11:20 | done |
| 47 | s03 7.3 | P2 story: name field is a black bar | `shots/s03.js` | Cursive name row inside the ruled field; no redaction bar | done |
| 48 | s20→s21 58.4 | P2 story: the match cut resets the pose | `shots/s20.js`, `shots/s21.js` | s20 ends on the trapdoor, cuffed in front; s21 opens on the platform with the same cuffs and the noose over the beam | done |
| 49 | s09–s10 24.0 | P2 story: the bag changes shape | `shots/s08.js` `bagProp`, `s09.js`–`s12.js` | One `bagProp` at 0.78–0.80 from the table to the checkpoint to the ground | done |
| 50 | s01–s21 27.5 | P2 story: invented facts (flag emblem, station time) | `sets.js`, `sets-60.js` | Court flag is a plain red field with a gold hoist stripe; clock and departure times are set dressing, declared in the score's world | argued |
| 51 | s02 3.6 | P2 story: the sheet is a sliver when the line names it | `shots/s02.js` | The sheet fills the lower-right third with its head end in frame; the shot stays a macro of the knife | done |

---

## STATE AT PARK — 2026-11-08

**M0 is closed as a system proof, not a deliverable.** The user stopped the fix
pass to protect the schedule. Nothing here is thrown away; the work is recorded
so the next film inherits it as preflight rows instead of discovering it again.

### The file that exists

`out/kpop-crime-60.mp4` — **163.2 MB**, `sha256:5769fef56e61287fe0ce48711bbc5d84d39fa8073d6cac5f15731f7dfa73839d`,
60.00 s, 1800 frames, 1920×1080, 30 fps, H.264 + AAC.

A copy for reference lives outside the proof: `Y:\NewVideoTest\out\kpop-crime-60-M0.mp4`.

This is the cut the two fresh critics read, and it is the cut they refused:
**picture 5/10 NO-GO, story 5/10 NO-GO**, both tied to that `videoHash`.
Every machine gate below the critics passes on it — `quality-check` 10/10,
`review-check` PASS, `storyboard-check` 21/21, `chain-check` 233/233, picture
look 80.24 / 14.8 / 3.26, master −14 LUFS / −1.5 dBTP.

**Read it as: the system can make a 60 s film that passes every check it has,
and two people still said no.** That is the finding worth carrying forward, not
the film.

### Fixed in the working tree, NOT in that file (unrendered)

These edits parse (`node --check`) but were never painted, so the MP4 above does
not contain them. They are the real P0 work and must not be reverted:

| File | What it now does |
|---|---|
| `shots/s15.js` | Both cuffs land on two **solved** wrists, the chain runs between them, the detective's palm is solved onto the chain; file moved under his right arm at 0.80; crowd of three walkers put on the empty left pavement with legs; the face never closes its eyes. |
| `shots/s20.js` | Rewritten: cuffs carried in the warder's right hand from frame 1 (belt empty), both gates close, wrists solved per frame, feet driven by distance so the stride cannot skate, day page on the wall, noose shadow clear of the head, no overlaid loop on the man. |
| `shots/s21.js` | Rewritten: opens on s20's exact end pose; the halo ellipse is gone; the hatch opens on "shadow." and he drops behind the platform under a clip, so no body is shown; the wall shadow goes taut; the warder walks off left. |
| `shots/s10.js` | `queueBack` gained a `stride` argument: walkers now show legs and boots and swing an arm. |
| `sets-60.js` | Housekeeping: `solveArm` / `armReach` — the rig's own `manHand` inverted. Proved by `_arm-probe.mjs` (1002 poses, 0.001 px worst error). |

### Parked, in the order the next film should inherit them

1. **s16 (was P1)** — the cuffs must travel hand → belt with the hand, and the court jacket must be handed over at chest height with both men's hands solved onto it. The rig cannot reach its own belt (`max reach ≈ 188 px` from a shoulder at y 400 → lowest hand ≈ y 592); the hand-off has to happen between two bodies.
2. **s12 (was P1)** — remove the "eyes followed the hat" decoy, hero `THROUGH` → `THE CHECKPOINT`, `WITHOUT STOPPING`.
3. **s13 (was P1)** — the searchlight must actually track onto the thief and pool at his feet on the word; the `SEARCHLIGHT` sticker currently sits on empty pavement.
4. **s14 (was P2)** — enlarge the case file under the detective's arm so it reads.
5. **Cheap P2 sweep** — s04 clock 10:10 vs the 02:10 slate; s17 `THE JUDGE` sticker position; s09 hero `THE HIDEOUT` → `THE HOURS` with the minute hand moving; s06 tunnel black on "tunnel,"; s01 knife hand / s02 body staging; genericise `CENTRAL STATION`, `02:10`, `NORTH`, `ONE WAY`, `CASE 044`, `$100`, `CROSS WITH CARE` — keep `THE RUN`.

### If this film is ever resumed

```
node proofs/kpop-crime-60/render-crime-60.mjs --stills=39.5,41,57,58.6,59.4   # probe the 4 rewritten shots
node proofs/kpop-crime-60/render-crime-60.mjs --frames=0:59.99 --workers=4    # 1800 frames, ~12 min
node proofs/kpop-crime-60/deliver-m0.mjs --from=stills                        # stills → sheet → deliver → gate
```
Then `critics:check` must fail on the new `videoHash` (it is tied to `5769fef5`)
and two **new** fresh critics must sign GO. Do not reuse the 5/10 pair.
