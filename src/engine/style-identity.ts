/**
 * Style identity — the channel test, not the delivery test.
 *
 * The pack already says what it is: `STYLE.md` and `tokens.json` define the
 * medium, palette, type, light, composition, camera and motion; `style:measure`
 * measures a specimen against the reference frames. This module is the one
 * film-level rule that was missing: a film must stay inside those bands and must
 * stage a conforming character, but it may design a **new** character on the
 * same paper-puppet construction. Library membership is not the rule.
 */
export type IdentityBands = {
  luma: number;
  contrast: number;
  saturation: number;
  edges: number;
  palette: number;
};

export type IdentityBandKey = keyof IdentityBands;

export type CastIdentity = {
  max: number;
  stagedRatio: number;
  posesMin: number;
  expressionsMin: number;
  anchors: string[];
};

export type CastLibraryFact = {
  character: string;
  rig: string;
  poses: number;
  expressions: number;
  anchors: string[];
  body: boolean;
  errors: { code: string; message: string }[];
};

export type IdentityDelta = {
  luma: number | null;
  contrast: number | null;
  saturation: number | null;
  edges: number | null;
  palette: number | null;
};

export type IdentityFinding = {
  code:
    | "identity:cast"
    | "identity:staged"
    | "identity:luma"
    | "identity:contrast"
    | "identity:saturation"
    | "identity:edges"
    | "identity:palette";
  message: string;
};

export function checkStyleIdentity(input: {
  shots: number;
  stagedShots: number;
  cast: CastLibraryFact[];
  delta: IdentityDelta;
  bands: IdentityBands;
  castRule: CastIdentity;
}): { findings: IdentityFinding[]; stagedRatio: number } {
  const findings: IdentityFinding[] = [];
  const stagedRatio = input.shots > 0 ? input.stagedShots / input.shots : 0;

  if (input.cast.length === 0) {
    findings.push({ code: "identity:cast", message: "the film declares no cast — a Paper K-pop film stages a paper performer" });
  }
  if (input.cast.length > input.castRule.max) {
    findings.push({
      code: "identity:cast",
      message: `${input.cast.length} cast members; this style stages at most ${input.castRule.max}`,
    });
  }
  for (const member of input.cast) {
    const missingAnchors = input.castRule.anchors.filter((anchor) => !member.anchors.includes(anchor));
    if (missingAnchors.length > 0) {
      findings.push({
        code: "identity:cast",
        message: `${member.character} is missing anchors: ${missingAnchors.join(", ")} — a new character may differ, its construction may not`,
      });
    }
    if (!member.body) {
      findings.push({ code: "identity:cast", message: `${member.character} publishes no body construction` });
    }
    if (member.poses < input.castRule.posesMin) {
      findings.push({ code: "identity:cast", message: `${member.character} has ${member.poses} poses; the style needs ${input.castRule.posesMin}` });
    }
    if (member.expressions < input.castRule.expressionsMin) {
      findings.push({
        code: "identity:cast",
        message: `${member.character} has ${member.expressions} expressions; the style needs ${input.castRule.expressionsMin}`,
      });
    }
    for (const error of member.errors) findings.push({ code: "identity:cast", message: `${member.character}: ${error.message}` });
  }
  if (stagedRatio + 1e-9 < input.castRule.stagedRatio) {
    findings.push({
      code: "identity:staged",
      message:
        `${input.stagedShots}/${input.shots} shots stage a character (${(stagedRatio * 100).toFixed(0)}%); ` +
        `this style needs at least ${(input.castRule.stagedRatio * 100).toFixed(0)}% — a diagram is not the channel`,
    });
  }

  const band = (name: keyof IdentityBands, value: number | null) => {
    if (value === null) return;
    const limit = input.bands[name];
    if (Math.abs(value) > limit) {
      findings.push({
        code: `identity:${name}`,
        message: `${name} is ${value >= 0 ? "+" : ""}${value.toFixed(1)} from the reference (band ±${limit})`,
      });
    }
  };
  band("luma", input.delta.luma);
  band("contrast", input.delta.contrast);
  band("saturation", input.delta.saturation);
  band("edges", input.delta.edges);
  band("palette", input.delta.palette);

  return { findings, stagedRatio };
}
