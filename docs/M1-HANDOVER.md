# Handover — M1, the KPOP pack

**For:** the next agent (Claude Code / Codex). You have no history with this repo.
**Date:** 8 Nov 2026 · **Branch:** `main` · **State:** clean tree at the commit named below.

Read this page first. It is 10 minutes and it will save you a day. Then read the
four files in §1 — they are the law. Do not re-derive anything in §2.

---

## 0. Where we are, in five lines

1. **M0 is parked, not failed.** The 60 s Paper Crime film passes every automated
   gate at 10/10 and was still refused by two fresh critics at 5/10. It is kept as a
   **system proof, not a deliverable**. Its source is in
   `sources/m0/proofs/kpop-crime-60` (the renders are not); its fix list and the state
   at park are in that folder's `FIXLIST.md` under *STATE AT PARK*. **Do not resume it.**
2. **The next milestone is M1**: make the KPOP pack able to produce a 10/10 film
   **the first time**, by a different person, with different characters, props, sets
   and colours, in a known number of hours.
3. The gold standard is **`claude-pop.mp4`**, 156.63 s, 4,698 frames, pinned
   `sha256:fb85200bc531...`. It is the only look reference. Same Alarm and Understudy
   are rig/contract references, **not** look references. It is **not in git** — it is
   a release asset, and §1b says how to get it on a machine that is not the one it
   was made on.
4. The pack is **`styles/paper-kpop`** at 0.2.0, reviewable, unsealed.
5. **One style at a time.** KPOP is finished (M1 → M2 → M3) before CPOP (M4) or
   Paper Crime as a style (M5).

## 1. Read these, in this order

| # | File | What it settles |
|---|---|---|
| 1 | `AGENTS.md` | the non-negotiables, ownership, commands, definition of done |
| 2 | `docs/references/kpop-m1-plan.md` | M1's work packages K0–K7 and what has already shipped |
| 3 | `docs/references/kpop-shot-policy.md` | the one shot-length/count/duration policy |
| 4 | `docs/references/kpop-variety-policy.md` | the variety floors, as numbers a command can check |
| 5 | `docs/references/kpop-gold-standard.md`, `kpop-units.md` | the gold's numbers, and what a unit means |

Also useful: `docs/decisions/0063`–`0065` (performance is measured; macro; shot
length belongs to the system).

## 1b. Getting the reference on a machine that is not this one

Everything that fits in git is in git: `gate/gold/` carries the pin, the 54-shot
map, **one still per shot** (`stills/s01...s54.jpg`), the per-shot palettes, the
scene stats, two contact sheets and the 25 s look-proof proxy. **A clone can
study the look without downloading the film.**

The film itself is 276 MB, so it lives as a release asset on the same repo:

```
gh release download gold-2026-11-08 --repo aakashtiger/paper-studio -D ./refs
certutil -hashfile refs/claude-pop.mp4 SHA256     # must be fb85200bc531...
```

The repo is **private**, so `gh` must be authenticated (`gh auth status`). If the
hash differs, the file is a different cut: stop, do not re-pin. Downloading is only
needed to re-derive a number or to watch the film move — `npm run gold:stills --
--ref <film> --verify` regenerates the stills from it and refuses a wrong hash.

If you are asked how to study it frame by frame:

```
ffmpeg -ss 22.72 -i claude-pop.mp4 -frames:v 1 frame.png
ffmpeg -ss 22.72 -t 10 -i claude-pop.mp4 -vf fps=2 f_%04d.png
```

Sampling at each shot's midpoint in `gold-authored-shots.json` reproduces the 54
committed stills exactly. The assets imported from the machine the gold was made on
— its two generations of source, its fonts, its words, the analysis that reads each
axis of the look, and the M0 toolchain — are in `sources/`, whose README gives a
reading order.

## 2. Decided — do not re-litigate

**The split.** *System* owns pixels, fps, duration range, shot policy, gate
machinery and the factory. *Style* is a sealed versioned pack: law + vocabulary +
envelope + signature + evidence. *Film* is one set of choices inside the envelope
plus one story.

| Axis | Decision |
|---|---|
| Aspect / resolution | 16:9 = 1920×1080, 9:16 = 1080×1920; **re-stage, never crop** |
| Frame rate | 30 fps |
| Duration | 30 s to 1 h, chosen by the user later |
| Shot count | `round(duration / median)`, ±10% |
| Shot policy | < 3 min: **1.2 / 3.0 / 5.5 s**; ≥ 3 min: **3.0 / 5.0 / 7.0 s**, with distribution guards |
| Gate | Pack (P), Film 10/10 (F), Gold delta (G), Critic (C), Blind (B) |
| Ship | 10/10 is necessary, **not sufficient**; two fresh critics must both say GO |

