import test from "node:test";
import assert from "node:assert/strict";
import {
  checkSceneMoodDeclarations,
  checkStyleIdentity,
  resolveFilmBands,
  resolveSceneBand,
  type CastIdentity,
  type CastLibraryFact,
  type FrameSummary,
} from "../src/engine/style-identity.js";

const filmBands = {
  lumaMean: [75, 130] as const,
  saturationMean: [12, 35] as const,
  edgesMean: [7.5, 17.5] as const,
};
const field = {
  edgeBarMax: 0.08,
  largestFlat: [0.04, 0.46] as const,
  warmShare: [0.4, 0.9] as const,
  blueShareMax: 0.2,
  saturatedShare: [0.35, 0.7] as const,
};
const composition = {
  subjectHeight: [0.129, 0.92] as const,
  centroidX: [0.3, 0.75] as const,
  centroidShare: 0.8,
  heightSdMin: 15,
  heightTiersMin: 3,
  localContrastMin: 20,
  localContrastMedian: 35,
  localContrastShare: 0.75,
};
const castRule: CastIdentity = {
  archetype: "paper-pop-performer",
  stageRoles: ["star", "backing", "foil", "creature", "host"],
  principals: { min: 1, max: 2 },
  stagedShare: 0.85,
  posesMin: 8,
  expressionsMin: 14,
  anchors: ["face", "hair", "hand-left", "hand-right", "foot-left", "foot-right"],
  appearance: {
    faceStyle: "drawn-cartoon",
    headLayers: 3,
    hairLayers: 3,
    bradMetal: "#C68E2E",
    fingers: false,
  },
};
const metrics = { lumaMean: 100, saturationMean: 22, edgesMean: 12 };
const frame: FrameSummary = {
  shots: 10,
  barsLeftMax: 0,
  barsRightMax: 0,
  barShotShare: 0,
  plateShare: 0,
  centroidShare: 0.9,
  heightSd: 20,
  heightTiers: 3,
  closeUpShare: 0.5,
  localContrastShare: 0.9,
  localContrastMedian: 50,
  blueOnBlueShare: 0,
  warmShare: 0.7,
  blueShare: 0.05,
  saturatedShare: 0.5,
  largestFlat: 0.2,
  meanLuma: 100,
};
const cast: CastLibraryFact[] = [
  {
    character: "Kiran",
    rig: "worker@0.1.0",
    poses: 8,
    expressions: 14,
    anchors: castRule.anchors,
    body: true,
    archetype: castRule.archetype,
    stageRoles: ["star"],
    appearance: castRule.appearance,
    errors: [],
  },
];

const input = {
  shots: 10,
  stagedShots: 9,
  cast,
  metrics,
  filmBands,
  field,
  composition,
  castRule,
  frame,
};

const proportionRule: CastIdentity = {
  ...castRule,
  proportions: {
    "paper-pop-performer": {
      visualHeadToBody: [3.3, 4.2],
      handToHead: [0.16, 0.26],
    },
  },
};

const measured: CastLibraryFact = {
  ...cast[0]!,
  bodyHeight: 622,
  head: { w: 144, h: 168 },
  hand: { w: 24, h: 35 },
  visualHeadToBody: [3.4, 4.5],
};

test("a mood selects the pack's band, and an unknown mood falls back", () => {
  const mooded = {
    ...filmBands,
    moods: {
      night: {
        lumaMean: [55, 115] as const,
        saturationMean: [12, 38] as const,
        edgesMean: [7, 18] as const,
      },
    },
  };
  assert.deepEqual(resolveFilmBands(mooded, "night"), mooded.moods.night);
  assert.equal(resolveFilmBands(mooded, "snow").lumaMean[0], 75);
  assert.equal(resolveFilmBands(mooded, undefined).lumaMean[0], 75);
});

test("a scene inherits, overrides, or falls back to the absolute band", () => {
  const mooded = {
    ...filmBands,
    moods: {
      night: { lumaMean: [55, 115] as const, saturationMean: [12, 38] as const, edgesMean: [7, 18] as const },
      day: { lumaMean: [115, 185] as const, saturationMean: [10, 42] as const, edgesMean: [7, 19] as const },
    },
  };
  const inherited = resolveSceneBand(mooded, "night", undefined);
  assert.equal(inherited.mood, "night");
  assert.equal(inherited.inherited, true);
  assert.deepEqual(inherited.bands.lumaMean, [55, 115]);
  const override = resolveSceneBand(mooded, "night", "day");
  assert.equal(override.mood, "day");
  assert.equal(override.inherited, false);
  assert.deepEqual(override.bands.lumaMean, [115, 185]);
  const unknown = resolveSceneBand(mooded, "night", "dusk");
  assert.equal(unknown.unknown, true);
  const absolute = resolveSceneBand(filmBands, undefined, undefined);
  assert.equal(absolute.mood, null);
  assert.deepEqual(absolute.bands.lumaMean, [75, 130]);
});

