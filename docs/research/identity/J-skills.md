# J — Skills: every local animation, video and style-identity parameter

**Date:** 2026-11-04
**Scope:** the skill, prompt, critic and reference documents installed or vendored
on this machine that could define animation, video or style identity — read
inventory-first, then parameter-extraction, then gap analysis against Paper
Studio.
**Read in full:** 54 documents — 21 HyperFrames core (SKILL, 13 references, 7
type grammars), 6 HyperFrames CLI, 8 media-use, 2 prompts, 8 critics, 1 tools
note, 3 PDoomVideo, 5 cross-check — plus the print sections of the 929-line
media-treatment cookbook, and 1 of 13 preset `FRAME.md` files line by line (the
rest classified by frontmatter).
**Not an implementation.** No repository file was changed except this one. Every
value below is quoted from a source or explicitly marked `proposed`; where a
skill gives a law but no number, the gap is stated as a gap.

---

## 0. The honest headline

The local skills are **three different kinds of document**, and only one of them
is a parameter table.

| Kind | What it gives | Where |
|---|---|---|
| **A measured craft manual** | Exact numbers, named eases, px, ms, dB, LUFS, thresholds — measured from shipped films | HyperFrames `motion.md`, `sound.md`, `spec.md`, `film.md`, `captions.md`; PDoomVideo `ANIMATION_GUIDE.md`; claude-animated-shorts `reports/motion.md` |
| **A production contract** | Closed vocabularies, required fields, card sections, pass/fail gates, hash-bound approval | `prompts/*.md`, `critics/*.md`, `docs/STYLE-AUTHORING.md`, `spec §27 decisions` |
| **A rule-set with no magnitudes** | "The camera must move", "the seam must be soft", "the transition must belong to the medium" — and no number | Vizavi (already covered by `F-vizavi.md`), most of HyperFrames `review.md`, `story.md` |

The useful finding: **the numbers Paper Studio lacks are almost all in
HyperFrames' motion/sound/caption files, and the identity fields it lacks are
almost all in its own prompts and critics already** — the pack defines *what*
the channel is, the skills define *how much*.

---

## 1. Inventory

Abbreviations used in this document:

