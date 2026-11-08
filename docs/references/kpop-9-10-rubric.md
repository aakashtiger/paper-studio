# The KPOP 9/10 rubric — short film first

**Date:** 6 Nov 2026

> **The shot band is superseded (8 Nov 2026, decision 0065).** Shot length, shot
> count and aspect belong to the **system**: `kpop-shot-policy.md` is the one page
> that decides them and `npm run shot:policy` is the command that checks them. The
> band numbers in this rubric (rows 2 and 8, and the short target below) are the
> gate that existed when it was written; a new film is cut to the policy and
> declares `"policy": "system"`. The films already passed under this rubric keep
> their pass, tied to the gate they were made for.
**Target:** a 25–30 s film, 9–11 shots, that scores **9/10 or better** on the
same gate a 60 s film must pass. A 60 s film is not allowed until this is real.

The score is ten checks. Each check is **10/10 if it passes, 0 if it fails**.
The overall is the number of passes:

- **10/10** — all checks pass.
- **9/10** — nine checks pass; one may be below 8.5 but must be named.
- **8/10 or lower** — not shippable.

The gate is not a substitute for the user's judgment. It is the set of failures
we already know how to detect, so they cannot be shipped again.

| # | check | evidence | pass rule |
|---|---|---|---|
| 1 | **Sync** | `scripts/sync-check.mjs` | every content word has a picture event within 0.2 s; every shot has cast, prop/light/set/crowd and camera events; gaps ≤1.3 s; shot band and narration band hold |
| 2 | **Motion** | `scripts/motion-check.mjs` + `frame-diff.json` | no run >12 frames (0.4 s) under 1.0; ≤5% frozen; ≤50% quiet; shot band and median hold |
| 3 | **Determinism** | `twin.json` | 9 frames painted by 1 worker and by 4 workers hash the same; two fresh renders of a named frame hash the same |
| 4 | **Rig** | `rig.json` + source check | idol hip −315, Mira hip −281, mirrored boots/sneakers, `armL + / armR −`, no petals/halo, hand/thumb at the wrist, foot targets and contact shadows; no arm crosses a face in the reviewed sheets |
| 5 | **Performance** | `measured.json` (recorded by the paint path) | every shot: ≥3 distinct poses (five samples, 0.2 rad buckets); ≥2 pose changes; ≥1 gesture (hand travel >28 px / 0.16 s); ≥2 distinct faces; longest still ≤1.2 s; no T-pose (both arms near horizontal, elbows <0.35 rad); lead face ≥90 px, unless an audience POV, or the shot declares `performance: "macro"` and no rig is drawn (0064). A declared macro is still held to the motion row. |
| 6 | **Set variety** | `film.json` | ≥7 distinct set states in 9 shots; no set repeated more than 2 consecutive shots; ≥6 layers and ≥3 props per shot; a foreground occluder or audience POV; a light source |
| 7 | **Type** | `film.json` + reviewed sheets | every shot has hero + label + subtitle + HUD; no type over a face; 60 px face / 40 px hand margins; the hero is fully visible ≥0.5 s; subtitles use measured words |
| 8 | **Edit** | `film.json` + `shots.json` | shot band 1.0–4.5 s, median 2.5–3.0; a camera event in every shot; ≥3 camera-move types; ≥2 cut-transition types; set variety; no constant 2/3/4 s grid |
| 9 | **Sound** | `sound.json` + delivered audio | narration continuous, no internal silence >0.2 s; ≥10 SFX cues bound to sync events; −14 ±1 LUFS; true peak −1.5 ±0.5 dBTP; no cue in the voice band. Music is a separate 10/10 gap for a song film, not a 9/10 requirement for a narrated short. |
| 10 | **Look** | `look.json` | luma, saturation and edge density inside the film's declared **mood band**, calibrated to the gold standard's act in the same mood; palette families 3–5; top family ≥60%. A night short is not compared to the gold's bright chorus. |

## The 9/10 short target

- 25–30 s, 9–11 shots, median 2.5–3.0 s.
- **9 distinct set states** (stage night, audience POV, backstage, dressing,
  handoff close-up, stage reveal, stage front, cue booth, finale).
- 2–3 leads + backups + crowd; 3+ props in every shot; 6+ layers.
- 10+ SFX cues; narration 180–190 wpm, continuous.
- 10/10 or 9/10 on the gate; every failing check named.

## Result on *The Cue Lamp* (v3.4)

**Gate: 10/10. Self-score: 10/10.** The short is 25 s, 9 shots, 9 built worlds,
74 words at 183 wpm, 22 SFX cues, −14.2 LUFS / −1.6 dBTP, deterministic. The
performance row is measured from the paint path: 3–5 poses, 2–4 changes,
1–5 gestures, 108–186 px faces, longest still 1.13 s, no T-pose. The look is
80.15 luma / 21.95 sat / 4.75 edges against the gold's night act 79.79 / 18.68 /
4.55. The star fan is the finale and a distant backdrop in s6, not the set of
four shots. The cast is a paper cutout by design: continuous bent limbs, mitten
hands, a V-neck shirt under an open jacket, fold lines and a shoulder cap.

## Commands

```bash
node scripts/sync-check.mjs
node scripts/motion-check.mjs
node scripts/twin-check.mjs
node scripts/make-sfx.mjs
node scripts/look-check.mjs
node scripts/quality-check.mjs
```

`quality-check` prints the ten rows and the score. It exits 1 below 9/10.