test("an unknown scene mood is a finding, not a silent fallback", () => {
  const findings = checkSceneMoodDeclarations({
    scenes: [{ id: "sc01", mood: "dusk" }, { id: "sc02" }],
    filmMood: "night",
    moods: { night: {} },
  });
  assert.ok(findings.some((finding) => finding.code === "identity:scene-mood"));
});

test("a scene outside its own band fails while the film mean may still pass", () => {
  const mooded = {
    ...filmBands,
    moods: {
      night: { lumaMean: [55, 115] as const, saturationMean: [12, 38] as const, edgesMean: [7, 18] as const },
    },
  };
  const result = checkStyleIdentity({
    ...input,
    filmBands: mooded,
    cast: [measured],
    castRule: proportionRule,
    scenes: [
      {
        scene: "sc01",
        mood: "night",
        inherited: true,
        bands: { lumaMean: [55, 115], saturationMean: [12, 38], edgesMean: [7, 18] },
        metrics: { lumaMean: 150, saturationMean: 22, edgesMean: 12 },
        samples: 2,
      },
    ],
  });
  assert.ok(result.findings.some((finding) => finding.code === "identity:scene-luma"));
  assert.ok(!result.findings.some((finding) => finding.code === "identity:luma"));
});

test("a scene with no measurement is refused", () => {
  const result = checkStyleIdentity({
    ...input,
    scenes: [
      {
        scene: "sc01",
        mood: null,
        inherited: false,
        bands: filmBands,
        metrics: { lumaMean: null, saturationMean: null, edgesMean: null },
        samples: 0,
      },
    ],
  });
  assert.ok(result.findings.some((finding) => finding.code === "identity:scene-unmeasured"));
});

test("a measured doll ratio that matches its library and the pack passes", () => {
  const result = checkStyleIdentity({
    ...input,
    cast: [measured],
    castRule: proportionRule,
  });
  assert.deepEqual(result.findings, []);
});

test("a giant head or a tiny hand breaks the pack's construction", () => {
  const giant = checkStyleIdentity({
    ...input,
    cast: [{ ...measured, head: { w: 144, h: 260 } }],
    castRule: proportionRule,
  });
  assert.ok(giant.findings.some((finding) => finding.code === "identity:proportion"));
  const tinyHand = checkStyleIdentity({
    ...input,
    cast: [{ ...measured, hand: { w: 10, h: 12 } }],
    castRule: proportionRule,
  });
  assert.ok(tinyHand.findings.some((finding) => finding.code === "identity:proportion"));
});

test("a pack proportion with no measured body is refused, not skipped", () => {
  const result = checkStyleIdentity({
    ...input,
    cast: [{ ...cast[0]! }],
    castRule: proportionRule,
  });
  assert.ok(result.findings.some((finding) => finding.code === "identity:proportion"));
});

test("a library's declared doll ratio must contain the drawn figure", () => {
  const result = checkStyleIdentity({
    ...input,
    cast: [{ ...measured, visualHeadToBody: [4.6, 5.4] }],
    castRule: proportionRule,
  });
  assert.ok(result.findings.some((finding) => finding.code === "identity:proportion"));
});

test("a conforming cast, look and frame pass", () => {
  const result = checkStyleIdentity(input);
  assert.deepEqual(result.findings, []);
  assert.equal(result.stagedRatio, 0.9);
});

test("a new character with the same construction and archetype is allowed", () => {
  const newCast: CastLibraryFact[] = [
    { ...cast[0]!, character: "New Person", rig: "new-rig@0.1.0" },
  ];
  const result = checkStyleIdentity({ ...input, cast: newCast });
  assert.deepEqual(result.findings, []);
});

test("a film that stages no character is not the channel", () => {
  const result = checkStyleIdentity({ ...input, stagedShots: 0 });
  assert.ok(result.findings.some((finding) => finding.code === "identity:staged"));
});

