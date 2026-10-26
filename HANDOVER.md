# HANDOVER — Paper Studio

**Date:** 2026-10-26
**Repo:** https://github.com/aakashtiger/paper-studio
**Local:** `Y:\NewVideoTest\studio`
**Last commit:** `dffb47f` — `feat(s1b): convert Lemo watercolor into a style pack`
**Status:** S1a complete, accepted **9/10 GO**. S1b watercolor pilot complete, accepted **9/10 GO**, pack **REVIEWABLE**. No renderer, no video produced.
**Companion:** read `CONVERSATION-HANDOVER.md` for the narrative context the repo cannot carry.

> **2026-10-26 — S1b re-scope.** The next phase is the watercolor pilot in
> `docs/specs/0004-style-pilot-watercolor.md`, not Paper K-pop. Paper K-pop and the
> `styles/paper-vows` migration move to S1c. The rest of this file is the S1a record
> and the Lemo review; it remains useful, but 0004 is the live plan.
>
> **S1b decisions taken:** watercolor; our own pack text with MIT/OFL notices; the
> 11-section `STYLE.md` is proven in the watercolor pack and template adoption is
> deferred; Lemo stays a reference path with a `sources/lemo/` index. Gallery
> metadata is deferred to the app phase.
>
> **2026-10-26 — S1b accepted.** `styles/watercolor/` is **REVIEWABLE** with one
> open director choice (paint-in speed). Gate: typecheck, **92/92 tests**, page
> 8 shots / 45 s / 1:1, scroll 4 shots / 45 s / 16:9, blind 6 shots / 30 s / 9:16,
> pack hash `31b804d0…`, all three post-build critics **9/10 GO**. The gate is
> watercolor-only; `keepsake` and `watercolor` are self-contained and share no
> assets or tests. Full evidence: `docs/decisions/0007-watercolor-pilot.md` and
> `gate/watercolor-blind/REPORT.md`.
> Next: the director answers the paint-in choice and signs, or start S1c Paper
> K-pop / a `papercut-red` pilot. No renderer, no video.
**Update 2026-10-26:** the living `keepsake` example now uses the 11-section Lemo-style human brief and carries `style.json` gallery metadata. The machine contract, the template and the frozen `gate/blind/pack` are unchanged. See `docs/decisions/0006-lemo-brief-structure.md`.

---

## Start here (new session)

Paste this into a new session opened in `Y:\NewVideoTest\studio`:

```text
Read Y:\NewVideoTest\studio\HANDOVER.md, CONVERSATION-HANDOVER.md and AGENTS.md.
Continue from the "Next step" section.

Start with the pilot conversion of the Lemo watercolor style into our style pack.
No renderer, no video. Follow the process: define the step goal, run pre-build
critics, build with sub-agents, run post-build critics, loop until all critics
give 9/10 GO.

Tell me the next step before starting. Do not ask me to do anything manually.
```

---

## 1. What this product is

A **style operating system** for video, not a video generator.

- **Paper Vows** — wedding invitation films, sold as a service.
- **Paper Studio** — a self-serve studio for creators, sold as a subscription.

Three axes:

| Axis | Question | Lives in |
|---|---|---|
| Style | How does it look and move? | `styles/` |
| Format | What is the deliverable? | `formats/` |
| Genre | What is the content, and how is it argued? | `genres/` |

The style is a **contract**, not a mood board. A style pack has six artifacts:

```
BRIEF.md          frozen input, hashed
STYLE.md          human contract: intent, invariants, signature, refusals, not-for, questions
tokens.json       medium, colour, type, layout, motion, sound, seed
capabilities.json identity, limits, adaptation, assets, runtime, evidence, proof, bindings, governance
recipes/*.json    parameterized shots with slots, composition, transitions, failure modes
card.html         one-page human card a director can judge
signoff.json      generated only on approval
```

---

## 2. What is complete (S1a)

S1a defined and proved the style machine:

- 27 decisions across 6 layers: world, language, behaviour, identity, contract, evidence/governance.
- Closed vocabularies: primitives, transitions, effects, camera moves, easings, asset types, beat roles, type roles, physics, slots.
- Strict recipe ops; `group` removed so nothing can hide inside it.
- Validator: schema, completeness, content-free, engine-free, slot/asset/transition/camera/word checks, font resolution, external dependency blocks, status consistency.
- Resolver: 9 assertions across two briefs and two formats; durations inside recipe ranges; 8 shots / 45s / 1:1.
- Approval: `DRAFT → REVIEWABLE → APPROVED → changed-after-approval`; hash-bound; refuses while a taste choice is open.
- Seal: frozen brief, template, contract, prompt, guide, validator; byte-identical pack.
- Blind run: an independent author produced `keepsake` from the template, with one open director choice (page-turn speed 1.2s or 1.6s).

**The control style:** `styles/_examples/keepsake/` — a 1:1 family archive, 45 seconds, no cast, no music, dense captions, 4 reusable recipes.

