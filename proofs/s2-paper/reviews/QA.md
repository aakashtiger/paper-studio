# QA / UAT review

## Pass 1 — FAIL (narrow)

The MP4 was valid, but the evidence was stale and the proof was not
deterministic (`Math.random()` in the grain texture).

## Pass 2 — FAIL, one render bug

Everything else checked out: H.264 1920×1080 30 fps, 450 frames, 15.000 s, no
audio; lint 0/0; check passes with one intentional full-bleed layout warning;
determinism confirmed twice; three distinct shots; typecheck and 110/110 tests.

The bug: the stage lower third drew its text at 9.0 s, 4.35 s before its cream
panel. Cause: `C.backOut(0)` returns `2.2e-16`, so the `third > 0` gate passed;
`paper()` honoured the near-zero `globalAlpha` while `TY.type`/`TY.text` reset
it to 1, so the panel was invisible and the text was not.

## Final — PASS

- Gate is now an explicit time check (`lt < 4.34 → 0`) plus `third > 0.001`.
- The text receives `alpha: C.clamp(third)` explicitly.
- No ghost text at 9.2 s; the lower third appears only at 13.35 s, on its panel.
- Snapshots regenerated from the final MP4; two fresh runs match SHA-256 on all
  seven frames.
- Root `contact-sheet.jpg` refreshed from the shipped snapshot set.
- Dev folders (`snapshots-chk*`, `snapshots-dev*`, `snap-repeat`), the temporary
  GIF and the debug stills are removed.
- `.hyperframes/` is gitignored and removed before packaging.

## Remaining for the S2 gate

- Plan-driven 15 s / 3-shot render from a treatment file.
- Engine / style-backend boundary; watercolor on the same engine.
- Deterministic frame check in CI, not only a local snapshot comparison.
- Production asset library.
