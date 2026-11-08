/**
 * May this film be called done? (M1 K6 — the Goldfish protocol)
 *
 * A 10/10 gate is necessary and **not sufficient**. The gate reads declarations,
 * and M0 proved that a film can pass ten rows and still put a hand in the wrong
 * place. So the last row is not a number a script computes: it is two people who
 * did not make the film, saying GO — one on the picture, one on the story.
 *
 * This module is that rule in code, so "two fresh GOes" cannot decay into a
 * memory of two GOes:
 *
 *   - both required roles signed, once each;
 *   - each GO is a GO at the bar (10/10), not a GO at 8 with a shrug;
 *   - a GO may not carry a P0 or a P1 — a blocker is a NO-GO with better manners;
 *   - every report names **the picture it read** (`videoHash`), and a story
 *     report may also name the score it read. A report about an earlier cut is
 *     not evidence about this one (decision 0033, applied to people);
 *   - two reports from one signer are one report. A single agent cannot be the
 *     two critics.
 *
 * What it deliberately does **not** do: judge the film. It reads verdicts. The
 * judgement lives in the prompt (`critics/kpop-*.md`) and in the critic's own
 * adversarial reading; this file only refuses to let a weak or stale verdict
 * become a pass.
 */

/** The two roles every KPOP film needs. A style may add one; none may remove. */
export const REQUIRED_ROLES = ["picture", "story"] as const;

/** The bar a GO is a GO at. 10/10 is the film gate (decision 0058 and before). */
export const SHIP_BAR = 10;

export type Severity = "P0" | "P1" | "P2";

export type CriticFinding = {
  /** A shot id (`s07`), or `film` / `all` for a finding about the whole cut. */
  shot?: string;
  /** Seconds from the film's zero, when the finding is at an instant. */
  t?: number;
  severity?: Severity | string;
  what?: string;
  /** The sheet, still or pulled frame where the fault can be seen. */
  evidence?: string;
};

export type CriticReport = {
  role?: string;
  score?: number;
  verdict?: string;
  axes?: Record<string, number>;
  findings?: CriticFinding[];
  named_strongest?: string;
  named_weakest?: string;
  /** Who signed. Session id or name — two equal values are one critic. */
  critic?: string;
  /** sha256 over the video stream this critic read, hex or `sha256:`-prefixed. */
  videoHash?: string;
  /** sha256 of the score this critic read, when the role reads the writing. */
  scoreHash?: string;
};

export type CriticContext = {
  /** sha256 of the delivered picture. Bare hex or `sha256:`-prefixed. */
  videoHash: string;
  /** sha256 of the score, when a report names one it must be this one. */
  scoreHash?: string;
  /** Roles that must sign. Defaults to `picture` and `story`. */
  roles?: readonly string[];
  /** The score a GO must claim. Defaults to 10. */
  bar?: number;
};

export type CriticIssue = { code: string; message: string; role?: string };

export type CriticVerdict = {
  /** True only when every required role signed GO at the bar, tied to this cut. */
  ship: boolean;
  required: string[];
  signed: string[];
  /** The weakest score among the required reports; 0 when one is missing. */
  score: number;
  findings: CriticIssue[];
  warnings: CriticIssue[];
  reports: CriticReport[];
};

/** `sha256:abc` and `abc` are the same hash; case is not meaning. */
export function normaliseHash(value: string | undefined | null): string {
  if (!value) return "";
  return String(value).trim().replace(/^sha256:/i, "").toLowerCase();
}

const isBlank = (value: unknown) => typeof value !== "string" || value.trim() === "";

/** A P0/P1 is evidence-shaped only when it names what, where and how it is seen. */
function thinReason(finding: CriticFinding): string | null {
  const severity = String(finding.severity ?? "").toUpperCase();
  if (severity !== "P0" && severity !== "P1") return null;
  if (isBlank(finding.what)) return "it says nothing about what is wrong";
  if (isBlank(finding.evidence)) return "it names no sheet, still or frame where it can be seen";
  if (isBlank(finding.shot)) return "it names no shot";
  return null;
}

/**
 * Read the verdicts and answer one question: may this film ship?
 *
 * It is intentionally total — missing file, empty array, a report with no role —
 * every state gets a finding with a reason a person can act on.
 */
