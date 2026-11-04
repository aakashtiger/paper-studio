/**
 * Style identity - the channel test, not the delivery test.
 *
 * The pack owns the grammar: the nine groups in `tokens.identity` name the
 * medium, the field, the composition, the cast, the performance, the motifs and
 * the bans. This module checks a film against that grammar. The painted frame
 * comes from `frame-report.ts`; the score vocabulary comes from `identity.ts`.
 * Library membership is not the rule: a new character may differ, its
 * construction and archetype may not.
 */

export type NumericBand = readonly [number, number];

export type FilmBands = {
  lumaMean: NumericBand;
  saturationMean: NumericBand;
  edgesMean: NumericBand;
};

export type FieldBands = {
  edgeBarMax: number;
  largestFlat: NumericBand;
  warmShare: NumericBand;
  blueShareMax: number;
  saturatedShare: NumericBand;
};

export type CompositionBands = {
  subjectHeight: NumericBand;
  centroidX: NumericBand;
  centroidShare: number;
  heightSdMin: number;
  heightTiersMin: number;
  localContrastMin: number;
  localContrastMedian: number;
  localContrastShare: number;
};

export type CastIdentity = {
  archetype: string;
  stageRoles: string[];
  principals: { min: number; max: number };
  stagedShare: number;
  posesMin: number;
  expressionsMin: number;
  anchors: string[];
  appearance: {
    faceStyle: string;
    headLayers: number;
    hairLayers: number;
    bradMetal: string;
    fingers: boolean;
  };
};

export type CastLibraryFact = {
  character: string;
  rig: string;
  poses: number;
  expressions: number;
  anchors: string[];
  body: boolean;
  archetype?: string;
  stageRoles?: string[];
  appearance?: CastIdentity["appearance"];
  errors: { code: string; message: string }[];
};

/** The absolute film means, not a delta against the six crops. */
export type IdentityMetrics = {
  lumaMean: number | null;
  saturationMean: number | null;
  edgesMean: number | null;
};

/** The one-sample-per-shot summary written by `frame-report.ts`. */
export type FrameSummary = {
  shots: number;
  barsLeftMax: number;
  barsRightMax: number;
  barShotShare: number;
  plateShare: number;
  centroidShare: number;
  heightSd: number;
  heightTiers: number;
  closeUpShare: number;
  localContrastShare: number;
  localContrastMedian: number;
  blueOnBlueShare: number;
  warmShare: number;
  blueShare: number;
  saturatedShare: number;
  largestFlat: number;
  meanLuma: number;
};

export type IdentityFindingCode =
  | "identity:cast"
  | "identity:staged"
  | "identity:luma"
  | "identity:saturation"
  | "identity:edges"
  | "identity:unmeasured"
  | "identity:frames"
  | "identity:bars"
  | "identity:fieldPlate"
  | "identity:centroidX"
  | "identity:heightRhythm"
  | "identity:localContrast"
  | "identity:blueOnBlue"
  | "identity:warm"
  | "identity:blue"
  | "identity:saturated"
  | "identity:largestFlat";

export type IdentityFinding = {
  code: IdentityFindingCode;
  message: string;
};

function inBand(value: number, [min, max]: NumericBand): boolean {
  return value >= min && value <= max;
}

function measured(
  label: string,
  value: number | null,
  findings: IdentityFinding[],
): value is number {
  if (value === null || !Number.isFinite(value)) {
    findings.push({
      code: "identity:unmeasured",
      message: `${label} was not measured; a missing band is a failure, not a pass`,
    });
    return false;
  }
  return true;
}

