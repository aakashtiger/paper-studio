# Blind style author — sealed run

You are authoring one style from a frozen brief, with no director in the loop.
You are blind to Paper K-pop and to every existing style pack.

## Read only

- `gate/blind/README.md`
- `gate/blind/STYLE-AUTHORING.md`
- `gate/blind/contract.json`
- `gate/blind/brief.md`
- `gate/blind/_template/`
- `gate/blind/pack/`
- `gate/blind/validator/`

Never open `styles/` or `docs/`. Do not read any other style pack or any
earlier review of this style. Do not use the network except to install the
validator's own dependencies.

## Set up the pack

`gate/blind/pack/` is your working pack.

1. If `pack/` is empty, copy the contents of `gate/blind/_template/` into it.
2. If `pack/BRIEF.md` is missing, copy `gate/blind/brief.md` to `gate/blind/pack/BRIEF.md`.
3. Work only inside `gate/blind/pack/`. Leave `BRIEF.md` unchanged.

Do not modify `gate/blind/_template/`, `contract.json`, `brief.md`, `README.md`,
`STYLE-AUTHORING.md` or the validator.

## Fill the pack

Read the brief, the authoring guide and `contract.json` before writing. Then
fill all six authored artifacts:

- `pack/STYLE.md` — intent, invariants, signature, refusals, not-for, and `## Questions`
- `pack/tokens.json` — medium, colour, type, layout, motion, sound, seed
- `pack/capabilities.json` — identity, limits, adaptation, assets, runtime, evidence, proof, bindings, governance
- `pack/recipes/*.json` — one file per shot, using only closed ops and slots
- `pack/card.html` — the one-page human artifact
- `pack/BRIEF.md` — the frozen brief, unchanged

Rules while authoring:

- No placeholder markers, no `TODO`, no `{{`.
- No real names, dates or venues in `tokens.json` or `recipes/*.json`.
- Text ops use slots only. Literal sample copy is allowed only in `card.html`,
  labelled `SPECIMEN`.
- Use only the closed vocabularies in `contract.json`.
- A photograph counts as one colour if the style says so; state it in the
  invariants.
- The six colour role names are yours. `metal` is a slot, not a material; if the
  brief bans metal, make it a matte neutral and say so.
- Proof frames are recipe ids, not files or beat roles.
- Answered taste choices go in `governance.decisions` with `answer`, `reason`,
  `decidedBy` and `decidedAt`. If you keep them under `choices`, set
  `resolved: true`.
- If the brief explicitly reserves a choice for the director, leave it open in
  `governance.choices` with `question`, `options` and `where` — no `answer`, no
  `resolved`. Do not self-answer it. Stop at REVIEWABLE with the open choice;
  the director answers it before `style:approve`.
- Font binaries are not required in S1a. Name the file, the licence and the
  role for every family.
- The engine-free rule catches library names such as `Three.js`,
  `WebGLRenderer` and `p5.brush`, not ordinary words like "three".

## The card

`pack/card.html` is part of the pack and is judged by eye. It must have all
eleven sections, in this order:

`hero`, `legend`, `visuals`, `palette`, `type`, `motion`, `sound`, `rules`,
`fit`, `proof`, `signoff`.

Use `data-section` on each one. The top half must be judgeable before the fold:

- The hero specimen, the promise and feels / never feels are visible without
  scrolling at **900 × 700 CSS px**.
- Use a compact top bar and a two-column hero at viewport widths >= 800 px.
- The motion specimen is a CSS-only loop with a **5.6 s held spread**, a
  **1.6 s page turn** and a **7.2 s loop**, plus a phone frame exactly
  **390 CSS px** wide.
- Include at least one `REFERENCE`, one `SPECIMEN` and one `ANTI`. If no cleared
  image exists, label the reference
  `REFERENCE — described, not reproduced`.
- Never label anything `OUTPUT`.
- Keep `<span data-signoff>UNSIGNED</span>`.
- Add `data-status` markers in the masthead and the footer. Use the word
  `REVIEWABLE`.
- The footer must not say "not approved" while the status says `REVIEWABLE`.
  Write "Waiting for the director's eyes" instead.

Approval is the director's job. The approve command rewrites `data-status` to
`APPROVED`; you must never run it. If the brief reserved a choice for the
director, approval will refuse until it is answered.

## Log questions

Every gap you have to bridge goes in `pack/STYLE.md` under `## Questions`, in
this form:

```
- **Q: ...** **A:** ...
```

A question is never answered by guessing. If the brief and the contract do not
settle it, choose the reading that keeps the style reusable, write down the
choice and the reason, and log it.

## Validate and iterate

From the sealed validator folder:

```bash
cd gate/blind/validator
npm install
npm run check -- ../pack
```

Read the whole report. Fix every item under **BEFORE YOU APPROVE**, settle every
**YOU MUST CHOOSE** item that the brief does not reserve for the director, and
re-run. A brief-reserved choice stays open, with no answer. Iterate until the
report says:

```
STATUS: REVIEWABLE
```

with zero hard failures, the exit code 0, and any brief-reserved choice still
listed under **YOU MUST CHOOSE**.

Do not approve. Do not sign. Do not self-answer a reserved choice. Do not edit
the validator to make the result pass.

## Stop and report

When the validator says `REVIEWABLE`, stop and report:

1. The exact final status line.
2. The warnings under **WORTH KNOWING**.
3. Every question you logged, with your answer and the reason.
4. Any brief-reserved choice still open, with its options and where it lives.
5. The one thing you are least sure the director will accept.

Your job is a pack that is machine-clean and ready for human eyes, not a pack
that is approved.
