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
  moods?: Record<string, { lumaMean: NumericBand; saturationMean: NumericBand; edgesMean: NumericBand }>;
};

/**
 * A film's mood chooses a band from the pack. The absolute band stays the
 * fallback, so an older score or a newer mood resolves to the same check.
 */
export function resolveFilmBands(filmBands: FilmBands, mood?: string): FilmBands {
  const selected = mood ? filmBands.moods?.[mood] : undefined;
  return selected ? { ...selected } : filmBands;
}

export type SceneBandResolution = {
  mood: string | null;
  inherited: boolean;
  unknown: boolean;
  bands: FilmBands;
};

/**
 * A scene inherits the film's mood unless it names its own. A named mood that
 * the pack does not declare is not silently ignored: `unknown` is a finding.
 */
export function resolveSceneBand(
  filmBands: FilmBands,
  filmMood: string | undefined,
  sceneMood: string | undefined,
): SceneBandResolution {
  const mood = sceneMood ?? filmMood ?? null;
  const inherited = sceneMood === undefined && filmMood !== undefined;
  const selected = mood ? filmBands.moods?.[mood] : undefined;
  if (mood && !selected) {
    return { mood, inherited, unknown: true, bands: filmBands };
  }
  return { mood, inherited, unknown: false, bands: selected ? { ...selected } : filmBands };
}

export type SceneIdentityInput = {
  scene: string;
  mood: string | null;
  inherited: boolean;
  bands: FilmBands;
  metrics: IdentityMetrics;
  samples: number;
};

export type SceneMoodDeclaration = {
  id: string;
  mood?: string;
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
  focus?: { minShortSide: number };
};

export type CastIdentity = {
  archetype: string;
  stageRoles: string[];
  principals: { min: number; max: number };
  stagedShare: number;
  stagedShareByMode?: Partial<Record<string, readonly [number, number]>>;
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
  proportions?: Record<
    string,
    { visualHeadToBody: NumericBand; handToHead: NumericBand }
  >;
};