- `HF/` = `node_modules/hyperframes/dist/skills/hyperframes/references/`
- `HF/types/` = `.../hyperframes/references/types/`
- `CLI/` = `node_modules/hyperframes/dist/skills/hyperframes-cli/references/`
- `MU/` = `node_modules/hyperframes/dist/skills/media-use/references/`
- `PRESET/` = `.../hyperframes/assets/frame-presets/<id>/FRAME.md`
- `PD/` = `Y:\NewVideoTest\ref\PDoomVideo\`
- `CAS/` = `C:\Users\Aakash\Downloads\Compressed\_research\claude-animated-shorts\claude-animated-shorts-main\`
- `VIZ/` = `C:\Users\Aakash\Downloads\Compressed\_research\vizavi-motion\` (cross-check only; `F-vizavi.md` is the full treatment)

### 1.1 HyperFrames core skill — 21 documents + 13 presets

| File | Class | What it fixes | Identity value |
|---|---|---|---|
| `hyperframes/SKILL.md` | video + QA | 12 contract rules; 1920×1080 @30 fps default; 90% action-safe, 80% title-safe; "no voiceover/captions/aspect unless asked"; a >15 s film gets sound | **high** — the purity rules match decision 0023 |
| `HF/motion.md` | **animation** | Moves, eases by role, springs, exits, overlap, stagger, beat grid, cuts, titles, holds, transitions with durations, mechanism table, 4 motion-sidecar assertions, 4 common faults | **highest numeric density in the corpus** |
| `HF/look.md` | style authoring | Design-spec frontmatter is normative; reference gives *grammar not content*; 13 preset looks; the LOOK line; H.264 gradient banding; accent opacity 15–25% | **high** — the "reference is grammar" rule |
| `HF/spec.md` | **style authoring** | `SPEC.md` template (GOAL/OUTPUT/TIME/LOOK/OBJECTS/MOTION/SHOTS/BANNED/QA); adjective→number table; composition numbers; 13 banned defaults; "a look is the rules of one medium" | **highest for identity definition** |
| `HF/film.md` | video | TTS 2.2 words/s; scene ≈19 words/9 s; 155 words/30–90 s; PR length ceiling table; music loops and hit timing; maps | **high** — pacing bands |
| `HF/story.md` | video (writing) | One thing; three storylines; hook; beat shares 8/12/8/40/20/8/8; 8 worlds; copy rules; 8 tells of a generated film | **high** — beat proportions |
| `HF/review.md` | **review** | Measure→look; 7 review questions; P0/P1/P2; "never score the film out of 10"; delivery note | **high** — anti-score discipline |
| `HF/sound.md` | sound | Voice is the clock; music under voice 0.14; SFX peak one frame after picture; 3–6 dB over bed; −1 dBTP; −16…−14 LUFS | **high** |
| `HF/captions.md` | text | Word timings; groups 2–6 words; 150 ms break; fit defaults 78/42/2; 80–120 px / 600–700 px placement; hard kill | **high** |
| `HF/overlays.md` | composition | Card/PIP rectangles at 1920×1080 and 1080×1920; card fade 0.4/0.35 s; card density 1 per 6–8 s; portrait type ×1.3–1.4 | medium |
| `HF/format.md` | runtime/composition | Attribute contract; clip windows; variables; 19 bundled fonts; lint table | low (mechanical) |
| `HF/runtimes.md` | animation runtime | GSAP facts; seek protocol; seed with mulberry32; finite repeats | medium (purity) |
| `HF/storyboard.md` | video/board | Board as stills the person approves; one frame per shot; re-pose one frame only | medium (process) |
| `HF/storyboard-format.md` | schema | Frontmatter keys; per-frame `reads` and `sound`; windows never overlap | medium |
| `HF/skill-lifecycle.md`, `HF/plugin-installation.md` | utility | Install/update rules | none |
| `HF/types/launch.md` | video type | Real UI never a mockup; isolate at 1.6–2×; cursor 4–7% of frame; moves 0.4–0.6 s; end card last 5–10%, lockup 15–30% width, CTA held 1.5–3 s | medium |
| `HF/types/explainer.md` | video type | One example worked through; one diagram that grows; 30–90 s; ~19 spoken words a scene | medium |
| `HF/types/music.md` | video type | Sections become chapters; lyric shots 1.4–4 s; one picture per strong beat in chorus; same treatment ≤6 s | **high** (paper-kpop is a song style) |
| `HF/types/data.md` | video type | One number at a time; count-up 1.2–1.6 s then hold; tabular figures; annotate on the mark | medium |
| `HF/types/vertical.md` | video type | 1080×1920; top 168 px empty; content 168–1330 px; below 1330 px decoration only; shots 1–2 s; beat every 2–4 s; type ×1.35 | **high** (9:16 pack) |
| `HF/types/3d.md` | video type | Seeded simulation; `render(t)` pure; warm key/cool rim; roughness ≥0.45 | low (not transferable) |
| `HF/types/character.md` | **character** | Mood changes through a take; squash/stretch/anticipation/overshoot belong to the character; offset parts (head leads, arms follow); never move both arms/eyes/crowd in unison; contact sells it; rig = parameters over time; 12 redraws/s boil | **highest for cast identity** |
| `PRESET/<13>` | style authoring | `FRAME.md` frontmatter: `colors`, `typography` (family/cqw/px/weight/lineHeight/tracking), `spacing`, `components`, `radii`, `shadows`, `borders`, `principle`; 6 frame treatments; do/don't; aspect table; pre-render self-audit | **high as a schema** |

Presets (13): `biennale-yellow`, `blockframe`, `blue-professional`,
`bold-poster`, `broadside`, `capsule`, `cartesian`, `cobalt-grid`,
`code-editorial`, `coral`, `creative-mode`, `daisy-days`, `editorial-forest`.
Each is `FRAME.md` + `caption-skin.html` + `frame-showcase.html` (+ fonts).
`cobalt-grid` read in full: strictly two-colour, 0 radius, 0 shadow, 1.4cqw
legibility floor, one element dominant at 3–6× its neighbour, declarative
frames 45–60% empty, "no 3 consecutive frames share an anchor".

### 1.2 HyperFrames CLI skill — 6 documents

| File | Class | What it fixes |
|---|---|---|
| `hyperframes-cli/SKILL.md` | tooling/QA | Command-by-job table; the loop `lint → check → snapshot → preview → render`; "never render merely because checks pass" |
| `CLI/lint-validate-inspect.md` | **QA** | `check` sections; craft warnings with exact floors (`line_unread`, `dead_stretch`, `text_below_floor`, `first_frame_empty`, `film_silent`, `sweep_static`); WCAG 4.5:1 / 3:1; 4 motion assertions; snapshot sheet shapes |
| `CLI/beats.md` | music | Beat file per track; fails if no steady beat |
| `CLI/compare-and-batch.md` | review | Up to 16 variants on one sheet; grade candidates; batch variable renders |
| `CLI/preview-render.md` | tooling | Render flags (`--fps 1–240`, default 30; `--quality`; `--docker` byte-identical); Studio handoff |
| `CLI/conventions.md` | tooling | `--json`, `doctor` exit-zero, strict flags |
| `CLI/{init-and-scaffold,doctor-browser,feedback,upgrade-info-misc,cloud,lambda,cloudrun}.md` | utility | Scaffold, environment, telemetry, cloud — no identity content |

### 1.3 media-use skill — 9 documents read of ~20 + audio subtree

| File | Class | What it fixes |
|---|---|---|
| `media-use/SKILL.md` | media | One verb `resolve`; paid vs free; "offer once, never add silently" |
| `MU/grading.md` | look/post | Grading payload; 10 animatable CSS properties with ranges (exposure −2…2, bloom 0…3, etc.); never read a `.cube`; parametric vs scanned |
| `MU/mixing.md` | sound | `data-volume`, fades, automation lanes (512 points max), 15 effect types, duck to 0.3–0.4 under voice, buses |
| `MU/media-treatments.md` | look/post | 8 lanes; conservative translation; at most two candidates; before/after sheet |
| `MU/media-treatment-recipes.md` (929 lines; print sections read) | look/post | **Print parameters**: halftone fixed C/M/Y/K angles 15/75/0/45°, size 0.15–0.55; two-ink 15/75° with registration offset; mono screen shape 0..4, spread 0.15–0.55; engraving/crosshatch ranges |
| `MU/audio.md`, `audio/references/sfx.md`, `audio/references/captions/authoring.md`, `audio/references/captions/motion.md` | sound/text | SFX volume ~0.35; SFX retrieved or bundled (never generated); caption tone→style table (72–96 px hype, 44–56 px storytelling, 0.1–0.2 s pop, 0.5–0.6 s fade); karaoke + 3–6% audio-reactive scale |
| `MU/{local,operations,resolve,memory,meta,setup-providers,telemetry-dashboard}.md`, `audio/references/{bgm,requirements,transcribe,tts,tts-to-captions,remove-background}.md`, `luts/*` | utility | Provider setup, caches, memory, LUT index — no identity content |

### 1.4 Studio's own prompts, critics, tools

| File | Class | What it fixes | Identity value |
|---|---|---|---|
| `prompts/style-author.md` | **style authoring** | 7 steps; 12 questions one at a time; six artifacts; never approve; never self-answer a reserved choice; no placeholders; stop at REVIEWABLE | **high** |
| `prompts/blind-author.md` | **style authoring (sealed)** | Read-only set; six artifacts; closed vocab; no real names; card must have **11 sections in order**, hero above fold at **900×700**, motion specimen **5.6 s held spread / 1.6 s page turn / 7.2 s loop**, phone **390 px**, ≥1 REFERENCE + SPECIMEN + ANTI, never OUTPUT, `UNSIGNED`; log every gap as `Q/A` | **highest procedural detail in the repo** |
| `critics/README.md` | **review** | 7 roles; each returns score /10, blocking issues with a location, one required fix, SIGN; may not pass a broken frame, missing cue, unlicensed track or unsupported claim; gate→critic map | **high** |
| `critics/designer.md` | review | 5 questions: layered paper, poster composition, ≤4 roles + 1 accent + 1 signature move, cast unbroken at 1920 and 390, nothing cheap | **the look acceptance test** |
| `critics/motion.md` | review | 5 questions: character action not camera-only; planted feet/knees/ankle; anticipation+overshoot+≥2 breakdowns; no undeclared hold >0.4 s, no shot below motion floor; two silhouettes + shared eyeline | **the motion acceptance test** |
| `critics/editor.md` | review | Cuts on cue; median inside envelope; transitions native; captions read; works sound off and on | **the cut acceptance test** |
| `critics/sound.md` | review | Layers, band, send, duck; −14 LUFS ±1, ≤−1 dBTP, designed silence silent; ASR of the mixed master; licences | sound |
| `critics/qa.md` | review | Gate writes `gate-N.json`; all 900 frames; two renders match; every claim traces to a command | **process** |
| `critics/architect.md` | review | One score; no style data in `src/`; contracts resolved before render; a second film reuses without engine edits | **structure** |
| `critics/developer.md` | review | typecheck+test; identical frame hashes; seam 0, hands at wrists, boots at ankles; fonts before frame 1; hashes pinned | **implementation** |
| `tools/README.md` | tooling | Kokoro TTS + faster-whisper are local and external, never npm; same WAV → same words (beam 5, CPU, int8, VAD on); versions recorded | voice clock |

### 1.5 Cross-check sources (already covered elsewhere — identity fields only)

| File | Class | Identity fields it corroborates |
|---|---|---|
| `CAS/SKILL.md` | animation | Format/px/fps; look values (light presets, ink weight, lens, post order); "every visual reaction lands 0–3 frames before its word"; "every hold creeps" |
| `CAS/references/STYLE_BIBLE.md` | style identity (measured) | 1080×1920/30 fps/31–78 s; 3.5–4.1 words/s; −14 LUFS/LRA 2.4; one word captions; luma mean 0.43–0.54, std 0.21–0.29, p2 0.03–0.11, p98 0.9–1.0, saturation 0.38–0.65; cements the "measure the reference" method |
| `CAS/references/reports/motion.md` | animation (measured) | Camera hold/drift/move shares; move peak px/f; attack/release frames; roll degrees; walk/bob/lean/blink/reaction numbers |
| `VIZ/SKILL.md`, `VIZ/references/{motion-and-sound,styles-and-sources}.md` | animation/style | Style card = name + source/date + grammar (forms, type, material, light, camera/rhythm) + boundary; paper language = cut shapes, layers, edges, contact shadows, local stop-motion; no magnitudes (see `F-vizavi.md` §7) |

### 1.6 PDoomVideo — animation grammar in working code

| File | Class | What it fixes |
|---|---|---|
| `PD/ANIMATION_GUIDE.md` | **animation** | Chapter/shot API; purity + `hash(i)`/`jit(a)`; canvas and karaoke band; paint API (wash/fill/bleed/tex/border/hatch/ink/sw/brut/curv); palette names and "no pure black/white"; timing 88 BPM (0.682 s beat, 2.73 s bar), `pulse/pulse2/seg/kf`; camera `camBegin/camEnd/shakeXY`; lettering and SFX text; full-frame flash/iris; character rig parameters (pose, face, colour, hats, hooks, mood, dance); size guide; style rules; performance budget; check loop |
| `PD/STORYBOARD.md` | **style identity** | The per-chapter **palette arc** (warm cream → sky blue → space violet/gold → steel/jazz blue → data teal → alarm red → crimson/gold); "sets, not cards"; "motivated transitions"; "emotion morphs, never snaps"; "every shot has a push, pan, tilt, whip, zoom-out or on-beat shake"; lead fills ~40% frame height in chorus; shot times 1.4–4 s |
| `PD/README.md` | context | Two generations, all model-written; the guide was the sub-agent brief |

---

## 2. Parameter taxonomy

Columns: **code** = can a machine decide it from the score/rendered frames
(`yes` = fully, `partial` = proxy, `no` = human sign); **transfer** = survives a
2-D, code-drawn, cut-paper film (`yes` / `partial` / `no`).

### 2.1 Shot timing and pacing

| Parameter | Value / rule | Source | Code | Transfer |
|---|---|---|---|---|
| Default canvas and rate | 1920×1080, **30 fps**; vertical 1080×1920 | `SKILL.md:14`, `HF/types/vertical.md:3` | yes | yes |
| Shot floor | pack: `minShot 1.2 s`; short-form style band 2.5–3 s median | `tokens.motion.minShot`, `docs/STYLE-IDENTITY.md:26` | yes | yes |
| Shot ceiling | pack: 5.5 s for a music cut (a proposed `maxShot 6.0`) | `styles/paper-kpop/STYLE.md:66`, `F-vizavi.md:314` | yes | yes |
| Montage cut rate | 0.13–0.8 s per shot | `HF/motion.md:24` | yes | partial — paper costs a paint per cut |
| Average shot | 1.8–3 s with motion inside | `HF/motion.md:24` | yes | yes |
| Demo / single-framing hold | 7–10 s while the UI acts | `HF/motion.md:24` | yes | no (no UI) |
| Vertical shot length | 1–2 s; new beat every 2–4 s | `HF/types/vertical.md:23` | yes | yes |
| Music-video shot length | 1.4–4 s per lyric line | `HF/types/music.md:14`, `PD/STORYBOARD.md` | yes | yes |
| Information card settles | information on screen within ~2.5 s, then holds | `HF/spec.md:46` | partial | yes |
| Change cadence | something new every 2–4 s; new layout every bar | `HF/spec.md:47` | yes | yes |
| Hold before payoff | 0.3–0.75 s; the payoff plays at normal speed | `HF/motion.md:24` | yes | yes |
| Reading hold | 0.5 s + 0.3 s per word; last line ≥2 s; 1–2 words 0.4 s; craft floor = ¾ of the formula | `HF/motion.md:22`, `HF/spec.md:48`, `CLI/lint-validate-inspect.md:51` | yes | yes |
| Dead stretch | >3 s with nothing changing is a warning; final 3 s exempt; a `data-hold` exempts its window | `CLI/lint-validate-inspect.md:52` | yes | yes |
| Static-card death | a static card goes dead at ~8 s, needs a staged reveal past ~15 s | `HF/overlays.md:29` | yes | yes |
| Beat grid | frames per beat = `fps × 60 / BPM`; compute each beat from its index and round, never accumulate (2 frames drift in 32 beats at 128 BPM) | `HF/motion.md:13` | yes | yes |
| Cut on the beat, layout on the bar | cut = beat; layout change = bar (4 beats) | `HF/motion.md:13`, `HF/spec.md:37` | yes | yes |
| Accent→picture offsets | a move that must land on a hit starts **40–190 ms early**; a reaction starts **0–45 ms after**; the hit is a 0 ms set (easing a hit kills it) | `HF/film.md:34` | yes | yes |
| Treatment expiry | any single treatment goes stale after ~6 s; lengthen with a hold or a new treatment, never by slowing tweens | `HF/film.md:35` | partial | yes |
| Beat shares (launch) | hook 8 / tension 12 / reveal 8 / proof 40 / payoff 20 / claim 8 / end card 8; reveal 20–30% in; payoff 60–80% in; end card held 2–3 s | `HF/story.md:67–75` | yes | partial |
| Speech rate (TTS) | 2.2 words/s; scene ≈19 words (9 s); at most two scenes at 26 words (12 s); 155 words for 30–90 s; ≤400 a film | `HF/film.md:7` | yes | yes |
| Speech rate (measured shorts) | 3.5–4.1 words/s, median 3.7 | `CAS/STYLE_BIBLE.md:7` | yes | partial |
| Paper read band | 180–190 wpm; 84.6% voiced; >=0.8 coverage floor; first line ≤1 s | `docs/decisions/0043`, `0044`, `preflight.ts:54` | yes | yes |

### 2.2 Camera

| Parameter | Value / rule | Source | Code | Transfer |
|---|---|---|---|---|
| Move required | no shot is a still photograph in active storytelling; only a technical pause and the final readable frame are exempt | `HF/SKILL.md` (implied by `sweep_static`), `F-vizavi.md:61` | yes | yes |
| Variety | `requireMove true`, `minDistinct 3`, `maxRun 2` | `src/engine/camera.ts:65–67` | yes | yes |
| One hero move | one hero move per shot; secondary moves travel **50–70%** as far, start **100–200 ms** after it, everything else holds | `HF/spec.md:44` | yes | yes |
| Fast move | 0.3–0.6 s, motion blur on its own ease, peaking at the fastest frame: **6–12 px** text-sized, **15–20 px** full-frame, horizontal-only on a horizontal move | `HF/motion.md:7` | yes | partial — cap blur on paper |
| Camera move with UI | 0.4–0.6 s, arrive at the control, then hold while the UI acts | `HF/types/launch.md:27` | yes | partial |
| Push on a hold | every hold creeps: **0.15–0.35 %/f**; **0.6 %/f** for ~35 frames on a punch word | `CAS/reports/motion.md:197–198` | yes | yes |
| Orbit | a background stage may orbit at **3–5° a second** | `HF/motion.md:25` | yes | partial — paper orbit is a parallax arc |
| Static-hold ban | no static hold ≥4 frames anywhere in the film | `CAS/SKILL.md:104` | yes | yes |
| Cut placement | cut at the fastest frame of a move, with matching direction and speed on both sides | `HF/motion.md:14` | yes | yes |
| Seam continuity | check position, direction, screen speed and acceleration at every cut; mirror the ease (`power3.in` out / `power3.out` in) | `HF/motion.md:93`, `F-vizavi.md:64` | yes | yes |
| Cut-at-rest share | at most 50% of accents may cut at rest | `F-vizavi.md:301` | yes | yes |
| Depth planes | ≥3 planes; parallax ratios **1.0 / 0.6 / 0.3**; depth = scale + relative motion + overlap + perspective (all four) | `F-vizavi.md:68,304–306` | yes | yes |
| Camera vocabulary (pack) | `static, push_in, pull_back, pan, tilt, orbit, parallax`; `pull_back` must pull (`to < from`) | `docs/specs/0003` §closed contract; `src/engine/camera.ts:122` | yes | yes |
| Lens / DOF / roll | 35 mm framing, focus pull, roll — real optics | `HF/spec.md:39`, `F-vizavi.md:62,254` | no | **no** — a paper sheet has no lens; declare blur as an effect, never optics |

### 2.3 Transitions

| Parameter | Value / rule | Source | Code | Transfer |
|---|---|---|---|---|
| Budget | **3–5 kinds** in a film, each caused by something on screen | `HF/motion.md:30` | yes | yes |
| Hard-cut budget | hard cuts belong inside a scene; at most **a third** of the seams between beats are hard cuts; worlds never crossfade | `HF/motion.md:30` | yes | yes |
| Zoom through a button | camera tracks in 0.6 s with blur, then the button scales ~8%→~250% in 0.35 s, strong ease-in | `HF/motion.md:34` | yes | partial |
| Object becomes the world | pill/card grows past frame in 0.65 s ease-in-out, radius shrinks, surroundings blur ~15 px and fade in 0.3 s | `HF/motion.md:35` | yes | yes — paper shape becomes next stage |
| Morph | container widens 110→880 px in 0.2 s `power3.out`, horizontal blur 12→0 | `HF/motion.md:36` | yes | yes |
| Carry across | result shrinks 1→0.6, blur peaks 6 px mid-move, lands inside the next world | `HF/motion.md:37` | yes | yes |
| Colour flood | ground changes colour in ~0.4 s `power2.inOut` while the hero object stays | `HF/motion.md:38` | yes | yes |
| Whip | 0.13–0.3 s smear; arriving element lands blurred and sharpens in ~0.13 s | `HF/motion.md:39` | yes | partial |
| Iris | `clip-path: circle()` opens from the clicked point in 0.15 s | `HF/motion.md:40` | yes | yes — paper iris on a face or sun |
| Dip cut | outgoing frame darkens ~40% for 3 frames before a hard cut | `HF/motion.md:41` | yes | yes |
| Blur swap on one stage | out 0.13–0.2 s with ~8 px blur; in 0.13 s; the ground never cuts | `HF/motion.md:42` | yes | partial |
| Match cut | align silhouette, scale, orientation and direction; proposed thresholds IoU 0.80, scale 0.90–1.11, angle ≤5°, direction dot ≥0.90 | `HF/motion.md:14`, `F-vizavi.md:390–392` | yes | yes |
| Mask honesty | the next scene must actually appear inside the mask; an overlay on a finished cut is a lie | `F-vizavi.md:111` | partial | yes |
| Pair design | a transition is designed together with both scenes and names a carrier | `F-vizavi.md:108` | yes | yes |
| SFX per transition | not the same whoosh on every cut; do not duplicate every musical hit | `HF/motion.md`, `F-vizavi.md:114` | yes | yes |
| Pack vocabulary | `cut, iris, wipe, hold, match_cut` — a paper tear is a wipe, never a dissolve | `styles/paper-kpop/STYLE.md:66` | yes | yes |

### 2.4 Text and type

| Parameter | Value / rule | Source | Code | Transfer |
|---|---|---|---|---|
| Legibility floor | **2.6%** of the frame's short side = **28 px at 1080**; 26 px after any push | `CLI/lint-validate-inspect.md:53`, `HF/types/launch.md:20` | yes | yes |
| Pack floor | 14 px at **390 px** width (= 3.6% of 390) | `styles/paper-kpop/STYLE.md:50`, `scripts/type-audit.ts:42` | yes | yes |
| Title size | **4–9%** of frame height, 1–2 lines; quiet lines **2.5–4%**; hero words fill **60–90%** of width | `HF/motion.md:23` | yes | yes |
| Display translation | "modern" = display face at **9% of frame height, −2% tracking** | `HF/spec.md:35` | yes | yes |
| Words per line / slot | titles ≤6 words a line; explainer ~10; pack **8 per content slot**, 2 lines max in the lyric band | `HF/story.md:85`, `HF/types/explainer.md:23`, `styles/paper-kpop/STYLE.md:50` | yes | yes |
| Pack total word budget | `tokens.layout.maxWords`: **8** in paper-kpop, **18** in the template — a whole-film budget, not a per-slot cap | `styles/paper-kpop/tokens.json`, `styles/_template/tokens.json:104` | yes | yes |
| Caption grouping | 2–3 words high energy, 3–5 conversational, 4–6 calm; break at sentence end or a ≥150 ms pause | `HF/captions.md:19`, `MU/audio/references/captions/authoring.md:55–61` | yes | yes |
| Caption start | never at 0 s; start **0.1–0.3 s** in | `HF/captions.md:20` | yes | yes |
| Caption kill | every group ends with a hard `tl.set` after a 0.12 s `power2.in` fade | `HF/captions.md:21–26` | yes | yes |
| Caption fit | `fitTextFontSize`: maxWidth 1600 landscape / 900 portrait, base 78, minimum 42, step 2 | `HF/captions.md:32` | yes | yes |
| Caption placement | 80–120 px from bottom landscape; ~600–700 px portrait; inside the 80% title-safe box | `HF/captions.md:35` | yes | yes |
| Caption tone→style | hype 72–96 px, `back.out(1.7)`, 0.1–0.2 s; corporate 56–72 px `power3.out` 0.3 s; storytelling 44–56 px `power2.out` 0.5–0.6 s | `MU/audio/references/captions/authoring.md:47–53` | yes | yes |
| Contrast | WCAG AA **4.5:1** normal, **3:1** large (24 px+, or 19 px+ bold); every finding carries a suggested colour | `CLI/lint-validate-inspect.md:79` | yes | yes |
| Caption over footage | blend by background brightness: <60 `screen`, 60–180 `overlay`, >180 `normal` + opaque; scrim 30–40% sized to the text | `HF/captions.md:38` | yes | yes |
| Type behaviour | a landed title is dead still; motion moves to the next element, the camera or the world; no drift after landing | `HF/motion.md:15,26` | yes | yes |
| Title entrances (choose, don't repeat) | word blur 6→0 px in 0.13 s at 0.067 s apart; grey→ink 0.07–0.1 s; line blur 8→0 px in 0.13–0.2 s; per letter 0.1 s apart | `HF/motion.md:16–21` | yes | yes |
| Portrait type scale | landscape ×1.3; titles ×1.35; stats ×1.4; padding 40–64 px → 24–36 px | `HF/overlays.md:23` | yes | yes |
| Phone proof | 360 px sheet for reading; 390 px card frame for the style pack | `HF/review.md:28`, `prompts/blind-author.md:81` | yes | yes |
| Why fonts fail | only 19 bundled families resolve; any other needs `@font-face` to a shipped file | `HF/format.md:96–98` | yes | yes |

### 2.5 Motion, easing and physics

| Parameter | Value / rule | Source | Code | Transfer |
|---|---|---|---|---|
| Ease by role | arrival `expo.out`/`power4.out`; camera move or colour flood `power2.inOut`; zoom-through or exit `power3.in`; linear only for rotation, progress, constant speed | `HF/motion.md:10` | yes | yes |
| Ban the flat default | the same `power2.out` at 0.5 s on everything is what makes a film feel generated | `HF/motion.md:10` | partial | yes |
| Springs | damping 1.0 never bounces; **0.7–0.85 premium**; 0.4–0.6 playful; <0.3 cartoon; position/size may bounce, opacity/colour never | `HF/motion.md:11` | yes | yes |
| Exit vs entrance | exits are **40–50% shorter** than their entrances | `HF/motion.md:12` | yes | yes |
| Overlap | the next element starts when the previous is **30–50%** done | `HF/motion.md:12` | yes | yes |
| Stagger | letters **1 frame** apart; words **60–120 ms**; list items **40–80 ms** | `HF/motion.md:12` | yes | yes |
| Paper physics (pack) | squash **0.12**, overshoot **0.18**, anticipation **0.10**, boil **12 Hz** | `styles/paper-kpop/STYLE.md:66` | yes | yes |
| Paper native move | a snap is **one frame of anticipation and one frame of contact**; a sticker slam lands flat with no bounce | `styles/paper-kpop/STYLE.md:68` | yes | yes |
| Character animation budget | 2-frame anticipation, 3-frame overshoot, 4–8 frame hair/skirt/hand lag; 10 fps characters, 30 fps camera; no 24–36-frame idle | `docs/PRODUCTION-PLAN.md` step 5 | yes | yes |
| Motion blur | opt-in `data-motion-blur="on"`; shutter 360 is strong; off for HDR; 0 blur on a hold | `HF/motion.md:8`, `F-vizavi.md:310` | yes | partial — declare as effect, cap it |
| Blur honesty | exposure smear weakens on deceleration; sub-frame sampling is a means, not proof | `F-vizavi.md:94` | no | yes |
| Purity | no `Date.now`, no unseeded random, no network, no timers, no `repeat:-1`; seed with a PRNG (mulberry32); finite repeats | `HF/SKILL.md:23`, `HF/runtimes.md:10–11` | yes | yes — already 0023 |
| Boil is acting, not noise | redraw outlines ~12×/s with a jitter seeded by `floor(t*12)`; `jit` reseeded 12×/s | `HF/types/character.md:19`, `PD/ANIMATION_GUIDE.md:21` | yes | yes |
| Defaults that look generated | breathing/floating/pulsing loops on titles and UI; titles that keep sliding/scaling after landing; slow creeping scale late in a scene; bounce on UI; every scene entering the same way | `HF/motion.md:26`, `HF/story.md:99–101` | partial | yes |
| Shot phases | preparation → action → contact → reaction → decay, each with different mass and curve | `F-vizavi.md:90` | partial | yes |
| Accent budget | one main accent per shot; secondary layers coordinated, not equal; change phase/scale/depth/contrast, not volume | `F-vizavi.md:91` | partial | yes |

### 2.6 Composition and layout

| Parameter | Value / rule | Source | Code | Transfer |
|---|---|---|---|---|
| Hero fill | the hero of a shot fills **≥40%** of the frame's height or width; a small object in an empty frame is never a shot | `HF/spec.md:43`, `PD/STORYBOARD.md:28` | yes | yes |
| Safe areas | content inside the **90%** action-safe box; captions and key text inside **80%** title-safe | `HF/SKILL.md:41` | yes | yes |
| Pack margins | 6% top/left/right, **12% bottom**; central 88% safe | `styles/paper-kpop/STYLE.md:54` | yes | yes |
| Vertical platform bands | nothing in the top **168 px**; all words in **168–1330 px**; decoration only below 1330 px | `HF/types/vertical.md:7` | yes | yes |
| Poster test | one focal shape, negative space, type in the world (not a lower third) | `critics/designer.md` | no | yes |
| Silence ratio | declarative frames read **45–60% empty**; one dense exception | `PRESET/cobalt-grid/FRAME.md:123` | partial | yes |
| Grid translation | "clean" = 12 columns, 96 px margins, accent on one word per shot | `HF/spec.md:36` | yes | yes |
| First frame | never black, never a logo alone; frame 0 is the thumbnail and the hook | `HF/story.md:61`, `HF/types/vertical.md:11` | yes | yes |
| Card/PIP geometry | split 960/960; stack 14,14,1892×548; PIP 1432,28,460×258; lower third = bottom 30%; side panel = right 42% | `HF/overlays.md:7–22` | yes | partial |
| HUD discipline (pack) | one HUD per recipe, printed not floating; one graphic cluster per shot | `styles/paper-kpop/STYLE.md:23,58` | yes | yes |
| Banned compositions | everything centred; three cards in a row; KPI grid; logo docked in a corner; text over a dimmed screenshot | `HF/spec.md:57–62` | partial | yes |

### 2.7 Sound

| Parameter | Value / rule | Source | Code | Transfer |
|---|---|---|---|---|
| Loudness / peak | master **−14 LUFS ±1**, true peak **≤ −1 dBTP**; delivered file ≤ −1.5 dBTP | `critics/sound.md`, `docs/GATES.md` G6/G7 | yes | yes |
| SFX level | ~**0.35** volume in the layer; each hit **3–6 dB** over the bed | `MU/audio/references/sfx.md:44`, `HF/sound.md:37` | yes | yes |
| SFX sync | place a clip so its peak lands **one frame after** its picture | `HF/sound.md:36` | yes | yes |
| Music under voice | bed at **~0.14** volume; a duck lane to **0.3–0.4** while anyone speaks | `HF/sound.md:43`, `MU/mixing.md:68` | yes | yes |
| Cue anatomy | transient + body + tail; a band; a reverb send; a declared duck depth | `critics/sound.md` | yes | yes |
| Band rules | ≥50% of energy in the declared band; ≥60% at/above **200 Hz**; band top ≤**9 kHz**; HPF **75 Hz** | `docs/GATES.md` G6 | yes | yes |
| Silence | declared silence measured on the master **≤ −50 dBFS**; a reason on every quiet event | `docs/GATES.md` G6 | yes | yes |
| Tail | monotonic fade to **≤ −60 dBFS** | `docs/GATES.md` G6 | yes | yes |
| Repetition | no two cues of one kind overlapping or restarting within **0.3 s**; rotate 2–3 takes | `docs/GATES.md` G6, `HF/sound.md:38` | yes | yes |
| Hole | >**2.5 s** with no cue and no reason is an error | `docs/GATES.md` G6 | yes | yes |
| Music loop | library music arrives as 15–30 s loops: 0.4 s fade-in, 1.5 s fade-out; enter on the strongest bar | `HF/film.md:32` | yes | yes |
| Beat trust | trust beat times only on rhythmic stretches; the tracker invents double tempo on calm music | `HF/film.md:33` | yes | yes |
| Priority order | semantic event > text reading > voice > declared silence > mechanical beat | `F-vizavi.md:164` | partial | yes |
| Pack sound character | paper foley (snap, tear, slap, whoosh); music ducked ~4 dB; short bright reverb; silence allowed for a frame | `styles/paper-kpop/STYLE.md:72` | partial | yes |
| Cue kinds vs synth ban | HyperFrames: "no synthesised tones, chimes or dings"; Paper Studio generates all SFX in code | `HF/sound.md:39` vs `src/engine/sfx.ts` | n/a | **conflict, not a gap** |

### 2.8 Character and performance

| Parameter | Value / rule | Source | Code | Transfer |
|---|---|---|---|---|
| Rig is parameters over time | position, squash, arm angles, eye state, mouth state per moment; mood changes as keyed states eased between | `HF/types/character.md:18` | yes | yes |
| Never snap | a face never snaps between states: anticipation, squash, new face, settle | `HF/types/character.md:7`, `PD/ANIMATION_GUIDE.md:74` | yes | yes |
| Offset the parts | head leads, arms follow; vary the amounts; **never** move both arms, both eyes or a crowd in unison | `HF/types/character.md:9` | yes | yes |
| Contact | feet on the ground, props held by the hand, eyes on what they look at | `HF/types/character.md:10`, `critics/motion.md` | partial | yes |
| One read per action | lead the eye, play the action fast, let the meaning land slowly; hold the reaction | `HF/types/character.md:14` | partial | yes |
| Blink grammar | every **0.5–2.3 s**, 4 frames (half/shut/shut/half), plus one across every expression swap | `CAS/SKILL.md:128`, `CAS/reports/motion.md:122` | yes | yes |
| Reaction timing | picture lands **0–3 frames after** the measured word (repo); claude measures 0–3 frames *before* | `docs/decisions/0046`, `CAS/SKILL.md:53` | yes | yes — a style decision, not a law |
| Walk mechanics | bob 3–7% of height lowest at contact; lean 1–7°; step 9–12 frames; stance foot planted; stride tied to speed | `CAS/reports/motion.md:115–119` | yes | yes |
| Unison ban / extras | formations stand still while a crane or truck supplies the motion; background crowds frozen except on cue | `CAS/reports/motion.md:74,122` | yes | yes |
| Cast construction (repo) | ≤2 cast; **≥50%** of shots staged; 8 poses; 14 expressions; anchors face/hair/hand-left/hand-right/foot-left/foot-right; a body block | `tokens.identity.cast`, `src/engine/style-identity.ts` | yes | yes |
| Body checks (repo) | hand ≥**1.5×** its own thumb; not both elbows straight; seam gap 0; feet planted; contact shadow | `docs/decisions/0046`, `docs/GATES.md` G4 | yes | yes |
| Hero size in a chorus | the lead fills **~40% of frame height** | `PD/ANIMATION_GUIDE.md:76` | yes | yes |
| Character size guide | tiny u≈6–10, normal 16–22, hero 30–60 | `PD/ANIMATION_GUIDE.md:76` | yes | partial |
| No idle on titles | breathing/floating loops are banned on titles and UI; a character's idle breath is acting | `HF/motion.md:26` | partial | yes |

### 2.9 Palette, material and light

| Parameter | Value / rule | Source | Code | Transfer |
|---|---|---|---|---|
| Roles | 6 named roles; **≤4 colours in a frame**; a photograph counts as one colour | `styles/paper-kpop/STYLE.md:27,38` | yes | yes |
| Accent ration | one highlighted word, the payoff, the end card; the accent recurs **at least twice** a film, not every frame | `HF/story.md:93`, `styles/paper-kpop/STYLE.md:38` | partial | yes |
| Accent opacity | an accent at 5% disappears in compression; **15–25%** for atmosphere, full saturation for the focal element | `HF/look.md:52` | yes | yes |
| Day/night | a second paper stock and ink set, **not** a filter over day | `styles/paper-kpop/STYLE.md:38` | partial | yes |
| Surface numbers | paper fibre **18%**; halftone fixed angle; ink slightly out of register; visible cream cut lip | `styles/paper-kpop/STYLE.md:19` | partial | yes |
| Light | one key, hard paper shadow, one lit side, a source in frame; direction + softness + opacity | `docs/STYLE-IDENTITY.md:22`, `tokens.medium.light` | partial | yes |
| Light translation | "cinematic" = 35 mm framing, key upper-left, rim from behind, **6% vignette**; "premium" = satin paper **2% grain**, contact shadow **0.55** | `HF/spec.md:34,39` | yes | yes |
| Print screens | C/M/Y/K halftone at fixed **15/75/0/45°**, dot size 0.15–0.55; two-ink **15/75°** with a fixed registration offset; mono shape 0..4, spread 0.15–0.55 | `MU/media-treatment-recipes.md` (Editorial Halftone, Two-Ink, MonoScreen) | yes | yes |
| Global bands (repo) | Δ luma **±20**, contrast **±25**, saturation **±10**, edges **±5**, palette ≤**45** | `tokens.identity.bands` | yes | yes |
| Palette audit (repo) | forbidden hue band 70–170°, outlier share ≤**0.5%**; clipped share ≤**2%**; `SAT_MIN 0.3` | `scripts/palette-audit.ts:26–37` | yes | yes |
| Banned look | no black/navy void, no glow/bloom/particles, no purple gradients/glass cards, no cream-serif-mono-label default | `HF/spec.md:52–62` | partial | yes — mostly already refused |

### 2.10 QA and review thresholds

| Parameter | Value / rule | Source | Code | Transfer |
|---|---|---|---|---|
| Line unread | a ≥30 px line held under its floor: 0.4 s for 1–2 words, else ¾ of (0.5 + 0.3/word); last line 2 s | `CLI/lint-validate-inspect.md:51` | yes | yes |
| Text below floor | any text <**2.6%** of the short side held ≥0.5 s | `CLI/lint-validate-inspect.md:53` | yes | yes |
| Dead stretch | >**3 s** with nothing changing, final 3 s exempt | `CLI/lint-validate-inspect.md:52` | yes | yes |
| Empty first frame | frame 0 paints nothing but background, or something opaque covers every clip | `CLI/lint-validate-inspect.md:54` | yes | yes |
| Silent film | >**15 s** with no unmuted audio | `CLI/lint-validate-inspect.md:55` | yes | yes |
| Sweep static | a 3 s+ composition with no visible change **fails** the check | `CLI/lint-validate-inspect.md:59` | yes | yes |
| Motion assertions | `appearsBy(bySec)`, `before(a,b)`, `staysInFrame`, `keepsMoving(maxStaticSec 2 s)` — errors, not warnings | `CLI/lint-validate-inspect.md:99–106` | yes | yes |
| Contrast | WCAG AA on visible text sampled at 5 grid points, failures gate | `CLI/lint-validate-inspect.md:49` | yes | yes |
| Snapshot review | beats (start+0.3 s and middle), seams at ±0.1/0.2 s around every cut, phone sheet at **360 px** | `CLI/lint-validate-inspect.md:124` | yes | yes |
| Review method | describe each beat frame as a stranger; then read in order; then compare to SPEC; then name every default | `HF/review.md:16` | no | yes |
| Note format | `t=4.2s · where · problem → exact change · what stays`; P0/P1/P2 | `HF/review.md:32–36` | partial | yes |
| No score /10 (HyperFrames) | "Never score the film out of 10: a score finds nothing to fix" | `HF/review.md:38` | n/a | **conflicts** with the critic ritual; the repo's answer is the critic score + gate |
| Motion floor (repo) | per-shot median frame difference ≥**0.6**; a dead stretch is <0.1× the floor | `scripts/motion-audit.ts:76,119–123` | yes | yes |
| Type audit (repo) | every word inside the style's title-safe rectangle; floor from `type.scale.label` at 390 px | `scripts/type-audit.ts:11–42` | yes | yes |
| Frame audit (repo) | per shot, not per film; blank requires a frame at either end of the video's own range **and** uniform | `docs/decisions/0034` | yes | yes |
| Status honesty | five statuses: implemented · verified by run · visible in frames · verified in motion · listened; never upgraded | `F-vizavi.md:186` | partial | yes |
| Evidence hierarchy | contact sheet ≠ seam sequence ≠ full playback ≠ listening | `F-vizavi.md:184` | partial | yes |

### 2.11 The style-authoring contract (identity fields)

| Parameter | Value / rule | Source | Code | Transfer |
|---|---|---|---|---|
| Artifacts | 6 authored: `STYLE.md`, `tokens.json`, `capabilities.json`, `recipes/*.json`, `card.html`, `BRIEF.md` | `prompts/style-author.md:23`, `prompts/blind-author.md:34` | yes | yes |
| 27 decisions | D01–D27 map to a file and pointer; N/A allowed only for D10, D11, D15, max 3 | `docs/specs/0003` | yes | yes |
| Closed vocabularies | 8 primitives, 7 transitions, 8 effects, 7 camera moves, 6 easings, 7 asset types, 8 beat roles, 5 type roles, 5 physics, 11 slots | `docs/specs/0003:95–108` | yes | yes |
| Identity fields (`tokens.identity`) | `dimension`, `reference`, `bands{luma,contrast,saturation,edges,palette}`, `cast{max,stagedRatio,posesMin,expressionsMin,anchors[]}` | `styles/paper-kpop/tokens.json` | yes | yes |
| Signature | exactly three lines: **Shot**, **Transition** (must name an allowed token), **Texture**; each says what it refuses | `docs/STYLE-AUTHORING.md:147–158` | yes | yes |
| Refusals / not-for | ≥5 concrete bans; ≥3 formats or occasions it is wrong for | `docs/specs/0003` D17/D18 | yes | yes |
| Card | 11 sections in order (`hero, legend, visuals, palette, type, motion, sound, rules, fit, proof, signoff`), `data-section` each | `prompts/blind-author.md:69–73` | yes | yes |
| Card above the fold | hero specimen, promise, feels/never-feels visible without scrolling at **900×700 CSS px** | `prompts/blind-author.md:76–79` | partial | yes |
| Card motion specimen | CSS-only loop: **5.6 s held spread**, **1.6 s page turn**, **7.2 s loop** | `prompts/blind-author.md:80–82` | yes | yes |
| Card phone frame | exactly **390 CSS px** wide | `prompts/blind-author.md:81` | yes | yes |
| Card evidence labels | ≥1 `REFERENCE`, ≥1 `SPECIMEN`, ≥1 `ANTI`; never `OUTPUT`; reference may be "described, not reproduced" | `prompts/blind-author.md:83–86` | yes | yes |
| Card sign-off | `UNSIGNED` until the director runs approve; `data-status` markers; footer says "Waiting for the director's eyes" | `prompts/blind-author.md:87–95` | yes | yes |
| Reserved choices | `governance.choices[]` with `question/options/where`, no answer, no resolved; approval refuses until answered | `docs/STYLE-AUTHORING.md:167–168` | yes | yes |
| Answered choices | `governance.decisions[]` with `answer`, `reason`, `decidedBy`, `decidedAt` | `prompts/blind-author.md:55–57` | yes | yes |
| Brief | frozen, hashed; 12 plain-language questions; a question is never answered by guessing | `docs/STYLE-AUTHORING.md:75–143` | yes | yes |
| Content-free rule | no real name, date, venue or family detail in `tokens.json` or `recipes/*.json` | `prompts/blind-author.md:46` | yes | yes |
| Engine-free rule | says "slow page turn", not `easeOut cubic-bezier`; catches `Three.js`, `p5.brush` | `docs/STYLE-AUTHORING.md:171,229` | yes | yes |
| Status ladder | DRAFT → REVIEWABLE → APPROVED; approval binds `packHash`; any later change reopens | `docs/specs/0003:232–238` | yes | yes |
| Proof / evidence | `capabilities.proof`: status `declared`, frames, aspects, metrics; `evidence.sources`: ≥3, take/not-take/rights | `docs/specs/0003` D24/D25 | yes | yes |
| Seed policy | seeded list + fixed list + `jitterHz` (0.5) | `tokens.seed` | yes | yes |

---

## 3. Acceptance criteria for a 9/10 identity

### 3.1 The critics' contract (all seven)

- Each returns **score /10**, blocking issues tied to a timestamp/shot/file/frame,
  **one required fix** if not signed, and **SIGN yes/no** (`critics/README.md`).
- A critic **may not pass** a film with a known broken frame, a missing cue, an
  unlicensed track, or a claim the evidence does not support.
- The film-level bar: **no criterion below 8, mean at least 9, a written reason
  per score**, then the director signs (`docs/PRODUCTION-PLAN.md`, Gate 7).

### 3.2 What each critic demands of *identity* specifically

| Critic | A 9/10 identity requires |
|---|---|
| Designer / DOP | Every frame reads as **layered paper**: cut edge, contact shadow, one key light, no soft bloom fighting a hard shadow. A **poster** composition: one focal shape, negative space, type *in* the world. **≤4 palette roles, one accent, one signature move.** Cast unbroken at **1920 and 390 px**. Nothing cheap: no floating prop, mirrored badge, clipped hand, caption over a face. Red lines: flat stage with no depth pass; soft shadow where the style is a hard cut; type outside safe or over a face. |
| Motion director | **Every shot has a character action**, not camera or hair only. Feet planted, knees bent, weight shifted, support ankle locked. Anticipation + overshoot + follow-through, **≥2 breakdowns per transition**. No undeclared hold **>0.4 s**, no shot below the motion floor. Two complementary silhouettes and a shared eyeline. Red lines: a pose swap passed off as animation; camera move as the only motion; floating feet. |
| Editor | Every cut on its cue; every shot earns its duration; **median shot length inside the style envelope** (not a fixed count); transitions native to the medium, never a forbidden dissolve; captions hold for read time inside the safe area; the film works **sound off and again sound on**. Red lines: cut off its frame; dead hold with no event; unreadable caption. |
| Architect | Exactly **one authored score**; no shot id, palette, font or recipe id in `src/`; audio/asset/pose/caption contracts resolved before render; **a second film reuses the contracts without editing engine code**. |
| Senior developer | `typecheck` + `test` pass; **two renders identical on every frame**; rig seam gap **0**, hands at wrists, boots at ankles; fonts loaded before frame 1; every input pinned by hash; artifacts regenerated from the final render. |
| Sound | Every cue has **layers, a band, a reverb send, a duck depth**; SFX duck under narration in **1–4 kHz** without pumping; master **−14 LUFS ±1 / ≤ −1 dBTP**; the designed silence is silent; **ASR of the mixed master** matches; no unlicensed track. |
| QA / UAT | Every gate has a **command, an artifact and a pass condition**; cues on frame, captions readable, audio present, assets hashed, cast libraries valid; **all frames** checked for blank/black, clipping, palette, type and rig seam; two renders match; the delivered MP4/SRT hash is the one audited; every README claim traces to a file or command. Red lines: a warning treated as a pass; a stale snapshot; "looks good" with no command. |

### 3.3 The prompts' bar

**`prompts/style-author.md`** — the pack is acceptable when:
1. all twelve brief questions answered, brief frozen before scaffolding;
2. six artifacts filled, no placeholders, no real names/dates in tokens/recipes;
3. `style:check` prints **REVIEWABLE**, zero `BEFORE YOU APPROVE` items;
4. every `YOU MUST CHOOSE` either answered by the director or left open in
   `governance.choices` when the brief reserves it;
5. the director has opened the card and judged the **hero**, the **390 px phone
   frame** and the **ANTI**;
6. approval is the director's alone — the author never runs `style:approve`.

**`prompts/blind-author.md`** — the pack is acceptable when:
1. six artifacts, closed vocabularies only, text ops use slots only;
2. card has all **11 sections in order**, hero above the fold at **900×700**,
   motion loop **5.6 / 1.6 / 7.2 s**, phone frame **390 px**, REFERENCE +
   SPECIMEN + ANTI, no `OUTPUT`, `UNSIGNED` sign-off, status `REVIEWABLE`;
3. validator exits **0**, zero hard failures, every brief-reserved choice still
   open;
4. every gap bridged is logged as `Q/A` in `STYLE.md ## Questions`;
5. the author names the one thing they are least sure the director will accept.

### 3.4 The repo's own identity gate (what is enforced today)

`npm run style:identity -- <score>` (`src/engine/style-identity.ts`):

| Axis | Pass condition | Source |
|---|---|---|
| Cast declared | ≥1 cast member, ≤**2** | `tokens.identity.cast.max` |
| Construction | every anchor present (`face, hair, hand-left, hand-right, foot-left, foot-right`), a body block, ≥**8** poses, ≥**14** expressions, no library error | `0048`, `0046` |
| Staging | **≥50%** of shots stage a performer | `0052` |
| Luma | absolute delta ≤ **20** | `tokens.identity.bands` |
| Contrast | absolute delta ≤ **25** | same |
| Saturation | absolute delta ≤ **10** | same |
| Edges | absolute delta ≤ **5** | same |
| Palette | distance ≤ **45** | same |
| Tie to the picture | `render:film` refuses without it; `film:review --video` re-runs it; `gate:7` has a `styleIdentity` row tied to the frozen video hash | `0052` |

Measured precedent: *The Uber Cut* — 9/10 staged, Δ luma −1.0, Δ saturation
−4.1, palette 43.0, `gate:7` PASS 24 checks.

### 3.5 HyperFrames' review bar (the part the repo has not adopted)

Measure, then look; trust the numbers where they disagree with the eye; describe
each beat frame as a stranger would (an object you have to explain is a P0); name
every default the frames show; then seven questions — does it read as what it
is, does the subject separate, framing and contact, timing as a first-time
viewer, tells, the pictures alone, the phone sheet at **360 px**. Notes are one
line, ranked P0/P1/P2, and **the film is never scored out of 10**.

### 3.6 The synthesised 9/10 identity bar — ten conditions

A film is 9/10 *as this channel* when all ten hold. Each condition names the
source that would fail it.

1. **Recognisable with the sound off.** Cast construction, paper material,
   palette family, light, type, composition/camera grammar and cut rhythm all
   match the pack — the *story* changes, the grammar does not (`STYLE-IDENTITY.md`).
2. **A performer in at least half the shots**, built to the anchors, poses and
   expressions, unbroken at 1920 and 390 px (`0052`, `critics/designer.md`).
3. **Every shot moves with a character action**, ≥2 breakdowns per transition, no
   undeclared hold >0.4 s, no shot below the motion floor (`critics/motion.md`).
4. **Every cut on its cue, median inside the envelope**, transitions native, and
   the film readable with the sound off (`critics/editor.md`).
5. **Measured inside the bands** (luma/contrast/saturation/edges/palette) on the
   *delivered* picture, not a still (`0052`, `tokens.identity.bands`).
6. **Type inside the safe area at the floor**, one focal shape, ≤4 roles and one
   rationed accent (`critics/designer.md`, `scripts/type-audit.ts`).
7. **Nothing invented**: every name, number, date and claim traces to the brief
   (`AGENTS.md` rule 3, `critics/architect.md`).
8. **Sound designed and measured**, not assembled: layers, band, duck, silence,
   −14 LUFS / ≤−1.5 dBTP on the file (`critics/sound.md`, `docs/GATES.md` G6/G7).
9. **Every claim has a command and a hash**: two renders identical, the audited
   MP4 is the delivered MP4 (`critics/qa.md`, `critics/developer.md`).
10. **A human signed it after looking**, with the weakest shot named
    (`prompts/style-author.md` step 7, `critics/README.md`).

---

## 4. Gap list vs Paper Studio

What the pack and the identity gate do **not** define today, ranked by how much
it would change the next film. "Source" is where the missing number already
exists.

### P0 — identity-defining, absent, cheap to encode

| # | Gap | What the skills give | Source | Proposed field |
|---|---|---|---|---|
| 1 | **Easing has no role binding.** `tokens.motion.easings` is a flat allowed list; nothing says arrivals land on a long tail, cameras ease both ways, exits accelerate. | `expo.out`/`power4.out` arrival; `power2.inOut` camera/flood; `power3.in` exit; linear only rotation/progress | `HF/motion.md:10` | `motion.easeByRole {enter, move, exit, camera}` |
| 2 | **No exit/overlap/stagger numbers.** The pack has squash/overshoot/anticipation but not how long an exit is, how much moves overlap, or how words stagger. | exits **40–50%** shorter; overlap **30–50%**; letters 1 frame, words 60–120 ms, lists 40–80 ms | `HF/motion.md:12` | `motion.timing.exitRatio 0.5`, `overlapMin/Max`, `stagger {letter, word, item}` |
| 3 | **Transitions are names, not durations.** `cut, iris, wipe, hold, match_cut` with no time and no budget. | 3–5 kinds/film; ≤1/3 beat seams hard; iris 0.15 s, wipe 0.13–0.3 s, flood 0.4 s, object→world 0.65 s, dip 3 frames | `HF/motion.md:30–42` | `motion.transitions[] {kind, seconds}` + `transitionKindsMin/Max`, `hardCutShareMax` |
| 4 | **No reading-time or contrast rule in code.** The plan's `readcheck` (≤8 words, ≤2 lines, hold ≥ max(1.8 s, speech+0.6 s), contrast passes) has no command; the type audit checks geometry only. | 0.5 + 0.3/word; last ≥2 s; 1–2 words 0.4 s; WCAG 4.5:1 / 3:1 | `HF/motion.md:22`, `CLI/lint-validate-inspect.md:51,79`, `docs/PRODUCTION-PLAN.md` G7 | `readcheck` script + `tokens.type.reading {baseSec, perWordSec, lastLineMinSec}` |
| 5 | **Motion is measured, not asserted.** `audit:motion` proves a floor; nothing declares per-shot intent. | `appearsBy`, `before`, `staysInFrame`, `keepsMoving(maxStaticSec 2 s)` | `CLI/lint-validate-inspect.md:99–106` | per-shot `motion.assert[]` checked by `probe:motion` |
| 6 | **No first-frame / thumbnail rule on the picture.** Preflight checks that narration speaks within 1 s; nothing checks what frame 0 paints. | frame 0 is the thumbnail: never black, never a logo alone | `CLI/lint-validate-inspect.md:54`, `HF/story.md:61` | `frames.firstFrame {text:true, coverageMin}` |
| 7 | **No hero-fill or one-hero-move rule.** | hero ≥**40%** of height or width; one hero move; secondary 50–70% travel, 100–200 ms later | `HF/spec.md:43–44` | `layout.heroFillMin 0.40`, `motion.secondary {travel, delayMs}` |
| 8 | **Camera seams are not checked.** `camera:check` checks move, travel, direction sign, variety — not the seam. | position, direction, screen speed, acceleration at every cut; cut-at-rest ≤50% | `HF/motion.md:14,93`, `F-vizavi.md:301` | `camera.seam {maxSpeedJump, maxAccelJump, maxDirectionTurnDeg}, cutAtRestShareMax` |
| 9 | **No parallax plane ratios.** `medium.layerOrder` names layers; nothing says how far each travels. | 3 planes, **1.0 / 0.6 / 0.3**; depth = scale + relative motion + overlap + perspective | `F-vizavi.md:68,304–306` | `medium.planes {min:3, parallax:{fg,mg,bg}}` |
| 10 | **The accent has no ration.** Palette audit checks a forbidden hue band and clipping, not how often the accent appears. | one word / the payoff / the end card; **≥2× per film**, not every frame; 15–25% atmosphere | `HF/story.md:93`, `HF/look.md:52` | `color.accent {roles[], perFrameMax 1, perFilmMin 2}` |
| 11 | **No platform bands for 9:16.** The pack has a 14% lyric band and a 12% bottom margin, but not where an app draws. | top **168 px** empty; words 168–1330; decoration below 1330 | `HF/types/vertical.md:7` | `layout.platformBands.9:16` |
| 12 | **Style measurement is global.** It cannot say where the ink is, which way light falls, or how long a shot is. The reference is measured on five global means only. | measure the reference's **grammar**: shot lengths, title in/out, transition kinds, palette roles, type scale/weight — "grammar, never content" | `HF/look.md:23`, `CAS/STYLE_BIBLE.md`, `CAS/reports/motion.md` | `style:measure --grammar` (shot lengths, cut rate, title size %, palette roles) |

### P1 — sharpens the channel, needs a decision

| # | Gap | What the skills give | Source |
|---|---|---|---|
| 13 | **Character acting grammar is not encoded**: no blink cadence, no "never move both arms/eyes/crowd", no eye-contact rule. | blinks **0.5–2.3 s**, 4 frames, one per expression swap; offset parts; contact sells it; extras frozen except on cue | `CAS/reports/motion.md:122`, `HF/types/character.md:9–10` |
| 14 | **No `maxShot` or median-band in tokens.** "Median 2.5–3 s" lives in prose only. | music 1.4–4 s; average 1.8–3 s; pack ceiling 5.5 s | `HF/types/music.md:14`, `docs/STYLE-IDENTITY.md:26` |
| 15 | **No light numbers beyond direction/softness/opacity**: no shadow offset/blur, no grain %, no vignette %. | "premium" = 2% grain, contact shadow 0.55; "cinematic" = 6% vignette, key upper-left, rim behind | `HF/spec.md:34,39` |
| 16 | **No per-line or per-slot word cap.** `layout.maxWords` is a whole-film budget (8 in paper-kpop, 18 in the template), so a validator cannot catch one 12-word slot; the "8 per content slot" rule is prose only. | titles ≤6 words/line; explainer ~10; pack 8 | `HF/story.md:85`, `styles/paper-kpop/STYLE.md:50` |
| 17 | **The template is looser than the pack** — a new style scaffolded from `_template` starts with 18 words where the pilot uses 8, with no rule saying why. | — | `styles/_template/tokens.json:104` |
| 18 | **Motion blur is undefined.** The pack refuses softness but has no blur budget for a fast move. | blur only on deliberate fast travel, capped, **0 on holds and on type**; declare as effect, not optics | `HF/motion.md:8`, `F-vizavi.md:310` |
| 19 | **No treatment-expiry rule.** | any single treatment goes stale after ~6 s | `HF/film.md:35` |
| 20 | **No music-loop or hit-offset rule** (music is parked). | loops 15–30 s, 0.4 s in / 1.5 s out; move starts 40–190 ms early; reaction 0–45 ms after | `HF/film.md:32,34` |
| 21 | **Sound has no bed-level or hit-over-bed rule**, only the master and cue checks. | bed under voice 0.14; hits 3–6 dB over bed; SFX peak 1 frame after picture | `HF/sound.md:36–43` |
| 22 | **The card's motion specimen is only in the blind prompt.** A director-run pack has no measurable motion card. | 5.6 s held spread / 1.6 s page turn / 7.2 s loop; 900×700; 390 px | `prompts/blind-author.md:76–82` |
| 23 | **No "reference is grammar, not content" rule** in `style:measure`. | A reference gives shot lengths, title behaviour, transitions, palette roles, type scale — never its content | `HF/look.md:23` |
| 24 | **No status-honesty vocabulary** for reports. | implemented / verified-by-run / visible-in-frames / verified-in-motion / **listened**; never upgraded | `F-vizavi.md:186` |

### P2 — worth knowing, not blocking

| # | Gap | What the skills give | Source |
|---|---|---|---|
| 25 | No "describe the frame as a stranger" step in `film:review`. | an object you must explain is a P0 | `HF/review.md:16` |
| 26 | No "pictures alone tell the story" check separate from ASR. | cover the words; do the frames still tell it | `HF/review.md:27` |
| 27 | No empty-film / silent-film guard on the delivered file. | `film_silent` >15 s; `first_frame_empty` | `CLI/lint-validate-inspect.md:54–55` |
| 28 | No density target (silence ratio). | declarative frames **45–60%** empty | `PRESET/cobalt-grid/FRAME.md:123` |
| 29 | No end-card rule (length, lockup width, CTA hold). | last 5–10%; lockup 15–30% width; CTA held 1.5–3 s | `HF/types/launch.md:37` |
| 30 | No caption blend/scrim rule for text over a busy plate. | brightness → `screen`/`overlay`/`normal`; scrim 30–40% | `HF/captions.md:38` |

---

## 5. Conflicts — do not import these

| Import | Why it must not land | Source |
|---|---|---|
| **Real optics**: 35 mm, FOV, focus pull, DOF, roll | A cut-paper collage is photographed flat; a focus pull is physically absent. Rename the axis (`scale`, `translate`, `rotate`, `layerSharpness`). | `HF/spec.md:39`, `F-vizavi.md:254` |
| **60 fps / 2K delivery** | Format owns fps; the pack is 30 fps. 60 doubles render time for no identity gain. | `F-vizavi.md:258`, `HF/SKILL.md:14` |
| **Generative images/video, network fetch in render** | Banned by `AGENTS.md`; HyperFrames' media path is retrieval, not generation. | `AGENTS.md` rule 1, `MU/audio/references/sfx.md:8` |
| **Synth-tone ban** | HyperFrames says "no synthesised tones, chimes or dings"; Paper Studio's whole sound identity is code-generated SFX. Keep the repo's rule; take only the **level and sync** numbers. | `HF/sound.md:39` vs `src/engine/sfx.ts` |
| **"Never score out of 10"** | HyperFrames' review discipline, but the repo's gate is built on critic scores. Keep the P0/P1/P2 note shape; keep the score. | `HF/review.md:38` vs `critics/README.md` |
| **The three-cards/PIP/overlay geometry** | It belongs to talking-head footage. Take the numbers only if a film shows a screen. | `HF/overlays.md`, `F-vizavi.md:263` |
| **Global look presets** (13 `FRAME.md`) | Slide-deck looks; banned as a fallback for a film. Use them as a **schema**, never as a look. | `HF/look.md:27` |
| **12 Hz line boil as a default** | Paper boils at 12 Hz; a world line or UI label must not. Applies to paper surfaces and character linework only. | `HF/types/character.md:19` |

---

## 6. What this document adds beyond A–F

- **`F-vizavi.md`** established that Vizavi gives invariants and refusals, not
  magnitudes. This document supplies the magnitudes from a different source:
  HyperFrames' measured craft manual (moves, eases, transitions, captions,
  sound) and PDoomVideo's working animation API.
- **New here, not in A–F**: the print-treatment parameter ranges (halftone
  C/M/Y/K angles 15/75/0/45°, dot size 0.15–0.55, two-ink registration, mono
  screen shape/spread, crosshatch spacing); the
  beat-share and word-rate pacing bands; the six craft floors
  (`line_unread`, `dead_stretch`, `text_below_floor`, `first_frame_empty`,
  `film_silent`, `sweep_static`) and the four motion assertions
  (`appearsBy`, `before`, `staysInFrame`, `keepsMoving`); the caption fit and
  placement numbers; the card's motion-specimen constants; the five-status
  honesty vocabulary; and the per-axis "measure the reference's grammar" method
  that the global bands in `tokens.identity` cannot express.
- **Cross-check result**: claude-animated-shorts corroborates the *method*
  (measure a reference channel on seven axes, then compare own frames in the same
  units) and supplies measured identity numbers for format, voice rate,
  loudness, caption behaviour, colour statistics, cut rate and camera hold
  share. Its own camera grammar ("ease-out bursts") was later **disproved by its
  own measurement** — a useful warning that a style bible is a hypothesis until
  measured (`CAS/reports/motion.md:11–17`).

---

## 7. One-line answer

The local skills do not contain a better definition of Paper K-pop than
`STYLE-IDENTITY.md` does — they contain the **numbers that definition is missing**:
ease-by-role, exit/overlap/stagger ratios, transition durations and budgets, a
reading-time and contrast floor, seam continuity, plane parallax, accent ration,
platform bands, first-frame and dead-stretch guards, and a per-axis way to
measure a reference's *grammar* instead of its average brightness. Twelve of
those are P0, code-encodable, and already spelled out to the decimal in
HyperFrames `motion.md`, `spec.md`, `captions.md` and the CLI craft floors.
