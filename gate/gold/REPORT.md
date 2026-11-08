# The variety gap — `claude-pop.mp4` vs `kpop-test.mp4`

The test matches the gold's tempo and motion, not its variety: **1** world type, palette and performance mode; **1–2** compositions; **2** rigged cast; **2** transitions — against **8** world types, **9** palettes, **7** modes, **9** compositions and **53** transitions. Shot rate 0.361/s vs 0.345/s; median 2.74 s vs 2.90 s; 0 frozen frames.

**Gold:** `Y:\NewVideoTest\out\claude-pop.mp4` (156.63 s, 4,698 frames). **Test:** `Y:\NewVideoTest\proofs\kpop-test\out\kpop-test.mp4` (24.90 s, 747 frames).

## Method

- **Scene detection:** `ffmpeg -i <video> -vf "select='gt(scene,T)',metadata=print:file=<log>" -an -f null -`; events <0.40 s apart are one cut. T=0.22 requested; **T=0.15 used** because 0.22 merges the test's s6+s7+s8 into 6.63 s. Authored lists: gold 54 (`STORYBOARD.md`), test 9 (`shots.json`).
- **Look:** full-rate `signalstats`; edges `edgedetect=low=0.1:high=0.3,signalstats` at 1 fps (gold full-rate edge pass exceeded 15 min; test 4.75 vs 4.61).
- **Palette:** 2 fps, 192×108 RGB, `src/engine/palette.ts` (sat ≥0.3, delta ≥0.08, 12×30° bins). Frames: `gold-sheet-5s.png` (32×5 s), `test-sheet-9.png` (9).

**Audit note:** `look-gold.json` (109.09) is stale; direct pass **100.98/22.11/4.54** matches docs ≈100.9/21.8; test `look.json` reproduces luma/sat.

## 1. Shot-length distribution

| metric | gold authored (54) | gold 0.22 (48) | gold 0.15 (53) | test authored (9) | test 0.22 (7) | test 0.15 (9) |
|---|---:|---:|---:|---:|---:|---:|
| min | 0.22 | 0.70 | 0.67 | 1.42 | 1.63 | 1.40 |
| median | 2.90 | 3.18 | 3.07 | 2.74 | 3.70 | 2.77 |
| max | 6.14 | 7.20 | 6.20 | 4.38 | 6.63* | 4.07 |
| % ≤1.2 s | 5.6 | 4.2 | 5.7 | 0 | 0 | 0 |
| % ≥5.5 s | 5.6 | 8.3 | 3.8 | 0 | 14.3* | 0 |
| % ≥4.5 s | 16.7 | 29.2 | 17.0 | 0 | 14.3* | 0 |
| longest run ≥4.5 s | 3 shots / 15.92 s | 3 / 15.23 | 2 / 10.33 | 0 | 1 / 6.63* | 0 |

\*0.22 artifact: s6+s7+s8 read as one shot; 0.15 recovers all 9. Buckets (<1/1–2/2–3/3–4.5/4.5–5.5/5.5–8/≥8), gold then test: **2/18/8/17/6/3/0** vs **0/4/1/4/0/0/0**.

Medians match; **tails do not**. Gold has 3 micro-shots (0.22–1.05 s) and 9 shots ≥4.5 s; the test has neither (max 4.38 s vs 6.14 s). Gold's coda is 3 consecutive shots ≥4.5 s (15.92 s).

## 2. What is on screen

| axis | gold (n=54; `STORYBOARD.md`, `PRODUCTION.md`) | test (n=9; `film.json`, `measured.json`, `test-scenes.js`) | gap |
|---|---|---|---|
| sets | 54 unique Set lines / 54 (100%); largest family stage 10/54 = 18.5% | 7 set functions / 9; `kpopStage` 3×, `dressingSet` 2×; theatre stage 5/9 = 55.6% | 7 vs 54 |
| world types | **8**: interior 14, stage 10, abstract 10, exterior 6, graphic 5, macro 4, space 4, diorama 1 | **1**: theatre interior 9/9 | 8× |
| cast identities | 10 groups (SOL, MIRA, 5 Petals, GATO, CLIP, SHOGGOTH, BASILISK, CHINCHILLA, DOOM METER, CLOUD GUARDS) + crowd/stagehands | 2 rigged: `nova`, `mira`; crowd/backups unrigged | 5× |
| cast size | **0–10+**, median 2; ≥4 in 12/54 = 22.2%; 2 zero-cast | **1–2**, median 2; ≥4 in 0/9 | 0 vs 22% ≥4 |
| palettes | 9 authored (10 rows, crimson/gold repeats); **8/12** hue bins; 23 top+second pairs | 1 palette; **3/12** bins (red/spring/cyan); 7 pairs | 1 vs 9 |
| performance modes | **7**: stage 25 (46%), diagram 8 (15%), macro 6 (11%), creature 5 (9%), close 4 (7%), chase 4 (7%), diorama 2 (4%) | **1**: stage/presenter 9 (100%) | 7× |
| compositions | **9**: wide 21 (39%), medium 13 (24%), macro 7 (13%), close 4 (7%), scroll 4 (7%), overhead 2, isometric 1, diptych 1, diorama 1 | **1–2**: eye-level medium/wide 9 (100%) | 5–9× |
| type | 5 roles (hero, label, lyric, subtitle, HUD); **6 typefaces**; 54 unique briefs; 5 shots with no lyric/subtitle | 4 roles; 3 typefaces (Anton, Archivo Black, DM Mono); **1 hero treatment**; hero in 9/9 | 1 vs 54 |
| transitions | 53 unique / 54; 8 mechanic types; 32 bespoke; largest generic 4/54 = 7.4% | **2**: flash 7 (77.8%), curtain 2 (22.2%) | 26× |
| camera | **12+ types**: push 17/54 (31%), zoom 9, track 7, pull 6, orbit 6, tilt 6, crash 5, dolly 4, whip/roll/pan/Dutch/top-down/handheld 1–4, fisheye 1 | **4**: push 4 (44%), pull 3 (33%), track 1, whip 1; roll **≤2°**; no pitch/tilt/orbit/overhead | 3× |
| motifs | 7 recurring (DOOM meter, paperclip, folio 34/61/86/99.9, glasses, waving Petal, moon on string, © bug) + 3 continuity (karaoke band, print furniture, theatre) | 2 (cue lamp, star) + HUD clock | 5× |