test("a diagram show may stage 20-60% of shots", () => {
  const four = checkStyleIdentity({ ...input, stagedShots: 4, performanceMode: "diagram-show" });
  assert.deepEqual(four.findings, []);
  assert.deepEqual(four.stagedBand, { min: 0.2, max: 0.6, source: "mode" });
  const one = checkStyleIdentity({ ...input, stagedShots: 1, performanceMode: "diagram-show" });
  assert.ok(one.findings.some((finding) => finding.code === "identity:staged"));
  const seven = checkStyleIdentity({ ...input, stagedShots: 7, performanceMode: "diagram-show" });
  assert.ok(seven.findings.some((finding) => finding.code === "identity:staged"));
});

test("a presenter show still needs the cast floor", () => {
  const result = checkStyleIdentity({ ...input, stagedShots: 6, performanceMode: "presenter-show" });
  assert.ok(result.findings.some((finding) => finding.code === "identity:staged"));
});

test("a pack can override the mode band", () => {
  const result = checkStyleIdentity({
    ...input,
    stagedShots: 4,
    performanceMode: "diagram-show",
    castRule: { ...castRule, stagedShareByMode: { "diagram-show": [0.5, 0.5] } },
  });
  assert.ok(result.findings.some((finding) => finding.code === "identity:staged"));
});

test("a character without anchors, body, archetype or stage role is refused", () => {
  const broken: CastLibraryFact[] = [
    {
      ...cast[0]!,
      anchors: ["face"],
      body: false,
      archetype: undefined,
      stageRoles: undefined,
      appearance: undefined,
    },
  ];
  const result = checkStyleIdentity({ ...input, cast: broken });
  assert.ok(result.findings.filter((finding) => finding.code === "identity:cast").length >= 4);
});

test("a film-local character archetype is allowed when the construction matches", () => {
  const custom: CastLibraryFact[] = [{ ...cast[0]!, archetype: "paper-divine" }];
  const result = checkStyleIdentity({ ...input, cast: custom });
  assert.deepEqual(result.findings, []);
});

test("a character that breaks the paper construction is refused", () => {
  const broken: CastLibraryFact[] = [
    { ...cast[0]!, appearance: { ...castRule.appearance, headLayers: 2 } },
  ];
  const result = checkStyleIdentity({ ...input, cast: broken });
  assert.ok(
    result.findings.some(
      (finding) => finding.code === "identity:cast" && finding.message.includes("headLayers"),
    ),
  );
});

test("a look outside the film bands is refused", () => {
  const result = checkStyleIdentity({
    ...input,
    metrics: { lumaMean: 145, saturationMean: 36, edgesMean: 10 },
  });
  assert.ok(result.findings.some((finding) => finding.code === "identity:luma"));
  assert.ok(result.findings.some((finding) => finding.code === "identity:saturation"));
  assert.ok(!result.findings.some((finding) => finding.code === "identity:edges"));
});

test("a null measurement is a failure, never a pass", () => {
  const result = checkStyleIdentity({
    ...input,
    metrics: { lumaMean: null, saturationMean: 22, edgesMean: 12 },
  });
  assert.ok(result.findings.some((finding) => finding.code === "identity:unmeasured"));
});

test("no frame report is a failure", () => {
  const result = checkStyleIdentity({ ...input, frame: null });
  assert.ok(result.findings.some((finding) => finding.code === "identity:frames"));
});

test("the Uber-shaped frame fails every named axis", () => {
  const uber: FrameSummary = {
    shots: 10,
    barsLeftMax: 0.217,
    barsRightMax: 0.242,
    barShotShare: 1,
    plateShare: 1,
    centroidShare: 0,
    heightSd: 6.3,
    heightTiers: 1,
    closeUpShare: 1,
    localContrastShare: 0.67,
    localContrastMedian: 27.5,
    blueOnBlueShare: 0.3,
    warmShare: 0.77,
    blueShare: 0.17,
    saturatedShare: 0.45,
    largestFlat: 0.25,
    meanLuma: 152,
  };
  const result = checkStyleIdentity({ ...input, frame: uber });
  const codes = new Set(result.findings.map((finding) => finding.code));
  for (const code of [
    "identity:bars",
    "identity:fieldPlate",
    "identity:centroidX",
    "identity:heightRhythm",
    "identity:localContrast",
    "identity:blueOnBlue",
  ] as const) {
    assert.ok(codes.has(code), `expected ${code}`);
  }
});
