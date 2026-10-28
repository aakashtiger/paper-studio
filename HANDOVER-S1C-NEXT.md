# S1c Paper K-pop — completed 2026-10-27

> **Done.** Paper K-pop is frozen at `sha256:6c5765be435bbf494bceaee6b770828c4bdd2c33d5c795287cf96435f8c211ba`.
> The current-hash geometry re-audit found 6 critical and 8 high box defects and
> fixed them in one batch; the gate is 9/9, the full suite 110/110, and the three
> critics are 9/10 GO. The final blind is *Last Cue* (run-18), a fresh author on
> the final hash; the old *Rooftop Soundcheck* run is archived under
> `gate/paper-kpop-blind/archive/run-17/`. See `gate/paper-kpop-blind/AUDIT.md`,
> `gate/paper-kpop-blind/REPORT.md` and `docs/decisions/0008-paper-kpop-pilot.md`.
> **Next:** S2 visual proof. Watercolor 0.2.0 followed S1c in a new
> `styles/watercolor-0.2.0/` and `gate/watercolor-0.2.0/`, with the 0.1.0 evidence
> untouched. This file is kept as the historical S1c plan.

**Date:** 2026-10-27
**Current tree:** the S1c files were untracked at the start of the session; the final state is recorded in the docs above.

> **Late audit warning.** A geometry pass returned 106 findings (6 critical, 30 high) against a snapshot of this pack. Some are already fixed (title-card fill, duplicate iris, flash, hero body position, tag), but NOT all. The audit is not a current 6665af27 audit. Do not trust the prior 9/10 claims until the new session re-audits the current hash, fixes the blockers, and reruns the gate.
>
> Historical starting state: **`sha256:6665af27c193cb234dbef8ecbb7c6f04a0f0452914eac59a8212b0869798265c`**, REVIEWABLE. The blind `inputs`/`used-inputs` were still `719e0582…` at that moment. The final freeze is `6c5765be…` with a fresh *Last Cue* blind; see the banner above.

## Current S1c state

- `styles/paper-kpop` is **REVIEWABLE**, 0 hard failures, one open choice `paper-shadow`.
- Current live pack hash: **`sha256:6665af27c193cb234dbef8ecbb7c6f04a0f0452914eac59a8212b0869798265c`**.
- Last full green state was at hash `719e0582…`: 8/8 pack gate, 100/100 full suite. The pack has changed since then (snap metadata, night-stage/HUD card, palette exception, hero fix, docs), so **the gate has not been rerun on 6665**.
- `gate/paper-kpop-blind/inputs` and `used-inputs` are still at `719e0582…`; the live work is the `Rooftop Soundcheck` plan. The gate will fail until the copy and manifests are refreshed.
- `gate/paper-kpop-blind/REPORT.md` and `docs/decisions/0008-paper-kpop-pilot.md` still record `719e0582…`. Update them after the final freeze.
- Last critic scores before the final card/geometry fixes: contract **8/10 REVISE**, creative **8/10 REVISE**, product **9/10 GO**. Most blockers were fixed after those scores, but they were **not re-reviewed**.

## Do this first, in a fresh session

1. Decide the final freeze: use the current `6665af27…` pack. Do not keep editing design by blind loop.
2. Run:
   ```powershell
   npm run typecheck
   npm run style:check -- styles/paper-kpop
   ```
3. Re-copy the pack into the blind folder and refresh manifests:
   ```powershell
   Remove-Item gate\paper-kpop-blind\inputs\pack -Recurse -Force
   Copy-Item styles\paper-kpop gate\paper-kpop-blind\inputs\pack -Recurse
   npx tsx gate/paper-kpop-blind/make-inputs.ts
   Remove-Item gate\paper-kpop-blind\used-inputs -Recurse -Force
   Copy-Item gate\paper-kpop-blind\inputs gate\paper-kpop-blind\used-inputs -Recurse
   ```
4. Regenerate `gate/paper-kpop-blind/resolve.txt` with UTF-8 output.
5. Choose one of these, explicitly:
   - **Strict:** one fresh blind author on `6665af27…`, 6 shots / 30 s / 9:16, then 9/9 and manifest checks. This is the clean proof.
   - **Pragmatic:** keep the existing plan, record a contract-only carry-forward with both hashes in `REPORT.md`, and do **not** claim a pristine seal. The current report already discloses a three-line clarification; add the final pack hash and the new fixes.
6. Run `node --import tsx --test test/paper-kpop-gate.test.ts` and `npm test`.
7. Re-run the three final critics on the frozen pack. Fix only blockers. Save the scorecards under `gate/paper-kpop-blind/critics/`.
8. Update `docs/specs/0005-paper-kpop-pack.md`, `docs/decisions/0008-paper-kpop-pilot.md`, `AGENTS.md`, `ROADMAP.md`, `HANDOVER.md` and `CONVERSATION-HANDOVER.md` with the real hash, scores and counts.
9. Delete `.tmp-card-phone.html`.
10. Commit and push, then verify GitHub Actions.

## S1b watercolor review — already done

The independent review is **7.5/10, PASS WITH CAVEATS**:

- Mechanically sound: REVIEWABLE, 2×2 9/9, blind 6/30/9:16, hash `31b804d0…`.
- The card is a real product defect: 484 body-copy words, 7,539 px desktop, no reference stills, tiny six-frame icons, clip-reveal motion, clipped ANTI, 345 px phone in a 390 px frame.
- The blind `APPLICATION.md` contains style prescriptions and factual errors; the seal test does not prove manifest completeness; the 9/10 critic claims have no artifacts.
- The style grammar itself is strong (about 8/10 fidelity); the card/evidence layer is not 9/10 product-grade.
- Do **not** silently edit the 0.1.0 card: it is in the pack hash and the blind seal.

## Watercolor 0.2.0 — scope, not started

The full audit is in the conversation; the recommendation is a **card + process revision**:

- Keep the style semantics, BRIEF, recipes, formats, fixtures, fonts, palette and rights.
- New pack version **0.2.0**; new gate folder `gate/watercolor-0.2.0/`; do not mutate the 0.1.0 evidence.
- Visual-first card: authored 1:1 hero, 16:9 walk, 9:16 phone, ANTI, palette strip, type, synchronized 1.2/1.8 paint-in comparison, rules/fit/proof/signoff. No Lemo stills. Target <=150 prose words, <=240 total visible.
- Strip the blind `APPLICATION.md` to schemas, fit math and treatment template. Re-run one fresh 6/30/9:16 blind.
- Add the three critic scorecards, exact manifest-set checks, `inputs/pack` hash, UTF-8 `resolve.txt`, and card density/height tests.
- Geometry audit found real 1:1/16:9 text-fit and walk-coordinate defects. If 0.2.0 is card/process-only, label 1:1/16:9 text proof “unverified/S2” and show box diagrams; otherwise make a narrow geometry patch and record it.
- The current watercolor 0.1.0 blind is historical; do not update it.

## Guardrails

- Styles stay independent: no shared assets, recipes, tests or runtime paths.
- No renderer, video or MP4 in S1c or 0.2.0.
- One open S1c choice: `paper-shadow`. One open watercolor choice: `paint-in-speed`.
- Do not let a blind author be the discovery process again. Audit the whole pack first, fix the batch, then one final blind.
