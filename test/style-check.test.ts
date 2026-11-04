import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  CapabilitiesSchema,
  PRIMITIVES,
  RESOLVE_ASSERTIONS,
  RecipeSchema,
  STYLE_DIMENSIONS,
  TokensSchema,
  assertBriefsDiffer,
  assertSamePlan,
  assertSeedChanges,
  approveStylePack,
  checkSealedRun,
  computeContractHash,
  computePackHash,
  computeTemplateHash,
  computeValidatorHash,
  findStyleDirectory,
  formatStyleReport,
  hashFile,
  loadStylePack,
  readStyleSeal,
  resetSealTarget,
  resolveStyle,
  styleExitCode,
  validateStylePack,
} from "../src/core/style.js";
import type {
  GenericBrief,
  ResolveFormat,
  Slot,
  StyleCapabilities,
  StyleCheckResult,
  StyleRecipe,
  StyleTokens,
  Transition,
} from "../src/core/style.js";

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

function write(path: string, text: string): void {
  writeFileSync(path, text, "utf8");
}

function writeJson(path: string, value: unknown): void {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function readJson(path: string): Json {
  return JSON.parse(readFileSync(path, "utf8")) as Json;
}

function readTokens(pack: string): StyleTokens {
  return TokensSchema.parse(readJson(join(pack, "tokens.json")));
}

function readCapabilities(pack: string): StyleCapabilities {
  return CapabilitiesSchema.parse(readJson(join(pack, "capabilities.json")));
}

function readRecipe(pack: string, id: string): StyleRecipe {
  return RecipeSchema.parse(readJson(join(pack, "recipes", `${id}.json`)));
}

function saveTokens(pack: string, tokens: StyleTokens): void {
  writeJson(join(pack, "tokens.json"), tokens);
}

function saveCapabilities(pack: string, capabilities: StyleCapabilities): void {
  writeJson(join(pack, "capabilities.json"), capabilities);
}

function saveRecipe(pack: string, recipe: StyleRecipe): void {
  writeJson(join(pack, "recipes", `${recipe.id}.json`), recipe);
}

/** style:approve refuses while a taste choice is open. Tests make a pack ready. */
function clearChoices(pack: string): void {
  const capabilities = readCapabilities(pack);
  capabilities.governance.choices = [];
  saveCapabilities(pack, capabilities);
}

function testOptions(template: string) {
  return { templatePath: template };
}

function check(pack: string, template: string): StyleCheckResult {
  return validateStylePack(pack, testOptions(template));
}

function assertNamed(result: StyleCheckResult, rule: string): void {
  assert.equal(result.status, "DRAFT", `expected DRAFT, got ${result.statusLine}`);
  assert.ok(
    result.hardFailures.some((failure) => failure.rule === rule),
    `expected a "${rule}" hard failure, got: ${result.hardFailures
      .map((failure) => failure.rule)
      .join(", ")}`,
  );
}

// ---------------------------------------------------------------------------
// A small, self-contained valid pack
// ---------------------------------------------------------------------------

const PALETTE_HEXES = [
  "#f7f1e6",
  "#211b18",
  "#c8452e",
  "#c9a227",
  "#e8c9c2",
  "#3a2e28",
];

function cardHtml(): string {
  const chips = PALETTE_HEXES.map((hex) => `<span>${hex}</span>`).join("");
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Test Style 0.1.0</title>
<style>
@font-face { font-family: "Test Display"; src: url("fonts/TestDisplay.woff2") format("woff2"); }
@font-face { font-family: "Test Body"; src: url("../fonts/TestBody.woff2") format("woff2"); }
@font-face { font-family: "Test Caption"; src: url('TestCaption.woff2') format("woff2"); }
</style>
</head>
<body>
<section id="hero"><h1>Test Style</h1><p>Version 0.1.0</p></section>
<section id="legend">REFERENCE SPECIMEN ANTI</section>
<section id="visuals">A reference and an anti.</section>
<section id="palette">${chips}</section>
<section id="type">Display and body at relative size.</section>
<section id="motion">Six second CSS loop.</section>
<section id="sound">Solo piano.</section>
<section id="rules">Five observable rules.</section>
<section id="fit">1:1 and 16:9.</section>
<section id="proof">Status: declared.</section>
<section id="signoff"><span data-status>REVIEWABLE</span><span data-waiting>Waiting for review.</span><span data-signoff>UNSIGNED</span></section>
</body>
</html>
`;
}

const STYLE_MARKDOWN = `# Test Style

**Status:** reviewable

## Signature
- **Shot:** a still square page held for five seconds.
- **Transition:** page_turn at the end of every spread.
- **Texture:** paper fibre at twelve percent.

## Refusals
- no neon
- no gloss
- no 3d
- no lens flare
- no handheld

## Not for
- sports
- tech launches
- fashion

## Questions
- None yet.
`;

function tokens(): Record<string, unknown> {
  return {
    medium: {
      brush: "dry brush",
      material: "cotton paper",
      light: { direction: "top-left", softness: 0.6, opacity: 0.2 },
      texture: 0.3,
      layerOrder: ["paper", "ink", "shadow"],
    },
    color: {
      palettes: {
        warm: {
          paper: "#f7f1e6",
          ink: "#211b18",
          accent: "#c8452e",
          metal: "#c9a227",
          soft: "#e8c9c2",
          shadow: "#3a2e28",
        },
        cool: {
          paper: "#f4f1e9",
          ink: "#252520",
          accent: "#8a9a7b",
          metal: "#b99a5b",
          soft: "#e3c7c1",
          shadow: "#33352c",
        },
      },
      roles: ["paper", "ink", "accent", "metal", "soft", "shadow"],
      default: "warm",
      maxColours: 6,
    },
    type: {
      families: [
        {
          role: "display",
          name: "Test Display",
          file: "TestDisplay.woff2",
          licence: "SIL Open Font License 1.1",
        },
        {
          role: "body",
          name: "Test Body",
          file: "TestBody.woff2",
          licence: "SIL Open Font License 1.1",
        },
        {
          role: "caption",
          name: "Test Caption",
          file: "TestCaption.woff2",
          licence: "SIL Open Font License 1.1",
        },
      ],
      scale: { display: 72, body: 24, caption: 16 },
    },
    layout: {
      shapes: ["rect", "arch"],
      margins: { top: 0.08, right: 0.08, bottom: 0.08, left: 0.08 },
      safeZones: ["title-safe"],
      maxWords: 12,
    },
    motion: {
      timing: { bpm: 90, offset: 0, bar: 4 },
      camera: { moves: ["static", "push_in"], default: "static" },
      easings: ["linear", "easeOut"],
      physics: ["ease", "none"],
      transitions: ["cut", "page_turn", "dissolve", "hold"],
      minShot: 2,
    },
    sound: { music: "solo piano" },
    seed: { seeded: ["grain"], fixed: ["palette"], jitterHz: 0 },
  };
}

function recipes(): Array<Record<string, unknown>> {
  return [
    {
      id: "recipe_open",
      beatRoles: ["open"],
      duration: { min: 2, max: 8, default: 4 },
      camera: { move: "static", from: 1, to: 1, ease: "linear" },
      slots: ["content.title"],
      assets: [],
      composition: [
        { op: "text", slot: "content.title", typeRole: "display" },
        { op: "transition", kind: "cut" },
      ],
      transitionOut: "cut",
      failureModes: ["title longer than two lines"],
    },
    {
      id: "recipe_portrait",
      beatRoles: ["portrait"],
      duration: { min: 3, max: 10, default: 6 },
      camera: { move: "push_in", from: 1, to: 1.04, ease: "easeOut" },
      slots: ["photos.hero", "content.caption"],
      assets: ["frame.archive"],
      composition: [
        { op: "image", slot: "photos.hero", frame: "frame.archive" },
        { op: "text", slot: "content.caption", typeRole: "caption" },
        { op: "transition", kind: "page_turn" },
      ],
      transitionOut: "page_turn",
      failureModes: ["photo below print resolution"],
    },
    {
      id: "recipe_detail",
      beatRoles: ["detail"],
      duration: { min: 2, max: 8, default: 5 },
      camera: { move: "static", from: 1, to: 1, ease: "linear" },
      slots: ["content.body"],
      assets: ["texture.fiber"],
      composition: [
        { op: "text", slot: "content.body", typeRole: "body" },
        { op: "effect", kind: "fiber" },
        { op: "transition", kind: "dissolve" },
      ],
      transitionOut: "dissolve",
      failureModes: ["body longer than forty words"],
    },
    {
      id: "recipe_close",
      beatRoles: ["close"],
      duration: { min: 2, max: 8, default: 4 },
      camera: { move: "static", from: 1, to: 1, ease: "linear" },
      slots: ["content.names", "content.date"],
      assets: [],
      composition: [
        { op: "text", slot: "content.names", typeRole: "display" },
        { op: "text", slot: "content.date", typeRole: "label" },
        { op: "transition", kind: "cut" },
      ],
      transitionOut: "cut",
      failureModes: ["names longer than the page"],
    },
    {
      id: "recipe_supporting",
      beatRoles: ["list"],
      duration: { min: 2, max: 8, default: 4 },
      camera: { move: "static", from: 1, to: 1, ease: "linear" },
      slots: ["photos.supporting"],
      assets: ["frame.archive"],
      composition: [
        { op: "image", slot: "photos.supporting", frame: "frame.archive" },
        { op: "transition", kind: "cut" },
      ],
      transitionOut: "cut",
      failureModes: ["supporting photo below print resolution"],
    },
  ];
}

function capabilities(
  briefHash: string,
  templateHash: string,
  contractHash: string,
): Record<string, unknown> {
  const source = (
    take: string,
    notTake: string,
    rights: string,
  ): Record<string, string> => ({
    take,
    notTake,
    rights,
  });
  return {
    identity: {
      id: "test-style",
      name: "Test Style",
      version: "0.1.0",
      family: "paper",
      status: "reviewable",
      author: "Test Author",
      licence: "CC0-1.0",
      lineage: ["template"],
      bindings: { briefHash, templateHash, contractHash },
    },
    limits: {
      aspects: ["1:1", "16:9"],
      durations: [15, 30],
      maxCast: 0,
      maxWords: 12,
    },
    adaptation: ["crop to 16:9"],
    assets: {
      grammar: "A frame is a paper shape with a printed photograph.",
      starterLibrary: [
        { id: "frame.archive", type: "frame", anchors: ["page corner"] },
        { id: "texture.fiber", type: "texture", anchors: ["paper"] },
      ],
      rigs: { notApplicable: true, reason: "No characters are built." },
    },
    runtime: {
      primitives: ["text", "image", "effect", "transition"],
    },
    evidence: {
      sources: [
        source("quiet margins", "busy collage", "public reference"),
        source("fibre close-ups", "glossy stock", "public reference"),
        source("hard cuts", "whooshes", "public reference"),
      ],
    },
    proof: {
      status: "declared",
      frames: ["recipe_open", "recipe_portrait"],
      aspects: ["1:1"],
      metrics: ["word count"],
    },
    governance: {
      owner: "Test Author",
      questions: [],
      choices: [
        {
          id: "pace",
          question: "Page-turn speed: 0.8s, 1.2s or 1.6s?",
          options: ["0.8s", "1.2s", "1.6s"],
          where: "STYLE.md > Signature",
        },
      ],
    },
    costClass: "standard",
  };
}

type BuiltPack = {
  root: string;
  pack: string;
  template: string;
};

function buildPack(): BuiltPack {
  const root = mkdtempSync(join(tmpdir(), "paper-style-contract-"));
  const pack = join(root, "pack");
  const template = join(root, "template");
  mkdirSync(pack, { recursive: true });
  mkdirSync(join(pack, "recipes"), { recursive: true });
  mkdirSync(template, { recursive: true });
  write(join(template, "marker.txt"), "template marker\n");

  write(join(pack, "BRIEF.md"), "# Test brief\n\nA tiny family archive.\n");
  write(join(pack, "STYLE.md"), STYLE_MARKDOWN);
  write(join(pack, "card.html"), cardHtml());
  writeJson(join(pack, "tokens.json"), tokens());
  for (const recipe of recipes()) {
    writeJson(join(pack, "recipes", `${String(recipe.id)}.json`), recipe);
  }

  mkdirSync(join(pack, "fonts"), { recursive: true });
  mkdirSync(join(root, "fonts"), { recursive: true });
  for (const file of ["TestDisplay.woff2", "TestBody.woff2", "TestCaption.woff2"]) {
    write(join(pack, file), "test font\n");
  }
  write(join(pack, "fonts", "TestDisplay.woff2"), "test font\n");
  write(join(root, "fonts", "TestBody.woff2"), "test font\n");

  const briefHash = hashFile(join(pack, "BRIEF.md"));
  const templateHash = computeTemplateHash(template);
  const contractHash = computeContractHash();
  writeJson(
    join(pack, "capabilities.json"),
    capabilities(briefHash, templateHash, contractHash),
  );

  return { root, pack, template };
}

// ---------------------------------------------------------------------------
// Validator: valid pack and report
// ---------------------------------------------------------------------------

test("the dimension table has exactly the 27 spec rows", () => {
  assert.equal(STYLE_DIMENSIONS.length, 27);
  assert.deepEqual(
    STYLE_DIMENSIONS.map((dimension) => dimension.id),
    Array.from({ length: 27 }, (_, index) => `D${String(index + 1).padStart(2, "0")}`),
  );
  const notApplicable = STYLE_DIMENSIONS.filter(
    (dimension) => dimension["n/aAllowed"],
  );
  assert.deepEqual(
    notApplicable.map((dimension) => dimension.id),
    ["D10", "D11", "D15"],
  );
});

test("a pack with a cast must declare identity", () => {
  const { pack, template } = buildPack();
  const capabilities = readJson(join(pack, "capabilities.json")) as {
    limits: { maxCast: number };
  };
  capabilities.limits.maxCast = 2;
  writeJson(join(pack, "capabilities.json"), capabilities);
  const result = check(pack, template);
  assertNamed(result, "identity-missing");
});

test("a cast pack with no filmBands names the one gap", () => {
  const { pack, template } = buildPack();
  const capabilities = readJson(join(pack, "capabilities.json")) as {
    limits: { maxCast: number };
  };
  capabilities.limits.maxCast = 2;
  writeJson(join(pack, "capabilities.json"), capabilities);
  const tokens = readJson(join(pack, "tokens.json")) as Record<string, unknown>;
  const templateTokens = readJson(
    join(process.cwd(), "styles", "_template", "tokens.json"),
  ) as Record<string, unknown>;
  tokens.identity = templateTokens.identity;
  writeJson(join(pack, "tokens.json"), tokens);
  const result = check(pack, template);
  assertNamed(result, "identity-gap");
});

test("a complete pack is REVIEWABLE with no hard failures", () => {
  const { pack, template } = buildPack();
  const result = check(pack, template);
  assert.equal(result.status, "REVIEWABLE");
  assert.equal(result.hardFailures.length, 0);
  assert.equal(result.warnings.length, 0);
  assert.equal(result.profile.length, 11);
  assert.ok(result.profile.every((layer) => layer.passed));
  assert.equal(result.chosen.length, 1);
});

test("the human report has the required sections", () => {
  const { pack, template } = buildPack();
  const report = formatStyleReport(check(pack, template));
  assert.match(report, /^STYLE: test-style 0\.1\.0/);
  assert.match(report, /^STATUS: REVIEWABLE/m);
  assert.match(report, /^BEFORE YOU APPROVE \(mechanical, 0\)/m);
  assert.match(report, /^YOU MUST CHOOSE \(taste, 1\)/m);
  assert.match(report, /^WORTH KNOWING \(0\)/m);
  assert.match(report, /^WHAT I COULD NOT CHECK$/m);
  assert.match(report, /^OPEN THE CARD: /m);
  assert.match(report, /npm run style:approve -- test-style --by "Your Name"/);
  assert.match(report, /^NEXT: paste everything above into your LLM and say$/m);
  assert.doesNotMatch(report, /\n\s+at /);
});

test("exit code is 1 on hard failures, except the template", () => {
  const valid = buildPack();
  const validResult = check(valid.pack, valid.template);
  assert.equal(styleExitCode(validResult, valid.pack), 0);

  const broken = buildPack();
  const value = readTokens(broken.pack);
  delete (value.medium as unknown as Record<string, unknown>).brush;
  saveTokens(broken.pack, value);
  const brokenResult = check(broken.pack, broken.template);
  assert.equal(styleExitCode(brokenResult, broken.pack), 1);
  assert.equal(
    styleExitCode(brokenResult, join(broken.root, "_template")),
    0,
  );
});

// ---------------------------------------------------------------------------
// Mutation suite: one named failure per acceptance case
// ---------------------------------------------------------------------------

test("mutation 1: missing required decision", () => {
  const { pack, template } = buildPack();
  const value = readTokens(pack);
  delete (value.medium as unknown as Record<string, unknown>).brush;
  saveTokens(pack, value);
  const result = check(pack, template);
  assertNamed(result, "required-dimension");
  assert.ok(result.hardFailures.some((failure) => failure.message.includes("D01")));
});

test("mutation 2: literal name or date in tokens or recipes", () => {
  const dated = buildPack();
  const datedTokens = readTokens(dated.pack) as unknown as Record<string, unknown>;
  datedTokens.date = "2026-11-14";
  saveTokens(dated.pack, datedTokens as unknown as StyleTokens);
  assertNamed(check(dated.pack, dated.template), "content-free");

  const named = buildPack();
  const namedTokens = readTokens(named.pack) as unknown as Record<string, unknown>;
  namedTokens.names = "Ada & Ben";
  saveTokens(named.pack, namedTokens as unknown as StyleTokens);
  assertNamed(check(named.pack, named.template), "content-free");

  const copied = buildPack();
  const recipe = readRecipe(copied.pack, "recipe_open");
  const textOp = recipe.composition[0] as unknown as Record<string, unknown>;
  textOp.text = "Ada & Ben";
  saveRecipe(copied.pack, recipe);
  assertNamed(check(copied.pack, copied.template), "content-free");
});

test("mutation 3: engine term in tokens or recipes", () => {
  const { pack, template } = buildPack();
  const value = readTokens(pack) as unknown as Record<string, unknown>;
  value.renderer = "THREE.WebGLRenderer";
  saveTokens(pack, value as unknown as StyleTokens);
  assertNamed(check(pack, template), "engine-free");
});

test("mutation 4: broken recipe-to-asset reference", () => {
  const { pack, template } = buildPack();
  const recipe = readRecipe(pack, "recipe_portrait");
  recipe.assets.push("frame.missing");
  saveRecipe(pack, recipe);
  assertNamed(check(pack, template), "asset-reference");
});

test("mutation 5: unknown slot", () => {
  const { pack, template } = buildPack();
  const recipe = readRecipe(pack, "recipe_open");
  recipe.slots.push("content.unknown" as Slot);
  saveRecipe(pack, recipe);
  assertNamed(check(pack, template), "slot-vocabulary");
});

test("mutation 6: invalid transition", () => {
  const { pack, template } = buildPack();
  const recipe = readRecipe(pack, "recipe_open");
  recipe.transitionOut = "spin" as Transition;
  saveRecipe(pack, recipe);
  const result = check(pack, template);
  assertNamed(result, "transition-allowed");
});

test("mutation 7: capability/recipe mismatch", () => {
  const { pack, template } = buildPack();
  const value = readCapabilities(pack);
  value.runtime.primitives = value.runtime.primitives.filter(
    (primitive) => primitive !== "text",
  );
  saveCapabilities(pack, value);
  assertNamed(check(pack, template), "capability-recipe");
});

test("mutation 8: missing seed policy", () => {
  const { pack, template } = buildPack();
  const value = readTokens(pack);
  delete (value as unknown as Record<string, unknown>).seed;
  saveTokens(pack, value);
  assertNamed(check(pack, template), "seed-policy");
});

test("mutation 9: missing card section", () => {
  const { pack, template } = buildPack();
  const card = readFileSync(join(pack, "card.html"), "utf8").replace(
    'id="proof"',
    'id="proof-removed"',
  );
  write(join(pack, "card.html"), card);
  const result = check(pack, template);
  assertNamed(result, "card-section");
  assert.ok(
    result.hardFailures.some((failure) => failure.message.includes("proof")),
  );
});

test("mutation 10: brief hash mismatch", () => {
  const { pack, template } = buildPack();
  write(join(pack, "BRIEF.md"), `${readFileSync(join(pack, "BRIEF.md"), "utf8")}changed\n`);
  assertNamed(check(pack, template), "brief-hash");
});

test("mutation 11: change after approval returns REVIEWABLE", () => {
  const { pack, template } = buildPack();
  clearChoices(pack);
  const approved = approveStylePack(pack, "Test", "2026-01-01", testOptions(template));
  assert.equal(approved.approved, true);
  assert.equal(approved.result.status, "APPROVED");
  assert.equal(approved.signoff?.by, "Test");
  assert.equal(approved.signoff?.date, "2026-01-01");
  assert.equal(approved.signoff?.packHash, approved.result.packHash);
  assert.match(
    readFileSync(join(pack, "card.html"), "utf8"),
    /Test · 2026-01-01/,
  );
  assert.match(
    readFileSync(join(pack, "STYLE.md"), "utf8"),
    /^\*\*Status:\*\* approved$/m,
  );
  assert.equal(
    (readJson(join(pack, "capabilities.json")) as {
      identity: { status: string };
    }).identity.status,
    "approved",
  );

  write(
    join(pack, "STYLE.md"),
    `${readFileSync(join(pack, "STYLE.md"), "utf8")}\nA later edit.\n`,
  );

  const result = check(pack, template);
  assert.equal(result.status, "REVIEWABLE");
  assert.match(result.statusLine, /changed after approval/);
  assert.match(
    formatStyleReport(result),
    /^STATUS: REVIEWABLE — changed after approval$/m,
  );
  const stale = result.warnings.find((warning) => warning.rule === "signoff-stale");
  assert.ok(stale);
  assert.equal(stale.where, "pack");
});

test("named vocabulary rules fail on their own terms", () => {
  const cases: Array<{
    name: string;
    mutate: (pack: string) => void;
    rule: string;
  }> = [
    {
      name: "effect",
      rule: "effect",
      mutate: (pack) => {
        const recipe = readRecipe(pack, "recipe_detail");
        const effect = recipe.composition.find((op) => op.op === "effect");
        if (effect && effect.op === "effect") {
          (effect as unknown as Record<string, unknown>).kind = "sparkle";
        }
        saveRecipe(pack, recipe);
      },
    },
    {
      name: "camera move",
      rule: "camera-move",
      mutate: (pack) => {
        const recipe = readRecipe(pack, "recipe_portrait");
        (recipe.camera as unknown as Record<string, unknown>).move = "zoom";
        saveRecipe(pack, recipe);
      },
    },
    {
      name: "easing",
      rule: "easing",
      mutate: (pack) => {
        const recipe = readRecipe(pack, "recipe_portrait");
        (recipe.camera as unknown as Record<string, unknown>).ease = "bounce";
        saveRecipe(pack, recipe);
      },
    },
    {
      name: "physics",
      rule: "physics",
      mutate: (pack) => {
        const value = readTokens(pack);
        (value.motion as unknown as Record<string, unknown>).physics = ["float"];
        saveTokens(pack, value);
      },
    },
    {
      name: "type role",
      rule: "type-role",
      mutate: (pack) => {
        const value = readTokens(pack);
        (value.type.families[0] as unknown as Record<string, unknown>).role = "hero";
        saveTokens(pack, value);
      },
    },
    {
      name: "beat role",
      rule: "beat-role",
      mutate: (pack) => {
        const recipe = readRecipe(pack, "recipe_open");
        recipe.beatRoles = ["begin" as never];
        saveRecipe(pack, recipe);
      },
    },
    {
      name: "op",
      rule: "op",
      mutate: (pack) => {
        const raw = readJson(join(pack, "recipes", "recipe_open.json")) as Record<
          string,
          unknown
        >;
        const composition = raw.composition as Array<Record<string, unknown>>;
        composition[0] = { op: "sparkle" };
        writeJson(join(pack, "recipes", "recipe_open.json"), raw);
      },
    },
  ];

  for (const testCase of cases) {
    const { pack, template } = buildPack();
    testCase.mutate(pack);
    const result = check(pack, template);
    assertNamed(result, testCase.rule);
  }
});

test("a missing data-signoff element is a hard failure", () => {
  const { pack, template } = buildPack();
  const card = readFileSync(join(pack, "card.html"), "utf8").replace(
    /<span data-signoff>UNSIGNED<\/span>/,
    "UNSIGNED",
  );
  write(join(pack, "card.html"), card);
  assertNamed(check(pack, template), "card-signoff");
});

test("the card requires data-status, data-waiting and data-signoff markers", () => {
  const cases: Array<{ marker: string; rule: string }> = [
    { marker: "data-status", rule: "card-status-marker" },
    { marker: "data-waiting", rule: "card-waiting-marker" },
    { marker: "data-signoff", rule: "card-signoff" },
  ];
  for (const testCase of cases) {
    const { pack, template } = buildPack();
    const card = readFileSync(join(pack, "card.html"), "utf8").replace(
      new RegExp(`<span ${testCase.marker}>[^<]*</span>`),
      "",
    );
    write(join(pack, "card.html"), card);
    const result = check(pack, template);
    assertNamed(result, testCase.rule);
    assert.ok(
      result.hardFailures.some((failure) =>
        failure.message.includes(testCase.marker),
      ),
    );
  }
});

test("the card needs an @font-face rule for every declared type family file", () => {
  const missing = buildPack();
  const stripped = readFileSync(join(missing.pack, "card.html"), "utf8").replace(
    /@font-face \{[^}]*\}\n/g,
    "",
  );
  write(join(missing.pack, "card.html"), stripped);
  const missingResult = check(missing.pack, missing.template);
  assertNamed(missingResult, "card-font");
  assert.equal(
    missingResult.hardFailures.filter((failure) => failure.rule === "card-font")
      .length,
    3,
  );
  assert.ok(
    missingResult.hardFailures.some((failure) =>
      failure.message.includes("TestBody.woff2"),
    ),
  );

  const basenames = buildPack();
  const basenameCard = readFileSync(join(basenames.pack, "card.html"), "utf8")
    .replace('url("fonts/TestDisplay.woff2")', 'url("TestDisplay.woff2")')
    .replace('url("../fonts/TestBody.woff2")', 'url("TestBody.woff2")')
    .replace("url('TestCaption.woff2')", 'url("TestCaption.woff2")');
  write(join(basenames.pack, "card.html"), basenameCard);
  const basenameResult = check(basenames.pack, basenames.template);
  assert.equal(basenameResult.hardFailures.length, 0);
});

test("a declared @font-face URL must resolve to an existing file", () => {
  const { pack, template } = buildPack();
  const card = readFileSync(join(pack, "card.html"), "utf8").replace(
    'url("fonts/TestDisplay.woff2")',
    'url("fonts/missing/TestDisplay.woff2")',
  );
  write(join(pack, "card.html"), card);
  const result = check(pack, template);
  assert.ok(
    result.hardFailures.some(
      (failure) =>
        failure.rule === "card-font" &&
        failure.message.includes("does not resolve"),
    ),
  );
});

test("an external @font-face URL is a hard failure", () => {
  const { pack, template } = buildPack();
  const card = readFileSync(join(pack, "card.html"), "utf8").replace(
    'url("fonts/TestDisplay.woff2")',
    'url("https://example.com/TestDisplay.woff2")',
  );
  write(join(pack, "card.html"), card);
  const result = check(pack, template);
  assert.ok(
    result.hardFailures.some(
      (failure) =>
        failure.rule === "card-font" &&
        failure.message.includes("external URL"),
    ),
  );
});

test("an external script or stylesheet is a hard failure", () => {
  const { pack, template } = buildPack();
  const card = readFileSync(join(pack, "card.html"), "utf8").replace(
    "</head>",
    '<script src="https://example.com/x.js"></script></head>',
  );
  write(join(pack, "card.html"), card);
  const result = check(pack, template);
  assertNamed(result, "card-dependency");
});

test("an undeclared external @font-face used on the page is a hard failure", () => {
  const { pack, template } = buildPack();
  const card = readFileSync(join(pack, "card.html"), "utf8")
    .replace(
      "</style>",
      '@font-face { font-family: "Evil"; src: url("https://example.com/Evil.woff2"); }</style>',
    )
    .replace("<h1>", '<h1 style="font-family: Evil">');
  write(join(pack, "card.html"), card);
  const result = check(pack, template);
  assert.ok(
    result.hardFailures.some(
      (failure) =>
        failure.rule === "card-font" &&
        failure.message.includes("external URL"),
    ),
  );
});

test("an external @import is a hard failure", () => {
  const { pack, template } = buildPack();
  const card = readFileSync(join(pack, "card.html"), "utf8").replace(
    "</style>",
    '@import url("https://example.com/x.css");</style>',
  );
  write(join(pack, "card.html"), card);
  const result = check(pack, template);
  assertNamed(result, "card-dependency");
});

test("group is not a primitive and cannot carry a nested asset or slot past checks", () => {
  assert.ok(!(PRIMITIVES as readonly string[]).includes("group"));
  const { pack, template } = buildPack();
  const recipe = readRecipe(pack, "recipe_portrait");
  (recipe.composition as unknown as Array<Record<string, unknown>>).unshift({
    op: "group",
    asset: "frame.missing",
    children: [{ op: "text", slot: "content.unknown" }],
  });
  saveRecipe(pack, recipe);
  const result = check(pack, template);
  assertNamed(result, "op");
  assert.ok(result.hardFailures.some((failure) => failure.rule === "schema"));
  assert.ok(
    !result.hardFailures.some(
      (failure) =>
        failure.rule === "asset-reference" ||
        failure.rule === "slot-vocabulary",
    ),
  );
});

test("D16: the Signature section requires Shot, Transition and Texture lines", () => {
  const unstructured = buildPack();
  const prose = readFileSync(join(unstructured.pack, "STYLE.md"), "utf8").replace(
    /## Signature\n[\s\S]*?\n\n## Refusals/,
    "## Signature\nno shot, no transition, no texture.\n\n## Refusals",
  );
  write(join(unstructured.pack, "STYLE.md"), prose);
  assertNamed(check(unstructured.pack, unstructured.template), "signature");

  const missingTexture = buildPack();
  const missing = readFileSync(join(missingTexture.pack, "STYLE.md"), "utf8").replace(
    "- **Texture:** paper fibre at twelve percent.\n",
    "",
  );
  write(join(missingTexture.pack, "STYLE.md"), missing);
  const missingResult = check(missingTexture.pack, missingTexture.template);
  assertNamed(missingResult, "signature");
  assert.ok(
    missingResult.hardFailures.some((failure) => failure.message.includes("Texture")),
  );

  const emptyTransition = buildPack();
  const empty = readFileSync(join(emptyTransition.pack, "STYLE.md"), "utf8").replace(
    "- **Transition:** page_turn at the end of every spread.",
    "- **Transition:**",
  );
  write(join(emptyTransition.pack, "STYLE.md"), empty);
  assertNamed(check(emptyTransition.pack, emptyTransition.template), "signature");

  const disallowed = buildPack();
  const transition = readFileSync(join(disallowed.pack, "STYLE.md"), "utf8").replace(
    "- **Transition:** page_turn at the end of every spread.",
    "- **Transition:** spin at the end of every spread.",
  );
  write(join(disallowed.pack, "STYLE.md"), transition);
  const disallowedResult = check(disallowed.pack, disallowed.template);
  assertNamed(disallowedResult, "signature");
  assert.ok(
    disallowedResult.hardFailures.some((failure) =>
      failure.message.includes("tokens.motion.transitions"),
    ),
  );
});

test("D27: the Questions section is required, and 'None yet.' is acceptable", () => {
  const { pack, template } = buildPack();
  assert.equal(check(pack, template).hardFailures.length, 0);
  const style = readFileSync(join(pack, "STYLE.md"), "utf8").replace(
    "## Questions\n- None yet.\n",
    "",
  );
  write(join(pack, "STYLE.md"), style);
  assertNamed(check(pack, template), "questions-log");
});

test("every composition op rejects literal copy, not just text ops", () => {
  const shapePack = buildPack();
  const shapeRecipe = readRecipe(shapePack.pack, "recipe_open");
  (shapeRecipe.composition as unknown as Array<Record<string, unknown>>).unshift({
    op: "shape",
    id: "caption-rule",
    label: "Ada & Ben",
  });
  saveRecipe(shapePack.pack, shapeRecipe);
  assertNamed(check(shapePack.pack, shapePack.template), "content-free");

  const datePack = buildPack();
  const dateRecipe = readRecipe(datePack.pack, "recipe_portrait");
  (dateRecipe.composition as unknown as Array<Record<string, unknown>>).unshift({
    op: "shape",
    note: "2026-05-01",
  });
  saveRecipe(datePack.pack, dateRecipe);
  assertNamed(check(datePack.pack, datePack.template), "content-free");
});

test("shape.kind literal copy fails the strict composition schema", () => {
  const { pack, template } = buildPack();
  const recipe = readRecipe(pack, "recipe_open");
  (recipe.composition as unknown as Array<Record<string, unknown>>).unshift({
    op: "shape",
    id: "caption-rule",
    kind: "Ada & Ben",
  });
  saveRecipe(pack, recipe);
  const result = check(pack, template);
  assert.equal(result.status, "DRAFT");
  assert.ok(
    result.hardFailures.some((failure) => failure.rule === "content-free"),
    `expected a content-free failure, got: ${result.hardFailures
      .map((failure) => failure.rule)
      .join(", ")}`,
  );
  assert.ok(
    result.hardFailures.some((failure) => failure.rule === "schema"),
    `expected a schema failure, got: ${result.hardFailures
      .map((failure) => failure.rule)
      .join(", ")}`,
  );
});

test("composition op schemas reject unknown layout keys", () => {
  const { pack, template } = buildPack();
  const recipe = readRecipe(pack, "recipe_open");
  (recipe.composition as unknown as Array<Record<string, unknown>>).unshift({
    op: "layer",
    id: "paper",
    text: "Ada & Ben",
  });
  saveRecipe(pack, recipe);
  assertNamed(check(pack, template), "schema");
});

test("asset and frame fields are validated on every composition op", () => {
  const assetPack = buildPack();
  const assetRecipe = readRecipe(assetPack.pack, "recipe_open");
  (assetRecipe.composition as unknown as Array<Record<string, unknown>>).unshift({
    op: "shape",
    id: "monogram",
    asset: "type.missing",
  });
  saveRecipe(assetPack.pack, assetRecipe);
  assertNamed(check(assetPack.pack, assetPack.template), "asset-reference");

  const framePack = buildPack();
  const frameRecipe = readRecipe(framePack.pack, "recipe_detail");
  (frameRecipe.composition as unknown as Array<Record<string, unknown>>).unshift({
    op: "shape",
    frame: "frame.missing",
  });
  saveRecipe(framePack.pack, frameRecipe);
  assertNamed(check(framePack.pack, framePack.template), "asset-reference");
});

test("a text op may not carry literal label, note, copy, literal, text or value", () => {
  for (const key of ["label", "note", "copy", "literal", "text", "value"]) {
    const { pack, template } = buildPack();
    const recipe = readRecipe(pack, "recipe_open");
    (recipe.composition[0] as unknown as Record<string, unknown>)[key] = "Ada & Ben";
    saveRecipe(pack, recipe);
    assertNamed(check(pack, template), "content-free");
  }
});

test("every text and image op slot must be listed in recipe.slots", () => {
  const { pack, template } = buildPack();
  const recipe = readRecipe(pack, "recipe_open");
  (recipe.composition as unknown as Array<Record<string, unknown>>).push({
    op: "text",
    slot: "content.caption",
    typeRole: "caption",
  });
  saveRecipe(pack, recipe);
  assertNamed(check(pack, template), "slot-contract");
});

test("recipe camera moves and easings must be allowed by tokens.motion", () => {
  const cameraPack = buildPack();
  const cameraTokens = readTokens(cameraPack.pack);
  cameraTokens.motion.camera = { moves: ["static"], default: "static" };
  saveTokens(cameraPack.pack, cameraTokens);
  assertNamed(check(cameraPack.pack, cameraPack.template), "camera-move");

  const easingPack = buildPack();
  const easingTokens = readTokens(easingPack.pack);
  easingTokens.motion.easings = ["linear"];
  saveTokens(easingPack.pack, easingTokens);
  assertNamed(check(easingPack.pack, easingPack.template), "easing");
});

test("recipe duration.min must be at least tokens.motion.minShot", () => {
  const { pack, template } = buildPack();
  const value = readTokens(pack);
  value.motion.minShot = 5;
  saveTokens(pack, value);
  assertNamed(check(pack, template), "duration-min");
});

test("proof.frames must name recipes and proof.aspects must fit limits", () => {
  const framesPack = buildPack();
  const frameCapabilities = readCapabilities(framesPack.pack);
  frameCapabilities.proof.frames = ["hero"];
  saveCapabilities(framesPack.pack, frameCapabilities);
  assertNamed(check(framesPack.pack, framesPack.template), "proof-frame");

  const aspectsPack = buildPack();
  const aspectCapabilities = readCapabilities(aspectsPack.pack);
  aspectCapabilities.proof.aspects = ["9:16"];
  saveCapabilities(aspectsPack.pack, aspectCapabilities);
  assertNamed(check(aspectsPack.pack, aspectsPack.template), "proof-aspect");
});

test("an approved card must agree with signoff.json and say APPROVED", () => {
  const signoffPack = buildPack();
  clearChoices(signoffPack.pack);
  const approved = approveStylePack(
    signoffPack.pack,
    "Test",
    "2026-01-01",
    testOptions(signoffPack.template),
  );
  assert.equal(approved.approved, true);
  const wrongSignoff = readFileSync(join(signoffPack.pack, "card.html"), "utf8").replace(
    "Test · 2026-01-01",
    "Someone Else · 2026-01-01",
  );
  write(join(signoffPack.pack, "card.html"), wrongSignoff);
  const firstSignoff = readJson(join(signoffPack.pack, "signoff.json")) as Record<
    string,
    unknown
  >;
  firstSignoff.packHash = computePackHash(signoffPack.pack);
  writeJson(join(signoffPack.pack, "signoff.json"), firstSignoff);
  assertNamed(check(signoffPack.pack, signoffPack.template), "card-signoff-text");

  const statusPack = buildPack();
  clearChoices(statusPack.pack);
  const statusApproved = approveStylePack(
    statusPack.pack,
    "Test",
    "2026-01-01",
    testOptions(statusPack.template),
  );
  assert.equal(statusApproved.approved, true);
  const approvedCard = readFileSync(join(statusPack.pack, "card.html"), "utf8");
  assert.match(approvedCard, /<span data-status>APPROVED<\/span>/);
  assert.match(approvedCard, /<span data-waiting>Approved 2026-01-01<\/span>/);
  assert.match(approvedCard, /<span data-signoff>Test · 2026-01-01<\/span>/);
  const wrongStatus = readFileSync(join(statusPack.pack, "card.html"), "utf8").replace(
    "<span data-status>APPROVED</span>",
    "<span data-status>REVIEWABLE</span>",
  );
  write(join(statusPack.pack, "card.html"), wrongStatus);
  const secondSignoff = readJson(join(statusPack.pack, "signoff.json")) as Record<
    string,
    unknown
  >;
  secondSignoff.packHash = computePackHash(statusPack.pack);
  writeJson(join(statusPack.pack, "signoff.json"), secondSignoff);
  assertNamed(check(statusPack.pack, statusPack.template), "card-status");
});

test("approval refuses a card missing data-status or data-waiting", () => {
  const cases: Array<{ marker: string; rule: string }> = [
    { marker: "data-status", rule: "card-status-marker" },
    { marker: "data-waiting", rule: "card-waiting-marker" },
  ];
  for (const testCase of cases) {
    const { pack, template } = buildPack();
    clearChoices(pack);
    const card = readFileSync(join(pack, "card.html"), "utf8").replace(
      new RegExp(`<span ${testCase.marker}>[^<]*</span>`),
      "",
    );
    write(join(pack, "card.html"), card);
    const outcome = approveStylePack(
      pack,
      "Test",
      "2026-01-01",
      testOptions(template),
    );
    assert.equal(outcome.approved, false);
    assert.equal(existsSync(join(pack, "signoff.json")), false);
    assert.ok(
      outcome.result.hardFailures.some(
        (failure) => failure.rule === testCase.rule,
      ),
    );
  }
});

test("approval rewrites every data-status, data-waiting and data-signoff marker", () => {
  const { pack, template } = buildPack();
  clearChoices(pack);
  const doubled = readFileSync(join(pack, "card.html"), "utf8").replace(
    '<section id="proof">Status: declared.</section>',
    '<section id="proof">Status: declared. <span data-status>DRAFT</span><span data-waiting>Draft</span></section>',
  );
  write(join(pack, "card.html"), doubled);
  const outcome = approveStylePack(
    pack,
    "Test",
    "2026-01-01",
    testOptions(template),
  );
  assert.equal(outcome.approved, true);
  const approvedCard = readFileSync(join(pack, "card.html"), "utf8");
  assert.equal((approvedCard.match(/data-status>APPROVED</g) ?? []).length, 2);
  assert.equal(
    (approvedCard.match(/data-waiting>Approved 2026-01-01</g) ?? []).length,
    2,
  );
  assert.equal(
    (approvedCard.match(/data-signoff>Test · 2026-01-01</g) ?? []).length,
    1,
  );
});

test("an APPROVED pack whose card lost its data-status marker hard-fails", () => {
  const { pack, template } = buildPack();
  clearChoices(pack);
  assert.equal(
    approveStylePack(pack, "Test", "2026-01-01", testOptions(template)).approved,
    true,
  );
  const card = readFileSync(join(pack, "card.html"), "utf8").replace(
    /<span data-status>APPROVED<\/span>/,
    "",
  );
  write(join(pack, "card.html"), card);
  const signoff = readJson(join(pack, "signoff.json")) as Record<string, unknown>;
  signoff.packHash = computePackHash(pack);
  writeJson(join(pack, "signoff.json"), signoff);
  const result = check(pack, template);
  assertNamed(result, "card-status-marker");
  assert.ok(
    result.hardFailures.some((failure) => failure.rule === "status-consistency"),
  );
});

test("status must agree across the card, STYLE.md and identity.status", () => {
  const stylePack = buildPack();
  clearChoices(stylePack.pack);
  assert.equal(
    approveStylePack(
      stylePack.pack,
      "Test",
      "2026-01-01",
      testOptions(stylePack.template),
    ).approved,
    true,
  );
  write(
    join(stylePack.pack, "STYLE.md"),
    readFileSync(join(stylePack.pack, "STYLE.md"), "utf8").replace(
      "**Status:** approved",
      "**Status:** reviewable",
    ),
  );
  const styleSignoff = readJson(join(stylePack.pack, "signoff.json")) as Record<
    string,
    unknown
  >;
  styleSignoff.packHash = computePackHash(stylePack.pack);
  writeJson(join(stylePack.pack, "signoff.json"), styleSignoff);
  assertNamed(
    check(stylePack.pack, stylePack.template),
    "status-consistency",
  );

  const identityPack = buildPack();
  clearChoices(identityPack.pack);
  assert.equal(
    approveStylePack(
      identityPack.pack,
      "Test",
      "2026-01-01",
      testOptions(identityPack.template),
    ).approved,
    true,
  );
  const identityCapabilities = readCapabilities(identityPack.pack);
  identityCapabilities.identity.status = "reviewable";
  saveCapabilities(identityPack.pack, identityCapabilities);
  const identitySignoff = readJson(
    join(identityPack.pack, "signoff.json"),
  ) as Record<string, unknown>;
  identitySignoff.packHash = computePackHash(identityPack.pack);
  writeJson(join(identityPack.pack, "signoff.json"), identitySignoff);
  assertNamed(
    check(identityPack.pack, identityPack.template),
    "status-consistency",
  );
});

test("declaring approval without signoff.json is a hard failure", () => {
  const { pack, template } = buildPack();
  write(
    join(pack, "STYLE.md"),
    readFileSync(join(pack, "STYLE.md"), "utf8").replace(
      "**Status:** reviewable",
      "**Status:** approved",
    ),
  );
  const value = readCapabilities(pack);
  value.identity.status = "approved";
  saveCapabilities(pack, value);
  const result = check(pack, template);
  assertNamed(result, "status-consistency");
  assert.ok(
    result.hardFailures.some((failure) =>
      failure.message.includes("signoff.json"),
    ),
  );
});

test("a card that says APPROVED in a reviewable pack is a hard failure", () => {
  const { pack, template } = buildPack();
  const card = readFileSync(join(pack, "card.html"), "utf8").replace(
    '<span data-signoff>UNSIGNED</span>',
    '<span data-status>APPROVED</span><span data-signoff>UNSIGNED</span>',
  );
  write(join(pack, "card.html"), card);
  const result = check(pack, template);
  assertNamed(result, "status-consistency");
  assert.equal(existsSync(join(pack, "signoff.json")), false);
});

test("answered or resolved taste choices are not printed", () => {
  const { pack, template } = buildPack();
  const value = readCapabilities(pack);
  value.governance.choices = [
    { id: "open", question: "Open?", options: ["a", "b"] },
    { id: "resolved", question: "Resolved?", resolved: true },
    { id: "answered", question: "Answered?", answer: 1 },
    { id: "decided", question: "Decided?", decidedBy: { name: "Someone" } },
  ];
  saveCapabilities(pack, value);
  const result = check(pack, template);
  assert.equal(result.chosen.length, 1);
  assert.equal(result.chosen[0]?.id, "open");
});

test("approval refuses while a taste choice is still open", () => {
  const { pack, template } = buildPack();
  assert.equal(check(pack, template).chosen.length, 1);
  const outcome = approveStylePack(pack, "Test", "2026-01-01", testOptions(template));
  assert.equal(outcome.approved, false);
  assert.equal(existsSync(join(pack, "signoff.json")), false);
  assert.equal(outcome.result.status, "REVIEWABLE");
  assert.match(outcome.result.statusLine, /waiting for your eyes/);
});

test("governance.decisions cannot close an open page-turn choice", () => {
  const { pack, template } = buildPack();
  const value = readCapabilities(pack);
  value.governance.choices = [
    {
      id: "page-turn",
      question: "Page-turn speed: 1.2s or 1.6s?",
      options: ["1.2s", "1.6s"],
      where: "STYLE.md > Signature",
    },
  ];
  value.governance.decisions = [
    {
      id: "page-turn",
      question: "Page-turn speed: 1.2s or 1.6s?",
      answer: "1.6s",
      decidedBy: "Test Author",
      decidedAt: "2026-01-01",
    },
  ];
  saveCapabilities(pack, value);

  const result = check(pack, template);
  assert.equal(result.chosen.length, 1);
  assert.match(result.chosen[0]?.question ?? "", /Page-turn speed/);

  const outcome = approveStylePack(
    pack,
    "Test",
    "2026-01-01",
    testOptions(template),
  );
  assert.equal(outcome.approved, false);
  assert.equal(existsSync(join(pack, "signoff.json")), false);
  const report = formatStyleReport(outcome.result);
  assert.match(report, /^YOU MUST CHOOSE \(taste, 1\)$/m);
  assert.match(report, /Page-turn speed: 1\.2s or 1\.6s\?/);
});

test("an approved report names the signer and omits the approve command", () => {
  const { pack, template } = buildPack();
  clearChoices(pack);
  const approved = approveStylePack(pack, "Test", "2026-01-01", testOptions(template));
  assert.equal(approved.approved, true);
  const report = formatStyleReport(approved.result);
  assert.match(report, /^STATUS: APPROVED — signed by Test on 2026-01-01$/m);
  assert.doesNotMatch(report, /npm run style:approve/);
  assert.match(report, /SIGNED: Test · 2026-01-01/);
});

test("style:approve's lookup finds keepsake under styles/_examples", () => {
  const stylesRoot = join(process.cwd(), "styles");
  const found = findStyleDirectory(stylesRoot, "keepsake");
  assert.equal(found, join(stylesRoot, "_examples", "keepsake"));
});

test("findStyleDirectory prefers a direct styles/<id> over a nested pack", () => {
  const root = mkdtempSync(join(tmpdir(), "paper-style-find-"));
  const direct = join(root, "keepsake");
  const nested = join(root, "_examples", "keepsake");
  mkdirSync(direct, { recursive: true });
  mkdirSync(nested, { recursive: true });
  writeJson(join(direct, "capabilities.json"), { identity: { id: "keepsake" } });
  writeJson(join(nested, "capabilities.json"), { identity: { id: "keepsake" } });
  assert.equal(findStyleDirectory(root, "keepsake"), direct);
});

function buildSealRoot(): {
  root: string;
  sealPath: string;
} {
  const root = mkdtempSync(join(tmpdir(), "paper-style-seal-"));
  mkdirSync(join(root, "_template", "recipes"), { recursive: true });
  mkdirSync(join(root, "validator", "src", "core"), { recursive: true });
  mkdirSync(join(root, "validator", "scripts"), { recursive: true });
  write(join(root, "_template", "BRIEF.md"), "template brief\n");
  write(join(root, "brief.md"), "frozen brief\n");
  write(join(root, "prompt.md"), "blind author prompt\n");
  write(join(root, "STYLE-AUTHORING.md"), "authoring guide\n");
  write(join(root, "validator", "src", "core", "style.ts"), "// core\n");
  write(join(root, "validator", "scripts", "style.ts"), "// cli\n");
  write(join(root, "validator", "package.json"), "{}\n");
  write(join(root, "validator", "tsconfig.json"), "{}\n");
  mkdirSync(join(root, "validator", "node_modules", "zod"), { recursive: true });
  write(join(root, "validator", "node_modules", "zod", "index.js"), "// dep\n");
  write(join(root, "validator", "package-lock.json"), "{}\n");

  const sealedFiles = [
    "_template/BRIEF.md",
    "brief.md",
    "prompt.md",
    "STYLE-AUTHORING.md",
    "validator/package.json",
    "validator/tsconfig.json",
    "validator/scripts/style.ts",
    "validator/src/core/style.ts",
  ];
  const files: Record<string, string> = {};
  for (const file of sealedFiles) {
    files[file] = hashFile(join(root, ...file.split("/")));
  }
  const seal = {
    version: 1,
    createdAt: "2026-01-01T00:00:00.000Z",
    templateHash: computeTemplateHash(join(root, "_template")),
    contractHash: computeContractHash(),
    briefHash: hashFile(join(root, "brief.md")),
    authoringHash: hashFile(join(root, "STYLE-AUTHORING.md")),
    promptHash: hashFile(join(root, "prompt.md")),
    validatorHash: computeValidatorHash(join(root, "validator")),
    files,
  };
  const sealPath = join(root, "SEAL.json");
  writeJson(sealPath, seal);
  return { root, sealPath };
}

test("a matching seal has no problems and ignores node_modules", () => {
  const { root, sealPath } = buildSealRoot();
  const seal = readStyleSeal(sealPath);
  assert.deepEqual(checkSealedRun(root, seal), []);
  assert.ok(!Object.keys(seal.files).some((file) => file.includes("node_modules")));
  assert.ok(!Object.keys(seal.files).includes("validator/package-lock.json"));

  write(join(root, "extra.txt"), "not sealed\n");
  assert.ok(
    checkSealedRun(root, seal).some((problem) =>
      problem.includes("sealed file set changed: extra.txt"),
    ),
  );
});

test("seal --force preserves an existing pack unless --discard-pack is passed", () => {
  const root = mkdtempSync(join(tmpdir(), "paper-style-seal-pack-"));
  const target = join(root, "gate", "blind");
  mkdirSync(join(target, "pack", "recipes"), { recursive: true });
  write(join(target, "pack", "STYLE.md"), "authored pack\n");
  write(join(target, "pack", "recipes", "page.json"), "{}\n");
  write(join(target, "README.md"), "old scaffold\n");

  assert.throws(
    () => resetSealTarget(target, { force: false, discardPack: false }),
    /--force/,
  );

  const preserved = resetSealTarget(target, { force: true, discardPack: false });
  assert.equal(preserved.preservedPack, true);
  assert.equal(
    readFileSync(join(target, "pack", "STYLE.md"), "utf8"),
    "authored pack\n",
  );
  assert.ok(existsSync(join(target, "pack", "recipes", "page.json")));
  assert.equal(existsSync(join(target, "README.md")), false);

  const discarded = resetSealTarget(target, { force: true, discardPack: true });
  assert.equal(discarded.preservedPack, false);
  assert.equal(existsSync(join(target, "pack")), false);
});

test("an unparseable SEAL.json hard-fails instead of returning {}", () => {
  const { root, sealPath } = buildSealRoot();
  write(sealPath, "{ this is not json");
  assert.throws(() => readStyleSeal(sealPath), /cannot be parsed/);
  assert.ok(root.length > 0);
});

test("a changed sealed file or hash invalidates the run", () => {
  const { root, sealPath } = buildSealRoot();
  const seal = readStyleSeal(sealPath);
  write(join(root, "prompt.md"), "a different prompt\n");
  const promptProblems = checkSealedRun(root, seal);
  assert.ok(
    promptProblems.some(
      (problem) =>
        problem.includes("sealed run invalidated") &&
        problem.includes("promptHash"),
    ),
  );
  assert.ok(
    promptProblems.some((problem) =>
      problem.includes("sealed file changed: prompt.md"),
    ),
  );

  const { root: contractRoot, sealPath: contractSealPath } = buildSealRoot();
  const staleContract = {
    ...readStyleSeal(contractSealPath),
    contractHash: `sha256:${"0".repeat(64)}`,
  };
  const contractProblems = checkSealedRun(contractRoot, staleContract);
  assert.ok(
    contractProblems.some(
      (problem) =>
        problem.includes("sealed run invalidated") &&
        problem.includes("contractHash"),
    ),
  );
});

// ---------------------------------------------------------------------------
// Resolver
// ---------------------------------------------------------------------------

const BRIEF_A: GenericBrief = {
  content: {
    title: "A family archive",
    subtitle: "Fifty years in one box",
    names: "Ada & Ben",
    date: "2026-05-01",
    venue: "The Hall",
    body: "A body of family history.",
    caption: "At the kitchen table.",
    hashtag: "#archive",
    rsvp: "rsvp@example.com",
    monogram: "AB",
  },
  photos: { hero: "hero.jpg", supporting: ["one.jpg", "two.jpg"] },
};

const BRIEF_B: GenericBrief = {
  content: {
    title: "A different box",
    subtitle: "Another story",
    names: "Cora & Dev",
    date: "2027-09-12",
    venue: "The Garden",
    body: "A different body of history.",
    caption: "On the porch.",
    hashtag: "#other",
    rsvp: "hello@example.com",
    monogram: "CD",
  },
  photos: { hero: "other-hero.jpg", supporting: ["three.jpg"] },
};

const FORMAT_A: ResolveFormat = {
  id: "book",
  name: "Book",
  beatRoleMap: { open: "open", portrait: "portrait", close: "close" },
  durations: [15, 30],
  aspects: ["1:1", "16:9"],
  primaryAspect: "1:1",
};

const FORMAT_B: ResolveFormat = {
  id: "zine",
  name: "Zine",
  beatRoleMap: { open: ["open", "title"], detail: "detail", close: "close" },
  durations: [15, 30],
  aspects: ["16:9", "1:1"],
  primaryAspect: "16:9",
};

const FORMAT_SEQUENCE: ResolveFormat = {
  id: "sequenced",
  name: "Sequenced",
  beatRoleMap: {
    cover: "open",
    spread: "portrait",
    detail: "detail",
    close: "close",
  },
  sequence: [
    { beat: "cover", role: "open", count: 1 },
    { beat: "spread", role: "portrait", count: 3 },
    { beat: "detail", role: "detail", count: 3 },
    { beat: "close", role: "close", count: 1 },
  ],
  durations: [30],
  aspects: ["1:1"],
  primaryAspect: "1:1",
};

function resolveWithTemplate(
  pack: ReturnType<typeof loadStylePack>,
  template: string,
  brief: GenericBrief,
  format: ResolveFormat,
  seed: number,
  options: {
    compare?: { brief: GenericBrief; format: ResolveFormat };
  } = {},
): ReturnType<typeof resolveStyle> {
  return resolveStyle(pack, brief, format, seed, {
    validation: testOptions(template),
    ...options,
  });
}

test("resolveStyle returns a deterministic plan for each seed", () => {
  const { pack, template } = buildPack();
  const loaded = loadStylePack(pack);

  const first = resolveWithTemplate(loaded, template, BRIEF_A, FORMAT_A, 42);
  const second = resolveWithTemplate(loaded, template, BRIEF_A, FORMAT_A, 42);
  assert.equal(JSON.stringify(first), JSON.stringify(second));
  assert.equal(first.shots.length, 3);
  assert.equal(first.shots[0]?.slots["content.title"], BRIEF_A.content.title);

  const other = resolveWithTemplate(loaded, template, BRIEF_A, FORMAT_A, 43);
  assert.notEqual(other.seed, first.seed);
  assert.notDeepEqual(other.variations, first.variations);
  assertSeedChanges(first, other);
});

test("two briefs and two formats produce different plans", () => {
  const { pack, template } = buildPack();
  const loaded = loadStylePack(pack);

  const first = resolveWithTemplate(loaded, template, BRIEF_A, FORMAT_A, 42);
  const second = resolveWithTemplate(loaded, template, BRIEF_B, FORMAT_B, 42, {
    compare: { brief: BRIEF_A, format: FORMAT_A },
  });

  assertBriefsDiffer(first, second);
  assert.notEqual(first.briefHash, second.briefHash);
  assert.equal(second.shots.length, 3);
  assert.ok(
    Object.values(second.shots[0]?.slots ?? {}).some((value) =>
      value.includes("different box"),
    ),
  );
});

test("photos.supporting resolves to the first supporting photo, not a joined string", () => {
  const { pack, template } = buildPack();
  const loaded = loadStylePack(pack);
  const supportingFormat: ResolveFormat = {
    ...FORMAT_A,
    id: "supporting",
    beatRoleMap: { supporting: "list" },
    sequence: [{ beat: "supporting", role: "list", count: 2 }],
  };
  const plan = resolveWithTemplate(
    loaded,
    template,
    BRIEF_A,
    supportingFormat,
    42,
  );
  assert.equal(plan.shots[0]?.slots["photos.supporting"], "one.jpg");
});

test("a format sequence repeats one recipe per beat and stays inside every range", () => {
  const { pack, template } = buildPack();
  const loaded = loadStylePack(pack);
  const plan = resolveWithTemplate(loaded, template, BRIEF_A, FORMAT_SEQUENCE, 42);

  assert.equal(plan.shots.length, 8);
  assert.deepEqual(
    plan.shots.map((shot) => shot.beat),
    ["cover", "spread", "spread", "spread", "detail", "detail", "detail", "close"],
  );
  assert.equal(plan.shots[0]?.recipe, "recipe_open");
  assert.equal(plan.shots[1]?.recipe, "recipe_portrait");
  assert.equal(plan.shots[4]?.recipe, "recipe_detail");
  assert.equal(plan.shots[7]?.recipe, "recipe_close");

  const total =
    Math.round(
      plan.shots.reduce((sum, shot) => sum + shot.duration, 0) * 1000,
    ) / 1000;
  assert.equal(total, 30);
  assert.equal(plan.duration, 30);
  for (const shot of plan.shots) {
    const recipe = loaded.recipes.find((entry) => entry.id === shot.recipe);
    assert.ok(recipe);
    assert.ok(
      shot.duration >= recipe.duration.min,
      `${shot.id} ${shot.duration}s below ${recipe.duration.min}s`,
    );
    assert.ok(
      shot.duration <= recipe.duration.max,
      `${shot.id} ${shot.duration}s above ${recipe.duration.max}s`,
    );
  }
});

test("a format sequence fails clearly when the target is outside the recipe ranges", () => {
  const { pack, template } = buildPack();
  const loaded = loadStylePack(pack);

  const tooLong: ResolveFormat = {
    ...FORMAT_SEQUENCE,
    id: "too-long",
    sequence: [{ beat: "spread", role: "portrait", count: 20 }],
  };
  assert.throws(
    () => resolveWithTemplate(loaded, template, BRIEF_A, tooLong, 42),
    /\[assertion-8\].*minimum of/,
  );

  const tooShort: ResolveFormat = {
    ...FORMAT_SEQUENCE,
    id: "too-short",
    sequence: [{ beat: "close", role: "close", count: 1 }],
  };
  assert.throws(
    () => resolveWithTemplate(loaded, template, BRIEF_A, tooShort, 42),
    /\[assertion-8\].*maximum of/,
  );
});

test("assertion 1 fails when a slot resolves empty", () => {
  const { pack, template } = buildPack();
  const loaded = loadStylePack(pack);
  const emptyTitle: GenericBrief = {
    ...BRIEF_A,
    content: { ...BRIEF_A.content, title: "" },
  };
  assert.throws(
    () => resolveWithTemplate(loaded, template, emptyTitle, FORMAT_A, 42),
    /\[assertion-1\]/,
  );
});

test("assertion 2 fails when a format beat has no recipe", () => {
  const { pack, template } = buildPack();
  const loaded = loadStylePack(pack);
  const orphan: ResolveFormat = {
    id: "orphan",
    name: "Orphan",
    beatRoleMap: { open: "open", mystery: "quote" },
    durations: [15],
    aspects: ["1:1"],
    primaryAspect: "1:1",
  };
  assert.throws(
    () => resolveWithTemplate(loaded, template, BRIEF_A, orphan, 42),
    /\[assertion-2\]/,
  );
});

test("assertion 2 checks every beatRoleMap entry even when a sequence is present", () => {
  const { pack, template } = buildPack();
  const loaded = loadStylePack(pack);
  const sequenced: ResolveFormat = {
    id: "sequenced-orphan",
    name: "Sequenced orphan",
    beatRoleMap: {
      open: "open",
      portrait: "portrait",
      close: "close",
      unused: "quote",
    },
    sequence: [
      { beat: "open", role: "open", count: 1 },
      { beat: "portrait", role: "portrait", count: 1 },
      { beat: "close", role: "close", count: 1 },
    ],
    durations: [15],
    aspects: ["1:1"],
    primaryAspect: "1:1",
  };
  assert.throws(
    () => resolveWithTemplate(loaded, template, BRIEF_A, sequenced, 42),
    /\[assertion-2\]/,
  );
});

test("assertion 3 fails when a recipe asset is missing", () => {
  const { pack, template } = buildPack();
  const loaded = loadStylePack(pack);
  loaded.capabilities.assets.starterLibrary =
    loaded.capabilities.assets.starterLibrary.filter(
      (asset) => asset.id !== "frame.archive",
    );
  assert.throws(
    () => resolveWithTemplate(loaded, template, BRIEF_A, FORMAT_A, 42),
    /\[assertion-3\]/,
  );
});

test("assertion 4 fails for identical briefs", () => {
  const { pack, template } = buildPack();
  const loaded = loadStylePack(pack);
  assert.throws(
    () =>
      resolveWithTemplate(loaded, template, BRIEF_A, FORMAT_A, 42, {
        compare: { brief: BRIEF_A, format: FORMAT_A },
      }),
    /\[assertion-4\]/,
  );
});

test("assertion 5 fails when two plans differ", () => {
  const { pack, template } = buildPack();
  const loaded = loadStylePack(pack);
  const first = resolveWithTemplate(loaded, template, BRIEF_A, FORMAT_A, 42);
  const second = resolveWithTemplate(loaded, template, BRIEF_B, FORMAT_A, 42);
  assert.throws(() => assertSamePlan(first, second), /\[assertion-5\]/);
});

test("assertion 6 fails when the seed does not change", () => {
  const { pack, template } = buildPack();
  const loaded = loadStylePack(pack);
  const first = resolveWithTemplate(loaded, template, BRIEF_A, FORMAT_A, 42);
  assert.throws(() => assertSeedChanges(first, first), /\[assertion-6\]/);
});

test("assertion 7 fails when a transition is not allowed", () => {
  const { pack, template } = buildPack();
  const loaded = loadStylePack(pack);
  loaded.tokens.motion.transitions = ["cut", "dissolve", "hold"];
  assert.throws(
    () => resolveWithTemplate(loaded, template, BRIEF_A, FORMAT_A, 42),
    /\[assertion-7\]/,
  );
});

test("assertion 8: plan duration and aspect fit the format and style limits", () => {
  const { pack, template } = buildPack();
  const loaded = loadStylePack(pack);
  const plan = resolveWithTemplate(loaded, template, BRIEF_A, FORMAT_A, 42);

  assert.equal(RESOLVE_ASSERTIONS.length, 9);
  assert.match(RESOLVE_ASSERTIONS[8] ?? "", /word limit/);
  assert.equal(plan.duration, 15);
  assert.equal(plan.aspect, "1:1");
  assert.ok(FORMAT_A.durations.includes(plan.duration));
  assert.ok(loaded.capabilities.limits.durations.includes(plan.duration));
  assert.ok(FORMAT_A.aspects.includes(plan.aspect));
  assert.ok(loaded.capabilities.limits.aspects.includes(plan.aspect));
  const total =
    Math.round(
      plan.shots.reduce((sum, shot) => sum + shot.duration, 0) * 1000,
    ) / 1000;
  assert.equal(total, plan.duration);
  for (const shot of plan.shots) {
    const recipe = loaded.recipes.find((entry) => entry.id === shot.recipe);
    assert.ok(recipe);
    assert.ok(shot.duration >= recipe.duration.min);
    assert.ok(shot.duration <= recipe.duration.max);
  }
});

test("assertion 9 fails a 40-word caption against an 18-word limit", () => {
  const { pack, template } = buildPack();
  const value = readTokens(pack);
  value.layout.maxWords = 18;
  saveTokens(pack, value);
  const capabilitiesValue = readCapabilities(pack);
  capabilitiesValue.limits.maxWords = 18;
  saveCapabilities(pack, capabilitiesValue);

  const loaded = loadStylePack(pack);
  const longCaption = Array.from({ length: 40 }, (_, index) => `word${index + 1}`).join(
    " ",
  );
  const longBrief: GenericBrief = {
    ...BRIEF_A,
    content: { ...BRIEF_A.content, caption: longCaption },
  };
  assert.throws(
    () => resolveWithTemplate(loaded, template, longBrief, FORMAT_A, 42),
    /\[assertion-9\].*40 words.*18-word limit/m,
  );
});

test("assertion 9 honours tokens.layout.maxWords below capabilities.limits.maxWords", () => {
  const { pack, template } = buildPack();
  const value = readTokens(pack);
  value.layout.maxWords = 3;
  saveTokens(pack, value);
  const capabilitiesValue = readCapabilities(pack);
  capabilitiesValue.limits.maxWords = 18;
  saveCapabilities(pack, capabilitiesValue);

  const loaded = loadStylePack(pack);
  assert.throws(
    () => resolveWithTemplate(loaded, template, BRIEF_A, FORMAT_A, 42),
    /\[assertion-9\].*tokens\.layout\.maxWords/m,
  );
});

test("assertion 9 accepts a caption exactly at the limit", () => {
  const { pack, template } = buildPack();
  const value = readTokens(pack);
  value.layout.maxWords = 18;
  saveTokens(pack, value);
  const capabilitiesValue = readCapabilities(pack);
  capabilitiesValue.limits.maxWords = 18;
  saveCapabilities(pack, capabilitiesValue);

  const loaded = loadStylePack(pack);
  const exactCaption = Array.from(
    { length: 18 },
    (_, index) => `word${index + 1}`,
  ).join(" ");
  const brief: GenericBrief = {
    ...BRIEF_A,
    content: { ...BRIEF_A.content, caption: exactCaption },
  };
  const plan = resolveWithTemplate(loaded, template, brief, FORMAT_A, 42);
  assert.ok(
    plan.shots.some(
      (shot) => shot.slots["content.caption"] === exactCaption,
    ),
  );
});

test("assertion 8 refuses a format duration the style does not allow", () => {
  const { pack, template } = buildPack();
  const loaded = loadStylePack(pack);
  const mismatched: ResolveFormat = { ...FORMAT_A, durations: [99] };
  assert.throws(
    () => resolveWithTemplate(loaded, template, BRIEF_A, mismatched, 42),
    /\[format-duration\]/,
  );
});

test("assertion 8 refuses a format aspect the style does not allow", () => {
  const { pack, template } = buildPack();
  const loaded = loadStylePack(pack);
  const mismatched: ResolveFormat = {
    ...FORMAT_A,
    aspects: ["9:16"],
    primaryAspect: "9:16",
  };
  assert.throws(
    () => resolveWithTemplate(loaded, template, BRIEF_A, mismatched, 42),
    /\[format-aspect\]/,
  );
});

test("resolveStyle refuses a pack that style:check would fail", () => {
  const { pack, template } = buildPack();
  const value = readCapabilities(pack);
  value.proof.frames = ["hero"];
  saveCapabilities(pack, value);
  const loaded = loadStylePack(pack);
  assert.throws(
    () => resolveWithTemplate(loaded, template, BRIEF_A, FORMAT_A, 42),
    /\[validation\]/,
  );
});