export function checkStyleIdentity(input: {
  shots: number;
  stagedShots: number;
  cast: CastLibraryFact[];
  metrics: IdentityMetrics;
  filmBands: FilmBands;
  field: FieldBands;
  composition: CompositionBands;
  castRule: CastIdentity;
  frame: FrameSummary | null;
}): { findings: IdentityFinding[]; stagedRatio: number } {
  const findings: IdentityFinding[] = [];
  const stagedRatio = input.shots > 0 ? input.stagedShots / input.shots : 0;

  if (input.cast.length === 0) {
    findings.push({
      code: "identity:cast",
      message: "the film declares no cast - a Paper K-pop film stages a paper performer",
    });
  }
  if (
    input.cast.length < input.castRule.principals.min ||
    input.cast.length > input.castRule.principals.max
  ) {
    findings.push({
      code: "identity:cast",
      message: `${input.cast.length} cast member(s); this style stages ${input.castRule.principals.min}-${input.castRule.principals.max}`,
    });
  }
  for (const member of input.cast) {
    const missingAnchors = input.castRule.anchors.filter(
      (anchor) => !member.anchors.includes(anchor),
    );
    if (missingAnchors.length > 0) {
      findings.push({
        code: "identity:cast",
        message: `${member.character} is missing anchors: ${missingAnchors.join(", ")} - a new character may differ, its construction may not`,
      });
    }
    if (!member.body) {
      findings.push({
        code: "identity:cast",
        message: `${member.character} publishes no body construction`,
      });
    }
    if (member.poses < input.castRule.posesMin) {
      findings.push({
        code: "identity:cast",
        message: `${member.character} has ${member.poses} poses; the style needs ${input.castRule.posesMin}`,
      });
    }
    if (member.expressions < input.castRule.expressionsMin) {
      findings.push({
        code: "identity:cast",
        message: `${member.character} has ${member.expressions} expressions; the style needs ${input.castRule.expressionsMin}`,
      });
    }
    if (!member.archetype) {
      findings.push({
        code: "identity:cast",
        message: `${member.character} declares no stage archetype; the style needs "${input.castRule.archetype}"`,
      });
    } else if (member.archetype !== input.castRule.archetype) {
      findings.push({
        code: "identity:cast",
        message: `${member.character} is "${member.archetype}"; this style stages "${input.castRule.archetype}"`,
      });
    }
    if (!member.stageRoles || member.stageRoles.length === 0) {
      findings.push({
        code: "identity:cast",
        message: `${member.character} declares no stage role (${input.castRule.stageRoles.join(", ")})`,
      });
    }
    if (!member.appearance) {
      findings.push({
        code: "identity:cast",
        message: `${member.character} declares no appearance (face, head, hair, metal, fingers)`,
      });
    }
    for (const error of member.errors) {
      findings.push({ code: "identity:cast", message: `${member.character}: ${error.message}` });
    }
  }
  if (stagedRatio + 1e-9 < input.castRule.stagedShare) {
    findings.push({
      code: "identity:staged",
      message:
        `${input.stagedShots}/${input.shots} shots stage a character (${(stagedRatio * 100).toFixed(0)}%); ` +
        `this style needs at least ${(input.castRule.stagedShare * 100).toFixed(0)}% - a diagram is not the channel`,
    });
  }

  const bands: Array<[keyof FilmBands, string, number | null]> = [
    ["lumaMean", "luma mean", input.metrics.lumaMean],
    ["saturationMean", "saturation mean", input.metrics.saturationMean],
    ["edgesMean", "edge mean", input.metrics.edgesMean],
  ];
  for (const [key, label, value] of bands) {
    if (!measured(label, value, findings)) continue;
    if (!inBand(value, input.filmBands[key])) {
      findings.push({
        code: key === "lumaMean" ? "identity:luma" : key === "saturationMean" ? "identity:saturation" : "identity:edges",
        message: `${label} is ${value.toFixed(1)}; the film band is ${input.filmBands[key][0]}-${input.filmBands[key][1]}`,
      });
    }
  }

  if (!input.frame) {
    findings.push({
      code: "identity:frames",
      message: "no frame report; run `npm run collage` first - the painted frame is the evidence",
    });
    return { findings, stagedRatio };
  }
  const frame = input.frame;
  if (frame.barShotShare > 0.1) {
    findings.push({
      code: "identity:bars",
      message: `side bars in ${(frame.barShotShare * 100).toFixed(0)}% of shots; the style allows bars only as a one-off set feature (<=10% of shots)`,
    });
  }
  if (frame.plateShare > 0.2) {
    findings.push({
      code: "identity:fieldPlate",
      message: `a cream plate framed by colour fields in ${(frame.plateShare * 100).toFixed(0)}% of shots; the field must reach every edge`,
    });
  }
  if (frame.centroidShare + 1e-9 < input.composition.centroidShare) {
    findings.push({
      code: "identity:centroidX",
      message: `subject centroid x is in band in ${(frame.centroidShare * 100).toFixed(0)}% of shots; the style needs ${(input.composition.centroidShare * 100).toFixed(0)}%`,
    });
  }
  if (frame.heightSd < input.composition.heightSdMin || frame.heightTiers < input.composition.heightTiersMin) {
    findings.push({
      code: "identity:heightRhythm",
      message: `subject height sd ${frame.heightSd.toFixed(1)} points, ${frame.heightTiers} tier(s); the style needs sd >=${input.composition.heightSdMin} and ${input.composition.heightTiersMin} tiers`,
    });
  }
  if (
    frame.localContrastShare + 1e-9 < input.composition.localContrastShare ||
    frame.localContrastMedian < input.composition.localContrastMedian
  ) {
    findings.push({
      code: "identity:localContrast",
      message: `local contrast >=${input.composition.localContrastMin} in ${(frame.localContrastShare * 100).toFixed(0)}% of shots (median ${frame.localContrastMedian.toFixed(1)}); the style needs ${(input.composition.localContrastShare * 100).toFixed(0)}% and median >=${input.composition.localContrastMedian}`,
    });
  }
  if (frame.blueOnBlueShare > 0.05) {
    findings.push({
      code: "identity:blueOnBlue",
      message: `blue-on-blue in ${(frame.blueOnBlueShare * 100).toFixed(0)}% of shots; the figure must separate from its field`,
    });
  }
  if (!inBand(frame.warmShare, input.field.warmShare)) {
    findings.push({
      code: "identity:warm",
      message: `warm share ${(frame.warmShare * 100).toFixed(0)}%; the style needs ${(input.field.warmShare[0] * 100).toFixed(0)}-${(input.field.warmShare[1] * 100).toFixed(0)}%`,
    });
  }
  if (frame.blueShare > input.field.blueShareMax) {
    findings.push({
      code: "identity:blue",
      message: `blue share ${(frame.blueShare * 100).toFixed(0)}%; the style allows <=${(input.field.blueShareMax * 100).toFixed(0)}%`,
    });
  }
  if (!inBand(frame.saturatedShare, input.field.saturatedShare)) {
    findings.push({
      code: "identity:saturated",
      message: `saturated share ${(frame.saturatedShare * 100).toFixed(0)}%; the style needs ${(input.field.saturatedShare[0] * 100).toFixed(0)}-${(input.field.saturatedShare[1] * 100).toFixed(0)}%`,
    });
  }
  if (!inBand(frame.largestFlat, input.field.largestFlat)) {
    findings.push({
      code: "identity:largestFlat",
      message: `largest flat colour region ${(frame.largestFlat * 100).toFixed(0)}%; the style needs ${(input.field.largestFlat[0] * 100).toFixed(0)}-${(input.field.largestFlat[1] * 100).toFixed(0)}%`,
    });
  }

  return { findings, stagedRatio };
}