**Never.** `Date.now()`, unseeded `Math.random`, network or played timelines in the
paint path. Invented facts — names, dates, venues, numbers come from the brief or
they are a warning. A palette, font or shot id hardcoded in engine code.

## 3. Verified state — what actually exists (8 Nov 2026)

Run these yourself; they are cheap and they are the truth.

```
npm run typecheck                 # clean
npm test                          # 569 tests pass
npm run shot:policy -- proofs/kpop-crime-60/film.json   # 1 finding (median 2.66 vs 3.0 ±0.3), correct
npm run critics:check -- proofs/kpop-crime-60           # fails only on critic:no-go, correct
npm run recipes:list              # 60 recipes, in plain words
npm run recipes:check             # ← NEW, and it fails: 40 of 60 have no painter
```

**Built and working:** `src/engine/shot-policy.ts` (the policy in code, 12 tests),
`scripts/shot-policy.ts`, `scripts/film-chain.mjs` (`npm run film:factory`, with
`--plan`, `--ship`, `chain.json`, and the policy row **before** the paint),
`src/engine/critics.ts` + `scripts/critics-check.ts` (the SHIP rule, 18 tests),
`critics/kpop-{picture,story,critics}.md` (the two prompts).

**Not built, and named in the plan:** `style:law` (K0.7), `variety:check` (K2.8),
the duration resolver's fixtures (K3.3–3.4), the ported 25 s proof (K1.4), the
seal (K7), the 9:16 maps, and two painters.

**The gold's evidence is in `gate/gold/`** — `GOLD.json` (the pin: hash, container,
look, edit, variety), the 54-shot authored map, per-shot palettes, scene stats,
`REPORT.md` and two contact sheets. The MP4 itself (276 MB) is deliberately outside
the repo; `gate/gold/README.md` says how to re-derive from it, and that a different
hash means **stop**, not refresh. Never re-pin the gold to make a number pass.

**The remote exists but nothing is pushed.** `origin` is
`github.com/aakashtiger/paper-studio`; `main` is 89 commits ahead of `origin/main`.
So a fresh clone does not have today's work. Either push, or work in this working
copy — say which one you did before you start.

**Two toolchains, deliberately.** The M0 film was painted by
`Y:\NewVideoTest\proofs\kpop-crime-60` with the gate in `Y:\NewVideoTest\scripts`;
the product engine is this repo. `Y:\NewVideoTest` is **not** a git repo. The
factory is one entry point over the toolchain that exists — do not silently
unify them in this milestone.

## 4. The work, in dependency order

Each item names the command that proves it. **If a change has no command that can
fail, it is not done** — that is the repo's rule and it is the reason M0 shipped
something two critics refused.

### A. The pack must stop lying about what it can draw  (do this first)

`npm run recipes:check` says **60 declared, 20 painted, 40 unpainted**. Forty
recipes are promised to a director by `recipes:list` and cannot be drawn.

They are not missing art. They are inside film folders:

