import test from "node:test";
import assert from "node:assert/strict";
import {
  FIELD_ROLES,
  checkFilmIdentity,
  type FilmIdentityPack,
  type FilmIdentityScore,
} from "../src/engine/identity.js";

const pack: FilmIdentityPack = {
  modes: ["stage-show", "presenter-show", "creature-show"],
  defaultMode: "stage-show",
  motifLibrary: [
    "sunburst",
    "paper-sun",
    "petal",
    "halo",
    "torn-strip",
    "tape",
    "stamp",
    "print-marks",
    "iris",
    "confetti",
    "speed-lines",
    "paperclip",
    "meter",
  ],
  perFilm: { min: 3, max: 5 },
  uses: { min: 2, max: 5 },
  maxShotShare: 0.4,
  semanticObjectMin: 1,
  fieldRoles: FIELD_ROLES,
  forbidden: ["dissolve", "static-no-creep"],
};
const beatIds = new Set(["b1", "b3", "b5"]);
const score: FilmIdentityScore = {
  performance: {
    mode: "stage-show",
    star: "Kiran",
    entrance: { beat: "b1", via: "door" },
    exit: { beat: "b5", via: "bow" },
    signature: { name: "point" },
  },
  paletteScript: [
    { beat: "b1", field: "kraft" },
    { beat: "b3", field: "accent" },
    { beat: "b5", field: "paper" },
  ],
  motifs: [
    { motif: "coin", kind: "object", meaning: "the split" },
    { motif: "sunburst", kind: "device", meaning: "energy" },
    { motif: "stamp", kind: "device", meaning: "verdict" },
  ],
  cast: [{ character: "Kiran" }],
  shots: [
    { id: "s1", beat: "b1", motif: "coin", transitionOut: "cut" },
    { id: "s2", beat: "b3", motif: "coin", transitionOut: "cut" },
    { id: "s3", beat: "b3", motif: "sunburst", transitionOut: "cut" },
    { id: "s4", beat: "b5", motif: "sunburst", transitionOut: "iris" },
    { id: "s5", beat: "b5", motif: "stamp", transitionOut: "cut" },
    { id: "s6", beat: "b5", motif: "stamp", transitionOut: "cut" },
  ],
};

test("a complete performance, colour script and motif set passes", () => {
  assert.deepEqual(checkFilmIdentity({ score, pack, beatIds }), []);
});

test("missing performance, palette and motifs fail with their own codes", () => {
  const findings = checkFilmIdentity({
    score: { ...score, performance: undefined, paletteScript: undefined, motifs: undefined },
    pack,
    beatIds,
  });
  const codes = new Set(findings.map((finding) => finding.code));
  assert.ok(codes.has("identity:performance"));
  assert.ok(codes.has("identity:palette"));
  assert.ok(codes.has("identity:motif"));
});

test("a performance mode, star or beat outside the film is refused", () => {
  const findings = checkFilmIdentity({
    score: {
      ...score,
      performance: {
        mode: "creature-show",
        star: "Nobody",
        entrance: { beat: "nope", via: "door" },
        exit: { beat: "b5", via: "bow" },
        signature: { name: "point" },
      },
    },
    pack: { ...pack, modes: ["stage-show"] },
    beatIds,
  });
  const messages = findings.map((finding) => finding.message).join(" | ");
  assert.match(messages, /performance.mode/);
  assert.match(messages, /performance.star/);
  assert.match(messages, /entrance.beat/);
});

test("a colour script with no warm field or two blue fields is refused", () => {
  const findings = checkFilmIdentity({
    score: {
      ...score,
      paletteScript: [
        { beat: "b1", field: "blue" },
        { beat: "b3", field: "blue" },
        { beat: "b5", field: "ink" },
      ],
    },
    pack,
    beatIds,
  });
  const messages = findings.map((finding) => finding.message).join(" | ");
  assert.match(messages, /at least 2/);
  assert.match(messages, /at most 1/);
});

test("a motif used once, too often, unknown or without a semantic object is refused", () => {
  const findings = checkFilmIdentity({
    score: {
      ...score,
      motifs: [
        { motif: "unknown", kind: "device", meaning: "x" },
        { motif: "coin", kind: "device", meaning: "x" },
        { motif: "sunburst", kind: "device", meaning: "x" },
      ],
      shots: [
        { id: "s1", motif: "unknown", transitionOut: "cut" },
        { id: "s2", motif: "unknown", transitionOut: "cut" },
        { id: "s3", motif: "unknown", transitionOut: "cut" },
        { id: "s4", motif: "unknown", transitionOut: "cut" },
        { id: "s5", motif: "unknown", transitionOut: "cut" },
        { id: "s6", motif: "unknown", transitionOut: "cut" },
      ],
    },
    pack,
    beatIds,
  });
  const messages = findings.map((finding) => finding.message).join(" | ");
  assert.match(messages, /not in the pack's motif library/);
  assert.match(messages, /semantic object/);
  assert.match(messages, /used in 6 shots/);
});

test("a forbidden transition or a static camera with no creep is refused", () => {
  const findings = checkFilmIdentity({
    score: {
      ...score,
      shots: [
        { id: "s1", motif: "coin", transitionOut: "dissolve", camera: { move: "static", from: 1, to: 1 } },
      ],
    },
    pack,
    beatIds,
  });
  const messages = findings.map((finding) => finding.message).join(" | ");
  assert.match(messages, /forbidden transition "dissolve"/);
  assert.match(messages, /static with no creep/);
});
