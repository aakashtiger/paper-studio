# Roadmap

Each phase has a gate. A phase is not done because the work is finished; it is done because the gate passes.

## Phase 0a — Style Definition System (S1a)

Prove a style can be defined as a machine-checkable, reusable package. No renderer, no video.

- 27-decision style contract, six-artifact pack.
- One CLI: `new`, `check`, `approve`, `resolve`, `seal`.
- Template, authoring guide and frozen style brief.
- Mutation suite.
- Blind-authored control style `keepsake`.

**Gate:** the mutation suite passes, `keepsake` is `REVIEWABLE`, two briefs and two formats resolve, and both verifiers return GO at 9/10 or above.

## Phase 0b — Watercolor pilot (S1b)

Convert one Lemo-Opuscar style into our pack. No renderer, no video.

- Source autopsy and rights index for `watercolor`.
- `styles/watercolor/`: six artifacts, six recipes, card, bundled OFL fonts.
- Two formats: 1:1 journal page (8 shots, 45 s) and 16:9 handscroll (4 shots, 45 s).
- Two reuse briefs and a full 2×2 resolve.
- Sealed blind application: 30 s, 9:16, six shots, pack unchanged.

**Gate:** `style:check` REVIEWABLE with 0 hard failures; `style:resolve` 9/9; page
8/45/1:1 and scroll 4/45/16:9; blind 6/30/9:16; all three critics at 9/10 GO.

## Phase 0c — Paper K-pop reference pack (S1c) — complete

- `styles/paper-kpop/`: 8 recipes, 2 formats, card, bundled fonts, licence notices.
- Song 14 shots / 45 s / 16:9; Shorts 8 shots / 30 s / 9:16; plan-valid blind 6 / 30 / 9:16.
- Geometry re-audit and one-batch fix: 14 px floor, no overlap, margins, paired 9:16 anchors.
- Gate: 9 tests, full suite 110.

**Gate:** REVIEWABLE, one open choice, 9/9 resolve, 9/9 gate, 110/110 suite,
geometry clean, contract/creative/product 9/10 GO. Final pack
`sha256:6c5765be…`; the live blind is *Last Cue* (run-18), a fresh run on the final hash.

## Phase 0c.1 — Watercolor 0.2.0 — complete

A card and process revision of the watercolor pack, in a new
`styles/watercolor-0.2.0/` and `gate/watercolor-0.2.0/`. The 0.1.0 evidence stays
historical. Visual-first card, stripped `APPLICATION.md`, exact manifests, UTF-8
resolve, density/height tests, three critics and one final blind at 6/30/9:16.
1:1/16:9 text proof is labelled unverified/S2; the 9:16 page is the text proof.

**Gate:** REVIEWABLE, one open choice; page 8/45/1:1 and scroll 4/45/16:9 resolve
9/9; blind 6/30/9:16; 110/110 tests; card 78 prose/237 visible, 4,158 px at 900
and 4,691 px at 390; critics 9/10 GO. Final pack `sha256:196fd315…`.

## Phase 0d — Vertical slice

Build the contract and prove the pipeline is real.

- Wedding brief schema and validator.
- Deterministic planner.
- Paper Vows tokens, capabilities, 7 recipes.
- Fixture brief.
- Golden fixture test.

**Gate:** `npm run plan -- fixtures/wedding-min/brief.json` produces a coherent 30-second plan, and both owners can run it on their machines.

## Phase 1 — Renderer (weeks 2–3)

- Seed the engine from the existing Paper K-pop renderer.
- Render a 15-second, 3-shot MP4 from the plan.
- Bundle fonts. Pin ffmpeg.
- Golden frame hash test in CI.

**First visual proof (v0):** `proofs/s2-paper/` — a 15-second, three-shot Paper
K-pop proof on HyperFrames (4 / 5 / 6 s), with a Studio preview timeline
(`npx hyperframes preview proofs/s2-paper`). It is authored scenes, not the plan
renderer. Watercolor is the next backend.

**Treatment contract (done):** `src/engine/treatment.ts` resolves an authored
treatment (recipes, durations, slots, camera, motion, transitions) against a
style pack and validates it. `proofs/s2-paper/plan.json` is the first treatment;
`npm run treatment -- proofs/s2-paper/plan.json` validates it. The renderer does
not consume it yet. This is the input contract for the plan-driven S2 gate.

**Production plan (accepted):** `docs/PRODUCTION-PLAN.md` v1.2 — film-first,
one score, audio spine, 13-frame board, code-generated SFX, binary gates, seven
critics. The pilot is *The Understudy*, 30 s / 9 shots / narration + SFX.
`films/understudy/score.json` validates, and the voice, transcript and SRT
exist. Next is the painter and the 0–10.6 s technical slice with `film-audit`;
then the look pass and board, animatic and full pilot.

**Reference research (done):** all 59 Lemo-Opuscar styles were read in detail —
`docs/research/lemo-59-survey.md`. The result is the scored-film model in
`docs/decisions/0012-scored-film-model.md`: one timed score drives picture, voice,
captions and sound; assets are per film with a growing library; the style owns a
duration envelope and clock modes; characters step at 8–12 fps while the camera
runs on ones; six critics at four gates. The next build is the score schema,
asset manifest and `film-audit`, then the 15 s proof re-cut through it.

**Gate:** the same plan renders byte-identical on both machines.

## Phase 2 — Full wedding film (weeks 3–4)

- All 12 wedding recipes.
- 5 palettes, 3 type lockups, 3 motif packs.
- Photo treatment: cutout, paper frame, composition.
- 30/45/60s, 9:16/16:9/1:1.
- Still card and RSVP QR.

**Gate:** three complete films from three real briefs, no bespoke code.

## Phase 3 — Service launch (week 5)

- Intake form.
- Review link with timecoded comments.
- Manual delivery kit.
- Five paying weddings.

**Gate:** five delivered films, at least three referrals, support under 20 minutes per film.

## Phase 4 — Studio shell (weeks 6–9)

- Local web app: gallery, brief, progress, preview, review, export.
- LLM connection: Claude Code first, then Codex, Gemini, Ollama.
- Style validation and reel commands for the creative owner.
- Project versioning and style pinning.

**Gate:** five outsiders make a wedding film unaided in under 60 minutes.

## Phase 5 — Creator door (weeks 10–14)

- Song format and Shorts format.
- Subscription billing.
- Asset browser.
- Style pack licensing and updates.

**Gate:** twenty paying creators, at least ten films exported.

## Phase 6 — Depth (month 4+)

- Long-form YouTube: research, script, narration playbook.
- Second style family: Vox Collage.
- 3D and camera-heavy tier.
- Marketplace.

**Gate:** a 90-second explainer a real YouTuber would publish.

## What we say no to until Phase 5

- desktop installers
- cloud rendering
- a full timeline editor
- multi-user teams
- a second style before the first one is proven across three briefs