- `p_*` (19 ids, registry at the tail of `films/diwali-north/vendor/diwali-recipes.js:833`)
- `proof_*` (6 ids, e.g. `proof_river` at `films/diwali-north/vendor/portrait-recipes.js:1031`)
- `myth_*` (13 ids — grep the other films' `vendor/` folders)
- `type_stack`, `side_scroll_chase` — **no painter anywhere**. These are genuinely new.

Do:

1. Merge those film-local recipe files into `styles/paper-kpop/canvas/` and register
   every id in `PAPER_BACKEND.shots`. No film may `vendor/` a recipe the pack claims.
2. Paint `type_stack` and `side_scroll_chase`.
3. Leave `films/**/vendor/` alone for now; retargeting the films is step D.

**Acceptance:** `npm run recipes:check` exits 0, and `recipes:list` still prints 60.

### B. One measurement unit  (K0.2)

`look-check` (full-frame edges) and `style:measure` (320 px) disagree on the same
frame — 4.75 against a pack band of 7.5–17.5. Two tools, two numbers, one frame.

**Acceptance:** a fixture that returns the same number for the same frame from both.

### C. The variety floors, as a command  (K2.8)

Write `tokens.identity.variety` (T1–T4 floors, per-shot caps, difference quota, per
`docs/references/kpop-variety-policy.md`) and `npm run variety:check -- <score>`.

**Acceptance:** the 25 s `proofs/kpop-test` is correctly **flagged** for six or more
missing T1 floors — that proves the check can fail. A synthetic 54-shot plan passes T2.

### D. Duration engine, wired end to end  (K3.3–K3.6)

Resolver: duration + style + aspect + seed → shot count, shots, scenes, beats, with
a warning when the story cannot fill the duration. Six fixtures: 30 s, 45 s, 60 s,
3 min, 10 min, 60 min (the last is plan-only). Then **delete the old bands** from
`quality-check`, `motion-check` and identity's `maxShotSeconds` — one policy read
everywhere.

**Acceptance:** 30 s → 9–11 shots; 60 s → 18–22; 3 min → 32–50; 60 min → 648–792.

### E. Port the 25 s proof into the pack  (K1.1–K1.4, the critical path)

Move the proof's rig, sets, props, type object and palette into the pack. The proof
becomes a film; the pack owns the code. Then run it through the studio pipeline as
a real film: story → beats → voice → scenes → score.

**Acceptance:** no `vendor/` dependency, `preflight` passes, `film:review` 10/10,
and a pack frame and a proof frame match on luma / saturation / edges / material.

### F. The seal  (K7)

`style:check` → `style:approve` → `style:seal` at **0.3.0**, with `PACK.md` naming
what the pack can and cannot draw, a licence page and a decision record.

**Acceptance:** pack hash in every film score; a changed pack invalidates the blind.

### Do not do

- Do not start M2 (the reference film) until A–E pass. A film made on a pack that
  cannot draw 40 of its own recipes teaches nothing.
- Do not resume the crime film.
- Do not add a dependency without a stated reason in the PR.

## 5. Rules of engagement

1. **Ownership.** `styles/**`, `fixtures/**`, `formats/**` = creative.
   `src/**`, `scripts/**`, `test/**` = technical. `src/core/**`, `docs/**`,
   `sources/**` = shared. Never refactor across a boundary without a PR labelled
   `contract-change`.
2. **Schema first.** If the contract moves, change the schema, then the fixture, then
   the implementation, in one commit.
3. **Small commits, conventional messages.**
4. **Decisions are written the same day** in `docs/decisions/`, or they will be
   contradicted next week.
5. **Report honestly.** M0's lesson is that a green gate is not a verdict. When a
   number is unflattering, put it in the doc.

## 6. Traps, verified this week

- **`films/<id>/vendor/` is a frozen copy of the canvas**, plus film-local recipe
  files. Six films carry one. This is why the pack "has" 60 recipes and can draw 20.
- **`build/` and `out/` are gitignored.** Any evidence you put there is local only.
- **The crime renderer always exits 1** with `TimeoutError: Waiting failed` even on
  success — check the frame count, not the exit code. PowerShell reports ffmpeg/node
  stderr as `NativeCommandError` exit 1 on success. Look for `wrote <file>`.
- **Port 8126 must be free** before a render.
- **`npm run shot:policy` disagrees with the M0 gate on purpose** (2.66 s median vs
  3.0 ±0.3). Do not widen the tolerance to make a document true — a test pins it.
- **A range measure is exact** because the paint is pure (decision 0032). That is
  what makes a one-shot fix a 30 s probe instead of a 12 min re-render.
- **The rig cannot reach its own belt or a bench.** Max hand reach ≈ 188 px from a
  shoulder at y 400, so the lowest hand is ≈ y 592. Props are handed between two
  bodies at chest height, never picked up off a low surface.
- **`lean` moves the shoulder** (≈220 px per rad) and breaks contact. Contact shots
  keep `lean: 0` and compensate only for `bounce`.

## 7. Definition of done for M1

- Pack 0.3.0: `style:check` and `style:law` green, zero contradictions between
  `capabilities.json`, `tokens.json`, `STYLE.md`, `BRIEF.md`, the card and
  `APPLICATION.md`.
- `recipes:check` 60/60 painted; every product recipe has a painter and a 9:16 map.
- `variety:check` enforces the T1–T4 floors; the 25 s proof is flagged, not passed.
- Duration 30 s – 1 h resolves; the six fixtures pass.
- The ported 25 s proof is pack-conformant and scores **10/10** with no pack change.
- One command plans a new KPOP film and says what it will cost.

## 8. Ask the user, do not decide alone

| Open question | Where it is written |
|---|---|
| The 30 s pacing blend (165–195 wpm vs 180–190) | `kpop-shot-policy.md`, O2 — one decision, marked open |
| The 54-shot gold map vs 53 by scene detect | `kpop-gold-standard.md`, O1 |
| Whether Paper Crime becomes a style (M5) or stays a proof | milestone map, §0 |
| How the 1 h tier segments its render | M6, not this milestone |

---

**If you only do one thing:** run `npm run recipes:check`, then make it pass. The
pack's value is that a film selects from a catalogue. A catalogue that cannot draw
its own entries is the exact failure M1 exists to remove.