---

## 3. Gate evidence

```text
typecheck             pass
tests                 81 / 81
style:check template  DRAFT, exit 0
style:check keepsake  REVIEWABLE, 0 hard, 1 open choice
style:check seal pack REVIEWABLE, seal-valid
style:resolve         8 shots · 45s · 1:1 per format
assertions            9 / 9
pack vs example       9 / 9 files byte-identical
seal                  6 / 6 hashes match, no BOM
fonts                 Instrument Serif + Space Grotesk load from bundled files
external fonts        hard-fail
external scripts      hard-fail
approval              refused while choice open; APPROVED after answering; one byte reopens
```

Final acceptance verdict: **9/10, GO, no blocking defects.**

---

## 4. Key files

| Path | What it is |
|---|---|
| `docs/specs/0003-style-definition-system.md` | The S1a constitution: 27 decisions, pack, gate, acceptance |
| `src/core/style.ts` | Schemas, dimension table, validator, resolver, approval, hashes |
| `scripts/style.ts` | CLI: `new`, `check`, `approve`, `resolve`, `seal` |
| `test/style-check.test.ts` | 81 tests, 11 mutations, resolver and approval tests |
| `docs/STYLE-AUTHORING.md` | The 7-step director flow, 12 questions, report meanings |
| `prompts/style-author.md` | General LLM authoring prompt |
| `prompts/blind-author.md` | Sealed-run prompt |
| `styles/_template/` | Six files a new style starts from |
| `styles/_examples/keepsake/` | The blind-authored control style |
| `styles/_briefs/keepsake.md` | Frozen control brief |
| `gate/blind/` | Sealed run: inputs, hashes, pack, validator |
| `formats/keepsake-book/format.json` | 1:1 book, 8-shot sequence, 45s |
| `formats/keepsake-gallery/format.json` | 1:1 gallery, different sequence, 45s |
| `fixtures/resolve/` | Two generic briefs for the reuse test |
| `styles/paper-vows/` | Legacy earlier wedding draft; not expected to pass; S1c migrates it |
| `reference/paper-kpop/` | Read-only `core.js` / `type.js` from the completed K-pop film |

---

## 5. What is deliberately not built

- Renderer, frames, pixels, MP4.
- Paper K-pop pack (S1c).
- Web app, review room, payments, auth.
- 3D / camera-heavy tier.
- Marketplace, affiliate, mobile.

S1a proves **structural and reuse validity**, not pixel conformance. Pixel conformance is S2.

---

## 6. Lemo-Opuscar review (2026-10-26)

Source reviewed:
`C:\Users\Aakash\Downloads\Compressed\lemo-opuscar-main\lemo-opuscar-main\styles`
GitHub: `https://github.com/lemomo-ai/lemo-opuscar`

### What it is

59 styles. Each has:

- `STYLE.md` — a 6–18 KB **prose style bible** (11 sections: essence, materials, colour logic, type, motion, camera, sound, native moves, pitfalls, engine, variation space).
- `style.json` — **metadata only** (slug, names, category, demo, logline, uses, frame time, duration).
- `DEMO.md` — one demo film, explicitly “one example among many; don’t reuse its story, arc, shots, props or timings.”
- `demo/` — a complete bespoke film codebase.
- `poster.jpg`, `stills/`, `.srt`.

Shared: `DIRECTOR.md`, `TECHNIQUE.md`, `AGENTS.md`, `MAINTAINING.md`, `core/`.

### Quantitative evidence

| Fact | Number |
|---|---|
| Styles | 59 (+ `_template`) |
| Demo source files | 891 (JS, Python, MJS, HTML) |
| Demo source size | 8.47 MB |
| Styles with a `content.json` content swap | **4 / 59** (`engraving`, `hologram-hud`, `midcentury-toon`, `silkscreen-poster`) |
| Styles with tokens/recipes/validator/golden frames | **0** |

### Verdict

- **Repeatable by a strong agent** — yes. A Claude Opus 5.5 agent reads the style bible, writes a new treatment and new code, and makes a new film. The `_template` deliberately separates invariants from demo specifics. This is real and impressive.
- **Repeatable by a machine** — no. No schema, no tokens, no parameterized recipe library, no validator, no conformance, no versioned pack. The demo code is bespoke; 55/59 styles have no content-swap parameterization.
- The README says: **“Built for Claude… other models may not reproduce them well.”** That is the gap our contract closes.

### Licence

- Code/docs: MIT.
- Demo films/stills: CC BY 4.0 (credit LemoLab, indicate changes).
- Three voice tracks are excluded; each demo’s `CREDITS` lists third-party assets.
- If we adapt, keep the MIT notice for text/code and credit LemoLab for stills; write our own pack.

### Recommendation

Do **not** fork or vendor the 145 MB repo. Do **not** wrap it as the product.