export type CastLibraryFact = {
  character: string;
  rig: string;
  poses: number;
  expressions: number;
  anchors: string[];
  body: boolean;
  /** The drawn boxes from the library's body block, when it publishes them. */
  bodyHeight?: number;
  head?: { w: number; h: number };
  hand?: { w: number; h: number };
  /** The library's own measured doll ratio, when it declares one. */
  visualHeadToBody?: NumericBand;
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
  | "identity:proportion"
  | "identity:focus"
  | "identity:staged"
  | "identity:scene-mood"
  | "identity:scene-unmeasured"
  | "identity:scene-luma"
  | "identity:scene-saturation"
  | "identity:scene-edges"
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

export type StagedBand = {
  min: number;
  max: number;
  source: "pack-mode" | "mode" | "cast";
};

/**
 * How many shots of this film should stage a character.
 *
 * A performance film stages almost every shot. A diagram film stages a person
 * only when the narration gives them something to do; mandating a body in every
 * diagram is how characters became floating stickers. The pack can override a
 * mode; otherwise `stage-show`/`presenter-show` keep the cast floor and
 * `diagram-show` gets the 20-60% band.
 */
export function stagedBand(mode: string | undefined, castRule: CastIdentity): StagedBand {
  const configured = mode ? castRule.stagedShareByMode?.[mode] : undefined;
  if (configured) return { min: configured[0], max: configured[1], source: "pack-mode" };
  if (mode === "diagram-show") return { min: 0.2, max: 0.6, source: "mode" };
  return { min: castRule.stagedShare, max: 1, source: "cast" };
}

export function checkSceneMoodDeclarations(input: {
  scenes: readonly SceneMoodDeclaration[];
  filmMood?: string;
  moods?: Record<string, unknown>;
}): IdentityFinding[] {
  const findings: IdentityFinding[] = [];
  if (!input.moods || Object.keys(input.moods).length === 0) {
    for (const scene of input.scenes) {
      if (scene.mood) {
        findings.push({
          code: "identity:scene-mood",
          message: `scene "${scene.id}" declares mood "${scene.mood}", but this pack has no mood bands`,
        });
      }
    }
    return findings;
  }
  if (input.filmMood && !input.moods[input.filmMood]) {
    findings.push({
      code: "identity:scene-mood",
      message: `the film mood "${input.filmMood}" is not one of the pack's moods`,
    });
  }
  for (const scene of input.scenes) {
    if (scene.mood && !input.moods[scene.mood]) {
      findings.push({
        code: "identity:scene-mood",
        message: `scene "${scene.id}" declares mood "${scene.mood}", which the pack does not declare`,
      });
    }
  }
  return findings;
}

export type FocusEvidence = {
  shot: string;
  name: string;
  kind: "object" | "face" | "body";
  shortSideShare: number | null;
};

/** A declared focus must have a measured box, and that box must be large enough. */
export function checkFocusSizes(
  rows: readonly FocusEvidence[],
  minShortSide?: number,
): IdentityFinding[] {
  const findings: IdentityFinding[] = [];
  for (const row of rows) {
    if (row.shortSideShare === null || !Number.isFinite(row.shortSideShare)) {
      findings.push({
        code: "identity:focus",
        message: `${row.shot} focus ${row.kind} "${row.name}" has no measured box - the probe never drew it, or it is entirely off frame`,
      });
      continue;
    }
    if (minShortSide !== undefined && row.shortSideShare + 1e-9 < minShortSide) {
      findings.push({
        code: "identity:focus",
        message: `${row.shot} focus ${row.kind} "${row.name}" is ${(row.shortSideShare * 100).toFixed(1)}% of frame height; the style needs at least ${(minShortSide * 100).toFixed(0)}%`,
      });
    }
  }
  return findings;
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
  performanceMode?: string;
  frame: FrameSummary | null;
  scenes?: readonly SceneIdentityInput[];
  focus?: readonly FocusEvidence[];
}): { findings: IdentityFinding[]; stagedRatio: number; stagedBand: StagedBand } {
  const findings: IdentityFinding[] = [];
  const stagedRatio = input.shots > 0 ? input.stagedShots / input.shots : 0;
  const band = stagedBand(input.performanceMode, input.castRule);

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
        message: `${member.character} declares no construction archetype - the style needs a paper puppet, the film names its own kind`,
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
    } else {
      const expected = input.castRule.appearance;
      const got = member.appearance;
      for (const key of ["faceStyle", "headLayers", "hairLayers", "bradMetal", "fingers"] as const) {
        if (got[key] !== expected[key]) {
          findings.push({
            code: "identity:cast",
            message: `${member.character} ${key} is ${JSON.stringify(got[key])}; this style builds it as ${JSON.stringify(expected[key])}`,
          });
        }
      }
    }
    if (input.castRule.proportions) {
      const archetype = member.archetype ?? "?";
      const band =
        input.castRule.proportions[archetype] ?? input.castRule.proportions["*"];
      if (!band) {
        findings.push({
          code: "identity:proportion",
          message: `${member.character} is a "${archetype}" but the style declares no proportion band for it - a new construction must publish its own proportions`,
        });
      } else if (!member.bodyHeight || !member.head || !member.hand) {
        findings.push({
          code: "identity:proportion",
          message: `${member.character} publishes no measured height, head or hand box; the proportion cannot be checked`,
        });
      } else {
        const headToBody = member.bodyHeight / member.head.h;
        const handToHead = member.hand.h / member.head.h;
        if (
          member.visualHeadToBody &&
          (headToBody < member.visualHeadToBody[0] - 1e-9 ||
            headToBody > member.visualHeadToBody[1] + 1e-9)
        ) {
          findings.push({
            code: "identity:proportion",
            message: `${member.character} draws ${headToBody.toFixed(2)} heads tall; its library declares ${member.visualHeadToBody[0]}-${member.visualHeadToBody[1]} - the published doll ratio is not the drawn one`,
          });
        }
        if (
          headToBody < band.visualHeadToBody[0] - 1e-9 ||
          headToBody > band.visualHeadToBody[1] + 1e-9
        ) {
          findings.push({
            code: "identity:proportion",
            message: `${member.character} is ${headToBody.toFixed(2)} heads tall; this style builds "${archetype}" at ${band.visualHeadToBody[0]}-${band.visualHeadToBody[1]}`,
          });
        }
        if (handToHead < band.handToHead[0] - 1e-9 || handToHead > band.handToHead[1] + 1e-9) {
          findings.push({
            code: "identity:proportion",
            message: `${member.character} hand is ${handToHead.toFixed(2)} of its head; this style builds "${archetype}" at ${band.handToHead[0]}-${band.handToHead[1]}`,
          });
        }
      }
    }
    for (const error of member.errors) {
      findings.push({ code: "identity:cast", message: `${member.character}: ${error.message}` });
    }
  }
  if (stagedRatio + 1e-9 < band.min) {
    findings.push({
      code: "identity:staged",
      message:
        `${input.stagedShots}/${input.shots} shots stage a character (${(stagedRatio * 100).toFixed(0)}%); ` +
        `this ${input.performanceMode ?? "style"} needs at least ${(band.min * 100).toFixed(0)}%`,
    });
  }
  if (stagedRatio - 1e-9 > band.max) {
    findings.push({
      code: "identity:staged",
      message:
        `${input.stagedShots}/${input.shots} shots stage a character (${(stagedRatio * 100).toFixed(0)}%); ` +
        `this ${input.performanceMode ?? "style"} allows at most ${(band.max * 100).toFixed(0)}% - bodies must earn their frame`,
    });
  }

  const bands: Array<["lumaMean" | "saturationMean" | "edgesMean", string, number | null]> = [
    ["lumaMean", "luma mean", input.metrics.lumaMean],
    ["saturationMean", "saturation mean", input.metrics.saturationMean],
    ["edgesMean", "edge mean", input.metrics.edgesMean],
  ];
  for (const [key, label, value] of bands) {
    if (!measured(label, value, findings)) continue;
    const filmBand = input.filmBands[key];
    if (!inBand(value, filmBand)) {
      findings.push({
        code: key === "lumaMean" ? "identity:luma" : key === "saturationMean" ? "identity:saturation" : "identity:edges",
        message: `${label} is ${value.toFixed(1)}; the film band is ${filmBand[0]}-${filmBand[1]}`,
      });
    }
  }

  for (const scene of input.scenes ?? []) {
    const mood = scene.mood ? `"${scene.mood}"${scene.inherited ? ", inherited" : ""}` : "absolute band";
    if (scene.samples <= 0) {
      findings.push({
        code: "identity:scene-unmeasured",
        message: `scene "${scene.scene}" (${mood}) has no measured shot; a missing scene is a failure, not a pass`,
      });
      continue;
    }
    const sceneBands: Array<["lumaMean" | "saturationMean" | "edgesMean", string, number | null, IdentityFindingCode]> = [
      ["lumaMean", "luma mean", scene.metrics.lumaMean, "identity:scene-luma"],
      ["saturationMean", "saturation mean", scene.metrics.saturationMean, "identity:scene-saturation"],
      ["edgesMean", "edge mean", scene.metrics.edgesMean, "identity:scene-edges"],
    ];
    for (const [key, label, value, code] of sceneBands) {
      if (value === null || !Number.isFinite(value)) {
        findings.push({
          code: "identity:scene-unmeasured",
          message: `scene "${scene.scene}" (${mood}) ${label} was not measured`,
        });
        continue;
      }
      const band = scene.bands[key];
      if (!inBand(value, band)) {
        findings.push({
          code,
          message: `scene "${scene.scene}" (${mood}): ${label} is ${value.toFixed(1)}; the scene band is ${band[0]}-${band[1]}`,
        });
      }
    }
  }

  if (input.focus && input.focus.length > 0) {
    findings.push(...checkFocusSizes(input.focus, input.composition.focus?.minShortSide));
  }

  if (!input.frame) {
    findings.push({
      code: "identity:frames",
      message: "no frame report; run `npm run collage` first - the painted frame is the evidence",
    });
    return { findings, stagedRatio, stagedBand: band };
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

  return { findings, stagedRatio, stagedBand: band };
}
