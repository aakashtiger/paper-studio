# Sealed blind authoring folder

This folder contains the contract, the template, the frozen brief and the
validator. It deliberately does not contain Paper K-pop or any existing style.

## Author a style

1. Copy `_template/` to `pack/`.
2. Copy `brief.md` to `pack/BRIEF.md`.
3. Read `STYLE-AUTHORING.md`, `prompt.md`, `brief.md` and `contract.json`.
4. Edit only `pack/`.
5. Run the validator:

```bash
cd validator
npm install
npm run check -- ../pack
```

6. When the report is REVIEWABLE, stop. The director runs `style:approve`.

## Rules

- Do not open any pack under `styles/` while authoring.
- Log every question in `pack/STYLE.md` under `## Questions`.
- `SEAL.json` records the template, contract, brief, prompt and validator
  hashes. A mismatch invalidates the run and needs a new blind author.
- The validator only checks the contract. Taste, phone legibility and motion
  feel are human checks.
