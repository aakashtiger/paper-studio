# Conversation Handover — Paper Studio

**Date:** 2026-10-26
**Repo:** https://github.com/aakashtiger/paper-studio
**Local:** `Y:\NewVideoTest\studio`
**Last commit:** `a408051` — docs: add session handover and Lemo review
**Companion:** `HANDOVER.md` has the file-level state.

This file carries the **narrative context** a new session cannot get from the repo: what we decided, what we rejected, where we stopped, and what to do next.

---

## The one-paragraph status

S1a — the Style Definition System — is **complete and accepted at 9/10 GO**. It defines a style as a six-artifact contract with 27 decisions, validates it, resolves it across two briefs and two formats, and proves a blind author can reproduce it. We then reviewed the Lemo-Opuscar library (59 styles) and concluded it is an excellent **source** of style bibles and reference films, but not a machine-repeatable style system. The next step is a **pilot conversion of one Lemo style — `watercolor` — into our pack**, with no renderer and no video, to measure the real cost before scaling.

---

## 1. Who is working, and how

- **Aakash** — creative director, not a programmer. Uses **OpenCode + DeepSeek V4.1 Flash**. Understands video and graphics. Reviews output by looking at it.
- **His brother** — programmer. Uses **Claude**. Not available for the current steps.
- **Both use LLMs for all code.** Aakash will not do manual work; the LLM writes and runs everything.
- **Process Aakash wants:**
  - Work **step by step**. Tell him the next step before doing it; wait for confirmation.
  - Fan out **sub-agents** for independent build tasks.
  - Run **pre-build critics** and **post-build critics**.
  - Loop until all critics give **9/10 GO**.
  - Keep it **simple**, not over-engineered. Optimization later.
  - Every feature ships with a command that proves it works.
  - No video in the style-definition steps.

---

## 2. The product decisions already made

### What it is

A **style operating system** for video, not a video generator.

- **Paper Vows** — wedding invitation films, sold as a service.
- **Paper Studio** — a self-serve studio for creators, sold as a subscription.

### Three axes

| Axis | Question | Lives in |
|---|---|---|
| Style | How does it look and move? | `styles/` |
| Format | What is the deliverable? | `formats/` |
| Genre | What is the content, and how is it argued? | `genres/` |

### Core principles

- **A style is a contract, not a mood board.** Assets are evidence; constraints are the style.
- **Composition varies; assets do not.** Novelty comes from recombining parameterized recipes, not generating new art per video.
- **Content-free and engine-free.** No names/dates/story in the style; no Canvas/Three/WebGL terms.
- **Local-first, BYO LLM.** The user brings Claude/ChatGPT/DeepSeek/local; rendering happens on their machine; the style compiler can stay server-side.
- **Style family, not one style.** `paper` family; `paper-kpop`, `paper-vows` variants; a variant changes tokens only.
- **No full renderer until the style contract is proven.** That is why S1a produced no video.

### Go-to-market

- **Wedding first** — highest willingness to pay, lowest runtime, privacy matters, viral distribution.
- **Song second** — already have the K-pop film as a demo.
- **YouTube later** — Shorts first, long-form after.
- **Pricing:** ₹999 Lite / ₹2,499 Pro / ₹6,999 Agency; global $19/$49/$129; done-for-you weddings ₹7,500–25,000.
- **Two doors, one engine:** wedding is service-first; creators are self-serve.

---

## 3. What we rejected, and why

| Rejected | Reason |
|---|---|
| MCP as the core product | A connector, not a product; consumers can't expose subscription auth to a server |
| Remotion / Motion Canvas / HyperFrames | Migration risk, licensing, or editor-first architecture; the custom canvas renderer is an asset |
| Pure template (swap names) | Forgettable, no premium pricing, competitors already do it |
| Pure generation (new art per video) | Unpredictable at a wedding; expensive; no consistency |
| One style for all verticals | Paper K-pop is wrong for weddings; the system transfers, the look does not |
| 27 dimensions as 27 files | Collapsed into six artifacts; the template hides the ontology |
| Fake evidence/hashes, numeric performance budgets | Replaced with declared status, real local files, and cost class |
| Full 59-style conversion | Convert only what the verticals need; measure with one pilot first |

---

## 4. What S1a completed

### The 27 decisions

Six layers: world, language, behaviour, identity, contract, evidence/governance.

They include medium, material, light, colour, texture, compositing, shape, composition, type, camera, rig, timing, motion, edit, sound, signature, refusals, register, capabilities, assets, recipes, runtime, cost class, evidence, conformance, provenance, authoring.

### The six artifacts

```
BRIEF.md          frozen input, hashed
STYLE.md          human contract: intent, invariants, signature, refusals, not-for, questions
tokens.json       medium, colour, type, layout, motion, sound, seed
capabilities.json identity, limits, adaptation, assets, runtime, evidence, proof, bindings, governance
recipes/*.json    parameterized shots, strict ops, slots, transitions, failure modes
card.html         one-page human card a director can judge
signoff.json      generated only on approval
```

### The machine

- `style:check` — schema, completeness, content-free, engine-free, slots, assets, transitions, camera, word limit, fonts, external dependencies, status consistency.
- `style:resolve` — nine assertions across two briefs and two formats; 8 shots, 45s, 1:1; every shot inside its recipe range.
- `style:approve` — refuses while a taste choice is open; writes a hash-bound sign-off; rewrites status and card.
- `style:seal` — freezes brief, template, contract, prompt, guide and validator; the pack is byte-identical to the example.

### The proof

- **81 tests**, 11 named mutations, all resolver assertions.
- **Blind author** produced `keepsake` from the template with zero hard failures.
- **One open choice** — page-turn speed 1.2s or 1.6s — intentionally left to the director.
- **Final acceptance:** 9/10 GO, no blocking defects.