export function checkCritics(reports: CriticReport[], context: CriticContext): CriticVerdict {
  const required = [...(context.roles ?? REQUIRED_ROLES)];
  const bar = context.bar ?? SHIP_BAR;
  const picture = normaliseHash(context.videoHash);
  const score = normaliseHash(context.scoreHash);
  const findings: CriticIssue[] = [];
  const warnings: CriticIssue[] = [];
  const signedBy = new Map<string, string[]>();

  if (!picture) {
    findings.push({
      code: "critic:no-picture",
      message: "no delivered picture hash was given, so no report can be tied to this film",
    });
  }

  if (reports.length === 0) {
    findings.push({ code: "critic:no-reports", message: "no critic has signed this film" });
  }

  // One report per role, and the role must be one we asked for.
  for (const role of required) {
    const mine = reports.filter((report) => String(report.role ?? "").toLowerCase() === role);
    if (mine.length === 0) {
      findings.push({
        code: "critic:missing-role",
        message: `no ${role} critic has signed`,
        role,
      });
    } else if (mine.length > 1) {
      findings.push({
        code: "critic:duplicate-role",
        message: `${mine.length} ${role} reports exist; a role signs once`,
        role,
      });
    }
  }

  for (const report of reports) {
    const role = String(report.role ?? "").toLowerCase();
    if (!required.includes(role)) {
      warnings.push({
        code: "critic:extra-role",
        message: `a report names role "${role || "(none)"}", which this film did not ask for`,
      });
      continue;
    }
    const where = { role };

    // A verdict is GO or NO-GO; anything else is a report nobody can act on.
    const verdict = String(report.verdict ?? "").toUpperCase();
    if (verdict !== "GO" && verdict !== "NO-GO") {
      findings.push({
        code: "critic:verdict",
        message: `${role}: verdict "${report.verdict ?? "(none)"}" is neither GO nor NO-GO`,
        ...where,
      });
      continue;
    }

    // A score is a number at the bar or it is not a signature at 10/10.
    const value = Number(report.score);
    if (!Number.isFinite(value) || value < 0 || value > 10) {
      findings.push({
        code: "critic:score",
        message: `${role}: score "${report.score ?? "(none)"}" is not a number from 0 to 10`,
        ...where,
      });
    } else if (verdict === "GO" && value < bar) {
      findings.push({
        code: "critic:go-below-bar",
        message: `${role} says GO at ${value}/10; the bar is ${bar}/10`,
        ...where,
      });
    }

    if (verdict === "NO-GO") {
      const blockers = (report.findings ?? []).filter((finding) =>
        ["P0", "P1"].includes(String(finding.severity ?? "").toUpperCase()),
      ).length;
      findings.push({
        code: "critic:no-go",
        message: `${role} says NO-GO${blockers > 0 ? ` (${blockers} blocker${blockers === 1 ? "" : "s"})` : ""}`,
        ...where,
      });
    }

    // A GO may not carry a blocker. The severity is the critic's own word.
    if (verdict === "GO") {
      for (const finding of report.findings ?? []) {
        const severity = String(finding.severity ?? "").toUpperCase();
        if (severity !== "P0" && severity !== "P1") continue;
        findings.push({
          code: "critic:go-with-blocker",
          message:
            `${role} says GO but lists a ${severity} at ` +
            `${finding.shot ?? "an unnamed shot"}${typeof finding.t === "number" ? ` ${finding.t.toFixed(2)}s` : ""}: ` +
            `${finding.what ?? "(nothing)"}`,
          ...where,
        });
      }
    }

    // A blocker without a place and a picture is an opinion, not evidence.
    for (const finding of report.findings ?? []) {
      const reason = thinReason(finding);
      if (!reason) continue;
      findings.push({
        code: "critic:thin-finding",
        message:
          `${role}: ${String(finding.severity).toUpperCase()} "${finding.what ?? ""}" is not a finding — ${reason}`,
        ...where,
      });
    }

    // The tie. A report about an earlier cut is not evidence about this one.
    const named = normaliseHash(report.videoHash);
    if (!named) {
      findings.push({
        code: "critic:untied",
        message: `${role}: the report names no picture hash, so it could be about any cut`,
        ...where,
      });
    } else if (picture && named !== picture) {
      findings.push({
        code: "critic:wrong-picture",
        message: `${role}: the report read ${named.slice(0, 12)}..., not this film (${picture.slice(0, 12)}...)`,
        ...where,
      });
    }
    if (score && report.scoreHash !== undefined && normaliseHash(report.scoreHash) !== score) {
      findings.push({
        code: "critic:wrong-score",
        message: `${role}: the report names a score this film no longer has`,
        ...where,
      });
    }

    // Two signatures from one person are one signature.
    if (isBlank(report.critic)) {
      findings.push({
        code: "critic:unsigned",
        message: `${role}: the report does not say who signed it`,
        ...where,
      });
    } else {
      const key = String(report.critic).trim().toLowerCase();
      signedBy.set(key, [...(signedBy.get(key) ?? []), role]);
    }

    // Axes are how a score becomes auditable. Their absence is named, not fatal:
    // the verdict and the findings are what sign the film.
    if (!report.axes || Object.keys(report.axes).length === 0) {
      warnings.push({
        code: "critic:no-axes",
        message: `${role}: the report gives a score but no per-axis numbers`,
        ...where,
      });
    }
  }

  for (const [critic, roles] of signedBy) {
    if (roles.length > 1) {
      findings.push({
        code: "critic:one-signer",
        message: `${critic} signed ${roles.join(" and ")}; one critic cannot be both`,
      });
    }
  }

  // The weakest required score, so a single 10 cannot carry a 6.
  const scores = required
    .map((role) => reports.find((report) => String(report.role ?? "").toLowerCase() === role))
    .map((report) => (report ? Number(report.score) : Number.NaN))
    .filter((value) => Number.isFinite(value));
  const weakest = scores.length === required.length ? Math.min(...scores) : 0;

  return {
    ship: findings.length === 0,
    required,
    signed: reports
      .map((report) => String(report.role ?? "").toLowerCase())
      .filter((role) => required.includes(role)),
    score: weakest,
    findings,
    warnings,
    reports,
  };
}

/** The one line a person reads first. */
export function describeVerdict(verdict: CriticVerdict): string {
  if (verdict.ship) {
    return `SHIP: ${verdict.required.join(" + ")} signed GO at ${verdict.score}/10 for this picture.`;
  }
  return (
    `NOT SHIPPABLE: ${verdict.findings.length} finding${verdict.findings.length === 1 ? "" : "s"} ` +
    `across ${verdict.required.length} required role${verdict.required.length === 1 ? "" : "s"}.`
  );
}