**"9 worlds" fails in code:** `kpopStage` is s2/s6/s9, `dressingSet` is s4/s5: 5/9 shots, one stage.

## 3. Look, per act

| band | luma | sat | edges (1 fps) |
|---|---:|---:|---:|
| gold I 0–22.72 (682 frames) | 120.14 | 27.23 | 3.68 |
| gold II 22.72–73.80 (1532) | 103.21 | 25.06 | 4.83 |
| gold III 73.80–95.20 (642) | 109.15 | 21.56 | 4.46 |
| gold IV 95.20–137.02 (1255) | 89.59 | 15.03 | 4.75 |
| gold V 137.02–156.63 (587) | 88.30 | 24.17 | 4.41 |
| **gold whole (4698)** | **100.98** | **22.11** | **4.54** |
| **test whole (747)** | **80.15** | **21.95** | **4.61** |
| test per-shot range | 54.75–127.84 | 10.85–29.53 | 3.43–6.80 |

Gold act means span **31.8 luma** and **12.2 saturation**; test is one band at 80.15, below every act and never in acts I–III's 103–120. Its 73-point per-shot swing is lighting, not palette.

## 4. Variety minimums to encode

Floors derive from gold's measured rates; est. = judgment.

| axis | gold evidence | minimum |
|---|---|---|
| sets | 54/54 | ≥90% unique; ≥6 families; largest ≤30% (gold 18.5, test 55.6) |
| world types | 8; every act ≥3 | ≥3 per act; ≥5 per film |
| cast | ≥3 identities/act; 10 groups; size 0–10+ | ≥3 identities/act; ≥6/film; size 0–8+ (est.); ≥20% ≥4; ≥1 zero-cast |
| palettes | 9; 8 bins; ≥2 hues/act | ≥5/12 bins/film; ≥2/act; ≥3 palette variants/act (est.) |
| performance modes | 7; max 46%; ≥4/act | ≥4/act; no mode >60% |
| compositions | 9; max 39%; ≥5/act | ≥5/act; no type >50%; ≥1 overhead/isometric, macro/close and silhouette/scroll |
| type | 5 roles; 6 faces; 54 briefs; 5 no-hero | ≥4 roles; ≥4 faces; ≥6 hero treatments/act (est.); none >30%; ≥1 no-hero shot |
| transitions | 53/54; max 7.4% | ≥5/act; no type >25% |
| camera | 12+ types; push 31% | ≥5/act (est.); push ≤40%; ≥1 orbit/tilt/overhead; claim roll only if ≥3° |
| motifs | 7 + 3 continuity | ≥4 recurring, each ≥3 shots and ≥2 acts (est.); ≥1 continuity device in ≥80% |
| rhythm | 5.6% ≤1.2 s; 5.6% ≥5.5 s; 16.7% ≥4.5 s; run 3 | ≥5% ≤1.2 s and ≥5% ≥5.5 s (or ≥1 each <30 s); run ≥4.5 s ≤3 shots |
| look | act means 88–120 luma, 15–27 sat | ≥3 act look bands; per-act spread ≥20 luma / ≥8 sat |

## 5. Axes the test fails

1. **Set-family range** — 1 world type; 5/9 same stage.
2. **Cast-size range** — 1–2; 0% ≥4; no ensemble, creature or zero-cast.
3. **Palette range** — 3/12 bins, one palette; no mint, cobalt, ochre, sepia, steel or pink world.
4. **Performance modes** — 1/7; no diagram, creature, macro, chase, diorama or true close.
5. **Composition** — 1–2/9; no overhead, isometric, silhouette, macro, diptych or side-scroll.
6. **Type** — 1 hero treatment; no lyric role; no no-hero shot; 3 typefaces vs 6.
7. **Transitions** — 2 types, flash 78%; gold's largest generic type is 7.4%.
8. **Camera** — 4 types, push+pull 78%; no pitch/tilt/orbit/top-down; roll ≤2°.
9. **Rhythm tails** — 0 shots <1.2 s (gold 5.6%), 0 ≥4.5 s (gold 16.7%), max 4.38 s (gold 6.14 s).
10. **Motifs** — 2 vs 7 + 3 continuity.
11. **Act structure** — one 25 s act/one place vs 5 acts/8 world types.

**Passes:** shot rate 0.361 vs 0.345; median 2.74 vs 2.90; 0 frozen, longest still 1.13 s; poses 3–5, faces 2–6, gestures 1–4; night look 80.15/21.95/4.61 vs gold-night 79.79/18.68/4.55.

**Bottom line:** nine rooms in one theatre vs a film that changes world, cast, palette, mode, composition and type constantly.