### The control style

`styles/_examples/keepsake/` — a 1:1 family archive, 45 seconds, no cast, no music, dense captions, four reusable recipes.

---

## 5. The Lemo-Opuscar review

### What it is

`https://github.com/lemomo-ai/lemo-opuscar` — 59 styles, 7.3k stars, MIT code/docs, CC BY 4.0 demo films.

Each style has:

- `STYLE.md` — a 6–18 KB **prose style bible** (11 sections).
- `style.json` — **metadata only**.
- `DEMO.md` — one demo film, explicitly “one example among many.”
- `demo/` — a complete **bespoke** film codebase.
- `poster.jpg`, `stills/`, `.srt`.

Shared: `DIRECTOR.md`, `TECHNIQUE.md`, `AGENTS.md`, `MAINTAINING.md`, `core/`.

Local copy:
`C:\Users\Aakash\Downloads\Compressed\lemo-opuscar-main\lemo-opuscar-main\styles`

### The evidence

| Fact | Number |
|---|---|
| Styles | 59 (+ `_template`) |
| Demo source files | 891 |
| Demo source size | 8.47 MB |
| Styles with a `content.json` content swap | **4 / 59** |
| Styles with tokens/recipes/validator/golden frames | **0** |

### The verdict

- **Repeatable by a strong agent — yes.** A Claude Opus 5.5 agent reads the bible, writes a new treatment and new code, and makes a new film. The `_template` deliberately separates invariants from demo specifics.
- **Repeatable by a machine — no.** No schema, tokens, parameterized recipes, validator, conformance, or versioned pack.
- The README says: **“Built for Claude… other models may not reproduce them well.”** That is the gap our contract closes.

**Do not fork or vendor the 145 MB repo. Do not wrap it as the product. Use it as the source library and convert only the styles we need.**

### Licence

- Code/docs: MIT — keep the notice if we reuse code or text.
- Demo films/stills: CC BY 4.0 — credit LemoLab, indicate changes.
- Three voice tracks are excluded; each demo’s `CREDITS` lists third-party assets.
- Write our own pack text; credit the reference.

---

## 6. Where we are leaving it

**S1a is done. Lemo is reviewed. The next job is a pilot conversion, not a renderer.**

**Update 2026-10-26:** the living `keepsake` example has been restructured to the 11-section Lemo-style human brief and now carries `style.json` gallery metadata. The machine contract and the frozen `gate/blind/pack` are unchanged. See `docs/decisions/0006-lemo-brief-structure.md`. The watercolor pilot can use the same human-brief structure.

### Next step

Convert **one** Lemo style into our pack, with no renderer:

1. **`watercolor`** — 2D, romantic, universal; wedding/song. **Recommended first.**
2. **`papercut-red`** — red/gold paper-cut, ceremonial; Indian wedding/festive.
3. **`swiss-motion`** — if YouTube is the first vertical.

### Pilot gate

- `style:check` → REVIEWABLE, 0 hard failures.
- `style:resolve` with two briefs and two formats → 9/9.
- A second film can be resolved without editing the pack.
- A fresh author can apply it.
- No renderer, no video.

### Also merge

- Lemo’s **11-section STYLE.md** into our human brief.
- Lemo’s **`style.json`** metadata as a `gallery.json` in our pack.
- Lemo’s **`DIRECTOR.md` / `TECHNIQUE.md`** concepts into our format/genre playbooks and S2 renderer.
- Lemo’s **category taxonomy** for the gallery.

### Decisions needed from Aakash

1. Pilot style: `watercolor` (recommended), `papercut-red`, or `swiss-motion`?
2. Licence approach: MIT/CC BY notices, our own pack text, credit LemoLab.
3. Merge Lemo’s template/metadata into ours? Recommended yes.
4. Keep the Lemo library as a reference path, or add a `sources/lemo/` index with `THIRD_PARTY.md`?

### Non-blocking polish

1. Bundle fonts inside each pack.
2. Reword the approve summary from `NEXT:` to `OPEN THE CARD:`.
3. After approval, show the chosen page-turn value, not both options.

### Housekeeping

- CI file is local but untracked; needs `gh auth refresh -s workflow`.
- Add the brother’s GitHub handle to `CODEOWNERS`.
- `styles/paper-vows/` is legacy; S1b migrates it.

---

## 7. What the next session should do first

1. Read `HANDOVER.md`, this file, and `AGENTS.md`.
2. Confirm the pilot style with Aakash.
3. Write the S1b pilot spec: goal, inputs, deliverables, gate, non-goals.
4. Run **pre-build critics** on that spec (completeness, simplicity, product).
5. Build with **sub-agents** (source autopsy, tokens, recipes, capabilities, card).
6. Run **post-build critics**; loop until 9/10 GO.
7. Commit and push; no video.

---

## 8. Exact prompt to paste into the new session

```text
Read Y:\NewVideoTest\studio\HANDOVER.md, CONVERSATION-HANDOVER.md and AGENTS.md.

We are continuing from the end of the previous session. S1a is complete and
accepted 9/10 GO. Lemo-Opuscar has been reviewed: it is a source library of
prose style bibles and bespoke demos, not a machine-repeatable style system.

Next step: the S1b pilot conversion of the Lemo watercolor style into our pack.
No renderer, no video.

Follow the process: define the pilot goal and gate, run pre-build critics, build
with sub-agents, run post-build critics, loop until all critics give 9/10 GO.
Tell me the next step before starting. Do not ask me to do anything manually.
Keep it simple; no new dependencies without a reason.
```
