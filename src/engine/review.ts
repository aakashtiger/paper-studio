/**
 * May a review print a report it did not write this run? (decision 0033)
 *
 * `film:review` used to answer this with a timestamp: a step's artifact had to
 * have changed *while that step ran*, or the report was refused as stale. That
 * rule bought honesty at a large price — the review re-ran every gate audit the
 * chain had just run, including two paint-probe audits that repaint every frame
 * they judge. Six minutes to re-derive five verdicts that the same score and the
 * same painter had already produced, minutes earlier.
 *
 * A report is not trustworthy because it is new. It is trustworthy because it is
 * **about this film**, and that is a hash question, not a clock question:
 *
 *   - a video audit names the picture hash it read (`videoHash`), so it is fresh
 *     exactly when that hash is the picture the film ships;
 *   - a paint-probe audit names the score it measured (`score`), and is fresh
 *     when that is the current score **and** the report was written after the
 *     last change to the paint code — because the audit measures painted frames,
 *     and the painter is as much of an input as the score.
 *
 * Anything that cannot be tied is not reused. The asymmetry is deliberate: a
 * wrong reuse prints a lie, while a needless repaint costs seconds.
 */

export type ReportTie = "picture" | "score";

export type ReuseQuestion = {
  /** The report the step would write, if one exists on disk. */
  report: Record<string, unknown> | null;
  /** What the report must be tied by. */
  tie: ReportTie;
  /** sha256 of the picture the film ships, from the render manifest. */
  frozenHash: string | null;
  /** sha256 of the score, now. */
  scoreNow: string;
  /** When the report was written, in ms. */
  writtenAt: number | null;
  /** The newest change to any file the painter draws with, in ms. */
  paintChangedAt: number | null;
};

export type ReuseAnswer = { ok: boolean; why: string };

export function mayReuse(question: ReuseQuestion): ReuseAnswer {
  const { report, tie } = question;
  if (!report) return { ok: false, why: "no report on disk" };

  if (tie === "picture") {
    if (!question.frozenHash) {
      return { ok: false, why: "no picture hash yet — the render manifest is the tie" };
    }
    const recorded = typeof report.videoHash === "string" ? report.videoHash : null;
    if (!recorded) return { ok: false, why: "the report names no picture" };
    return recorded === question.frozenHash
      ? { ok: true, why: `measured on this picture (${recorded.slice(0, 15)}…), not repainted` }
      : { ok: false, why: "the report measured a different picture" };
  }

  // tie === "score"
  const recorded = typeof report.score === "string" ? report.score : null;
  if (!recorded) return { ok: false, why: "the report names no score, so it cannot be tied to this film" };
  if (recorded !== question.scoreNow) return { ok: false, why: "the report measured a different score" };
  if (question.writtenAt === null) return { ok: false, why: "the report has no timestamp" };
  if (question.paintChangedAt !== null && question.writtenAt <= question.paintChangedAt) {
    // The report predates the current painter, so it measured a painter that no
    // longer exists. This is the case that makes a timestamp worth keeping.
    return { ok: false, why: "the paint code changed after the report was written" };
  }
  return { ok: true, why: "measured on this score and this painter, not repainted" };
}