Use it as the **source library** and convert only the styles we need into our pack. Keep S1a as the contract/QA/versioning layer. The moat is the contract, review, versioning, multi-LLM operation and vertical workflows — not the public style library.

---

## 7. Next step: pilot conversion

**Goal:** convert **one** Lemo style into our pack, with no renderer, and measure the real cost.

Recommended pilot order:

1. **`watercolor`** — 2D, romantic, universal; wedding/song.
2. **`papercut-red`** — red/gold paper-cut, ceremonial; Indian wedding/festive.
3. **`swiss-motion`** — if YouTube is the first vertical.

Source for the pilot:
`C:\Users\Aakash\Downloads\Compressed\lemo-opuscar-main\lemo-opuscar-main\styles\watercolor`

### Conversion steps

1. Read `STYLE.md`, `DEMO.md`, and the relevant `demo/` code.
2. Extract the 27 decisions. Separate **style invariants** from **demo content** (story, shots, characters, palette examples, timeline, music).
3. Build the pack:
   - `BRIEF.md` — a real brief for a second film, not the demo.
   - `STYLE.md` — merge Lemo’s 11 sections with our 27-decision human brief.
   - `tokens.json` — extracted values.
   - `capabilities.json` — limits, assets, runtime, evidence, proof, bindings.
   - `recipes/*.json` — parameterized shots from the demo’s reusable techniques.
   - `card.html` — a one-page card.
4. Run `npm run style:check -- <path>` to REVIEWABLE.
5. Run `style:resolve` with two briefs and two formats; 9/9.
6. Run a blind application: a fresh author uses the pack for a different brief; critics score 9/10.

### Gate

- `style:check` REVIEWABLE, 0 hard failures.
- `style:resolve` 9/9, 8 shots, 45s, 1:1 (or the target format).
- A second film can be resolved without editing the pack.
- A blind author can apply it.
- No renderer, no video.

### Also merge into our system

- Lemo’s **11-section STYLE.md** structure — it is a better human brief than our current one.
- Lemo’s **`style.json`** metadata — add a `gallery.json` to our pack for the app/marketplace.
- Lemo’s **`DIRECTOR.md` / `TECHNIQUE.md`** concepts — use them for the format/genre playbooks and the S2 renderer (deterministic `render(t)`, headless Chrome, readcheck, mux, loudness).
- Lemo’s **category taxonomy** — 11 categories, 59 styles, ready-made gallery structure.

### Do not

- Vendor the 145 MB repo or the demo code into the product.
- Integrate `core/` yet (Python/Playwright/ffmpeg-heavy); study the pattern for S2.
- Reuse demo stories, characters, or the three excluded voice tracks.
- Assume cross-model quality from a Claude-tuned prose brief.

---

## 8. Decisions needed from Aakash

1. **Pilot style:** `watercolor` (recommended), `papercut-red`, or `swiss-motion`?
2. **Licence approach:** keep MIT/CC BY notices, write our own pack text, credit LemoLab for stills. Legal review before commercial use.
3. **Merge Lemo’s 11-section STYLE.md + `style.json` metadata** into our template? Recommended yes.
4. **Where the library lives:** reference path only, or a `sources/lemo/` index with a `THIRD_PARTY.md`?

---

## 9. Non-blocking polish from the S1a gate

1. Bundle fonts inside each style pack; currently they point at the shared repo `assets/fonts`.
2. Reword the successful `style:approve` summary from `NEXT:` to `OPEN THE CARD:`.
3. After approval, the card should show the chosen page-turn value, not both options.

None block the gate.

---

## 10. Housekeeping

- **CI:** `.github/workflows/ci.yml` is written but **untracked** because the GitHub token lacks the `workflow` scope. Run `gh auth refresh -s workflow`, then commit and push it.
- **Collaborator:** add your brother’s GitHub handle. `CODEOWNERS` currently points only at `aakashtiger`.
- **Legacy:** `styles/paper-vows/` is the earlier wedding draft; it is not expected to pass the new validator. S1c migrates it.
- **No git submodules, no new dependencies** without a stated reason.

---

## 11. Commands

```bash
npm install
npm run typecheck
npm test
npm run style:check -- styles/_examples/keepsake
npm run style:resolve -- --style styles/_examples/keepsake --seed 42 \
  --brief fixtures/resolve/family-archive.json --format formats/keepsake-book/format.json \
  --brief fixtures/resolve/family-archive-2.json --format formats/keepsake-gallery/format.json
npm run style:seal -- --force
```

---

## 12. Process rules (Aakash’s preferences)

- Work **step by step**. Tell him the next step before doing it, wait for confirmation.
- Do **not** ask him to do anything manually. He directs; the LLM builds.
- Fan out **sub-agents** for independent build tasks.
- Use **critics** to review pre-build and post-build; loop until all critics give **9/10 GO**.
- Keep it **simple**, not over-engineered. No new dependencies without a reason.
- Every feature must ship with a command that proves it works.
- No video in S1b. The job is the style pack, not another film.
