import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { basename, join, relative, resolve, sep } from "node:path";
import {
  GenericBriefSchema,
  RESOLVE_ASSERTIONS,
  ResolveFormatSchema,
  STYLE_CONTRACT,
  StyleLoadError,
  StyleResolveError,
  approveStylePack,
  checkSealedRun,
  computeBriefHash,
  computeContractHash,
  computeTemplateHash,
  computeValidatorHash,
  findDefaultTemplatePath,
  findStyleDirectory,
  formatStyleReport,
  hashFile,
  loadStylePack,
  readStyleJson,
  readStyleSeal,
  resetSealTarget,
  resolveStyle,
  styleExitCode,
  validateStylePack,
  writeStyleJson,
  type ValidateStylePackOptions,
} from "../src/core/style.js";

/**
 * One CLI for the style contract:
 *
 *   npm run style:new -- <id> --brief <file>
 *   npm run style:check -- <path> [--json]
 *   npm run style:approve -- <id> --by "<name>"
 *   npm run style:resolve -- --style <path> --seed <n> --brief <file> --format <file> ...
 *   npm run style:seal [--force] [--discard-pack]
 *
 * The human report is the product. Nothing here prints a stack trace.
 */

type ParsedArgs = {
  positionals: string[];
  flags: Map<string, string[]>;
};

const BOOLEAN_FLAGS = new Set(["json", "force", "discard-pack", "help"]);

function parseArgs(argv: string[]): ParsedArgs {
  const positionals: string[] = [];
  const flags = new Map<string, string[]>();

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === undefined) continue;
    if (argument === "--") continue;
    if (argument.startsWith("--")) {
      const name = argument.slice(2);
      const next = argv[index + 1];
      const values = flags.get(name) ?? [];
      if (BOOLEAN_FLAGS.has(name)) {
        values.push("true");
      } else if (next !== undefined && !next.startsWith("--")) {
        values.push(next);
        index += 1;
      } else {
        values.push("true");
      }
      flags.set(name, values);
    } else {
      positionals.push(argument);
    }
  }

  return { positionals, flags };
}

function lastFlag(args: ParsedArgs, name: string): string | undefined {
  const values = args.flags.get(name);
  return values && values.length > 0 ? values[values.length - 1] : undefined;
}

function allFlags(args: ParsedArgs, name: string): string[] {
  return args.flags.get(name) ?? [];
}

function hasFlag(args: ParsedArgs, name: string): boolean {
  return args.flags.has(name);
}

function displayPath(path: string): string {
  return relative(process.cwd(), path).split(sep).join("/");
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function fail(message: string): never {
  throw new Error(message);
}

function requireValue(
  args: ParsedArgs,
  name: string,
  usage: string,
): string {
  const value = lastFlag(args, name);
  if (value === undefined || value === "true" || value.trim().length === 0) {
    fail(`missing --${name}\n\n${usage}`);
  }
  return value;
}

function printUsage(): void {
  console.log(
    [
      "Paper Studio style contract",
      "",
      "  npm run style:new -- <id> --brief <file>",
      "  npm run style:check -- <path> [--json]",
      "  npm run style:approve -- <id> --by \"<name>\"",
      "  npm run style:resolve -- --style <path> --seed <n> --brief <file> --format <file> [...]",
      "  npm run style:seal [--force] [--discard-pack]",
      "",
      "Exit code 1 only when a pack has hard failures.",
    ].join("\n"),
  );
}

// ---------------------------------------------------------------------------
// new
// ---------------------------------------------------------------------------

function commandNew(args: ParsedArgs): void {
  const usage = "usage: npm run style:new -- <id> --brief <file>";
  const id = args.positionals[0];
  if (!id) fail(`missing style id\n\n${usage}`);
  if (!/^[a-z0-9][a-z0-9-]*$/.test(id)) {
    fail(`style id "${id}" must be lower-case letters, digits and hyphens\n\n${usage}`);
  }

  const briefSource = requireValue(args, "brief", usage);
  const briefPath = resolve(process.cwd(), briefSource);
  if (!existsSync(briefPath)) {
    fail(`brief not found: ${briefSource}`);
  }

  const template = findDefaultTemplatePath();
  if (template === null) {
    fail(
      "template not found. Expected styles/_template/ (or _template/ beside the validator).",
    );
  }

  const stylesRoot = join(process.cwd(), "styles");
  const target = join(stylesRoot, id);
  if (existsSync(target)) {
    fail(`refusing to overwrite existing style: ${displayPath(target)}`);
  }

  mkdirSync(stylesRoot, { recursive: true });
  cpSync(template, target, { recursive: true });
  cpSync(briefPath, join(target, "BRIEF.md"));

  const signoffPath = join(target, "signoff.json");
  if (existsSync(signoffPath)) rmSync(signoffPath);

  const briefHash = computeBriefHash(target);
  const templateHash = computeTemplateHash(template);
  const contractHash = computeContractHash();

  const capabilitiesPath = join(target, "capabilities.json");
  const capabilities = asRecord(readStyleJson(capabilitiesPath));
  if (capabilities === null) {
    fail(`template capabilities.json is not an object: ${displayPath(capabilitiesPath)}`);
  }
  const identity = asRecord(capabilities.identity) ?? {};
  identity.id = id;
  identity.bindings = { briefHash, templateHash, contractHash };
  capabilities.identity = identity;
  writeStyleJson(capabilitiesPath, capabilities);

  console.log(`CREATED: ${displayPath(target)}`);
  console.log(`BRIEF: ${displayPath(join(target, "BRIEF.md"))} (${briefHash})`);
  console.log("");
  console.log(`NEXT: npm run style:check -- ${displayPath(target)}`);
}

// ---------------------------------------------------------------------------
// check
// ---------------------------------------------------------------------------

type SealLocation = { root: string; sealPath: string };

function isInside(root: string, path: string): boolean {
  const relativePath = relative(resolve(root), resolve(path));
  return (
    relativePath.length > 0 &&
    relativePath !== ".." &&
    !relativePath.startsWith(`..${sep}`) &&
    !relativePath.startsWith("../")
  );
}

function findSealForPack(packPath: string): SealLocation | null {
  const cwd = process.cwd();
  const candidates = [
    { sealPath: join(cwd, "gate", "blind", "SEAL.json"), root: join(cwd, "gate", "blind") },
    { sealPath: join(cwd, "SEAL.json"), root: cwd },
    { sealPath: join(cwd, "..", "SEAL.json"), root: resolve(cwd, "..") },
  ];

  for (const candidate of candidates) {
    if (!existsSync(candidate.sealPath)) continue;
    if (!isInside(candidate.root, packPath)) continue;
    return { root: candidate.root, sealPath: candidate.sealPath };
  }
  return null;
}

function currentSealOptions(root: string): ValidateStylePackOptions {
  const options: ValidateStylePackOptions = {
    expectedContractHash: computeContractHash(),
  };
  const templatePath = join(root, "_template");
  if (existsSync(templatePath)) {
    options.expectedTemplateHash = computeTemplateHash(templatePath);
  }
  const frozenBrief = join(root, "brief.md");
  if (existsSync(frozenBrief)) {
    options.expectedBriefHash = hashFile(frozenBrief);
  }
  return options;
}

function commandCheck(args: ParsedArgs): void {
  const usage = "usage: npm run style:check -- <path> [--json]";
  const packPath = args.positionals[0];
  if (!packPath) fail(`missing style pack path\n\n${usage}`);

  const sealLocation = findSealForPack(packPath);
  const result = validateStylePack(
    packPath,
    sealLocation ? currentSealOptions(sealLocation.root) : {},
  );

  if (sealLocation) {
    // readStyleSeal is strict: a present but unparseable seal is a hard error.
    const seal = readStyleSeal(sealLocation.sealPath);
    const problems = checkSealedRun(sealLocation.root, seal);
    if (problems.length > 0) {
      for (const message of problems) {
        result.hardFailures.push({
          layer: "bindings",
          rule: "seal",
          message,
          where: "SEAL.json",
        });
      }
      result.status = "DRAFT";
      result.statusLine = `DRAFT — sealed run invalidated (${problems.length} change${problems.length === 1 ? "" : "s"})`;
      const bindings = result.profile.find((layer) => layer.layer === "bindings");
      if (bindings) {
        bindings.passed = false;
        bindings.hardFailures += problems.length;
      }
    }
  }

  if (hasFlag(args, "json")) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(formatStyleReport(result));
  }

  process.exitCode = styleExitCode(result, packPath);
}

// ---------------------------------------------------------------------------
// approve
// ---------------------------------------------------------------------------

function commandApprove(args: ParsedArgs): void {
  const usage = 'usage: npm run style:approve -- <id> --by "<name>"';
  const id = args.positionals[0];
  if (!id) fail(`missing style id\n\n${usage}`);
  const by = requireValue(args, "by", usage);

  const styleDir = findStyleDirectory(join(process.cwd(), "styles"), id);
  if (styleDir === null) {
    fail(`style "${id}" not found under styles/`);
  }

  const date = lastFlag(args, "date");
  const outcome = approveStylePack(styleDir, by, date);

  if (!outcome.approved) {
    console.log(formatStyleReport(outcome.result));
    console.log("");
    if (outcome.result.chosen.length > 0) {
      console.log(
        `APPROVAL REFUSED — ${outcome.result.chosen.length} taste choice${outcome.result.chosen.length === 1 ? "" : "s"} still open. Answer them in capabilities.governance.choices, then re-check.`,
      );
    } else {
      console.log("APPROVAL REFUSED — fix the hard failures above and re-check.");
    }
    process.exitCode = 1;
    return;
  }

  const signoff = outcome.signoff;
  console.log(`STYLE: ${outcome.result.styleId} ${outcome.result.version}`);
  console.log(`STATUS: ${outcome.result.statusLine}`);
  console.log(`SIGNED: ${displayPath(join(styleDir, "signoff.json"))}`);
  console.log(`PACK: ${outcome.result.packHash}`);
  if (signoff) console.log(`BY: ${signoff.by} · ${signoff.date}`);
  console.log("");
  console.log(`NEXT: open ${outcome.result.cardPath}`);
}

// ---------------------------------------------------------------------------
// resolve
// ---------------------------------------------------------------------------

function parseBriefFile(path: string) {
  if (!existsSync(path)) fail(`brief not found: ${displayPath(path)}`);
  const raw = readStyleJson(path);
  const parsed = GenericBriefSchema.safeParse(raw);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => {
        const where = issue.path.length > 0 ? issue.path.join(".") : "(root)";
        return `${where}: ${issue.message}`;
      })
      .join("\n");
    fail(`invalid brief: ${displayPath(path)}\n${details}`);
  }
  return parsed.data;
}

function parseFormatFile(path: string) {
  if (!existsSync(path)) fail(`resolve format not found: ${displayPath(path)}`);
  const raw = readStyleJson(path);
  const parsed = ResolveFormatSchema.safeParse(raw);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => {
        const where = issue.path.length > 0 ? issue.path.join(".") : "(root)";
        return `${where}: ${issue.message}`;
      })
      .join("\n");
    fail(`invalid resolve format: ${displayPath(path)}\n${details}`);
  }
  return parsed.data;
}

function roundTime(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function commandResolve(args: ParsedArgs): void {
  const usage =
    "usage: npm run style:resolve -- --style <path> --seed <n> --brief <file> --format <file> [--brief ... --format ...]";
  const stylePath = requireValue(args, "style", usage);
  const seedText = requireValue(args, "seed", usage);
  const seed = Number(seedText);
  if (!Number.isFinite(seed) || !Number.isInteger(seed)) {
    fail(`--seed must be an integer, got "${seedText}"`);
  }

  const briefFiles = allFlags(args, "brief");
  const formatFiles = allFlags(args, "format");
  if (briefFiles.length === 0 || formatFiles.length === 0) {
    fail(`at least one --brief and one --format are required\n\n${usage}`);
  }
  if (briefFiles.length !== formatFiles.length) {
    fail(
      `--brief and --format must be paired: ${briefFiles.length} brief(s) and ${formatFiles.length} format(s)`,
    );
  }
  if (briefFiles.length < 2) {
    fail(
      "two briefs are required: assertion 4 proves that different content produces different plans",
    );
  }

  const pack = loadStylePack(stylePath);
  const pairs = briefFiles.map((briefFile, index) => {
    const formatFile = formatFiles[index];
    if (formatFile === undefined) fail(`missing --format for --brief ${briefFile}`);
    return {
      briefFile,
      formatFile,
      brief: parseBriefFile(resolve(process.cwd(), briefFile)),
      format: parseFormatFile(resolve(process.cwd(), formatFile)),
    };
  });

  const first = pairs[0];
  if (first === undefined) fail("no brief/format pairs");

  const plans = pairs.map((pair, index) => {
    const compare =
      index === 0
        ? undefined
        : { brief: first.brief, format: first.format };
    return {
      pair,
      plan: resolveStyle(pack, pair.brief, pair.format, seed, {
        ...(compare ? { compare } : {}),
      }),
    };
  });

  console.log(`STYLE: ${pack.capabilities.identity.id} ${pack.capabilities.identity.version}`);
  console.log(`SEED: ${seed}`);
  console.log(`PAIRS: ${plans.length}`);
  console.log("");

  plans.forEach(({ pair, plan }, index) => {
    console.log(
      `${index + 1}. ${plan.format} — ${plan.formatName} · ${plan.shots.length} shots · ${plan.duration}s · ${plan.aspect}`,
    );
    console.log(`   BRIEF: ${displayPath(resolve(process.cwd(), pair.briefFile))} (${plan.briefHash})`);
    console.log(
      `   FORMAT: ${displayPath(resolve(process.cwd(), pair.formatFile))} · durations ${pair.format.durations.join("/")} · aspects ${pair.format.aspects.join("/")} · primary ${pair.format.primaryAspect}`,
    );
    console.log(
      `   STYLE LIMITS: durations ${pack.capabilities.limits.durations.join("/")} · aspects ${pack.capabilities.limits.aspects.join("/")}`,
    );
    console.log(
      `   WORD LIMIT: ${Math.min(pack.capabilities.limits.maxWords, pack.tokens.layout.maxWords)} words per content slot (capabilities ${pack.capabilities.limits.maxWords} · layout ${pack.tokens.layout.maxWords})`,
    );
    for (const shot of plan.shots) {
      console.log(
        `   ${shot.id} ${shot.beat} · ${shot.recipe} · ${roundTime(shot.start)}–${roundTime(shot.start + shot.duration)}s · ${shot.transitionOut}`,
      );
      for (const [slot, value] of Object.entries(shot.slots)) {
        const shown = value.length > 60 ? `${value.slice(0, 57)}...` : value;
        console.log(`      ${slot} = ${shown}`);
      }
    }
    console.log(
      `   VARIATIONS: grain ${plan.variations.grainOffset} · shadow ${plan.variations.shadowOffset} · camera ${plan.variations.cameraPhase} · timing ${plan.variations.timingJitter}`,
    );
    console.log("");
  });

  console.log("ASSERTIONS");
  RESOLVE_ASSERTIONS.forEach((assertion, index) => {
    console.log(`${index + 1}. ${assertion} — PASS`);
  });
  console.log("");
  console.log("No files written.");
}

// ---------------------------------------------------------------------------
// seal
// ---------------------------------------------------------------------------

function listFiles(root: string, current = root): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(current, { withFileTypes: true })) {
    const path = join(current, entry.name);
    if (entry.isDirectory()) files.push(...listFiles(root, path));
    else if (entry.isFile()) files.push(path);
  }
  return files;
}

function relativePosix(root: string, path: string): string {
  return relative(root, path).split(sep).join("/");
}

function writeValidatorPackage(target: string): void {
  const validatorRoot = join(target, "validator");
  mkdirSync(join(validatorRoot, "src", "core"), { recursive: true });
  mkdirSync(join(validatorRoot, "scripts"), { recursive: true });

  cpSync(
    join(process.cwd(), "src", "core", "style.ts"),
    join(validatorRoot, "src", "core", "style.ts"),
  );
  cpSync(
    join(process.cwd(), "scripts", "style.ts"),
    join(validatorRoot, "scripts", "style.ts"),
  );

  const packageJson = {
    name: "paper-style-validator",
    private: true,
    type: "module",
    scripts: {
      check: "tsx scripts/style.ts check",
      approve: "tsx scripts/style.ts approve",
      resolve: "tsx scripts/style.ts resolve",
    },
    dependencies: { zod: "^3.24.1" },
    devDependencies: {
      "@types/node": "^22.10.2",
      tsx: "^4.19.2",
      typescript: "^5.7.2",
    },
    engines: { node: ">=22" },
  };
  writeFileSync(
    join(validatorRoot, "package.json"),
    `${JSON.stringify(packageJson, null, 2)}\n`,
    "utf8",
  );

  const tsconfig = {
    compilerOptions: {
      target: "ES2022",
      lib: ["ES2022"],
      module: "NodeNext",
      moduleResolution: "NodeNext",
      strict: true,
      noUncheckedIndexedAccess: true,
      esModuleInterop: true,
      forceConsistentCasingInFileNames: true,
      skipLibCheck: true,
      noEmit: true,
      types: ["node"],
    },
    include: ["src/**/*.ts", "scripts/**/*.ts"],
  };
  writeFileSync(
    join(validatorRoot, "tsconfig.json"),
    `${JSON.stringify(tsconfig, null, 2)}\n`,
    "utf8",
  );
}

function commandSeal(args: ParsedArgs): void {
  const templateSource = join(process.cwd(), "styles", "_template");
  if (!existsSync(join(templateSource, "capabilities.json"))) {
    fail("template not found: styles/_template/");
  }

  const authoringSource = join(process.cwd(), "docs", "STYLE-AUTHORING.md");
  if (!existsSync(authoringSource)) {
    fail("authoring guide not found: docs/STYLE-AUTHORING.md");
  }

  const promptSource = join(process.cwd(), "prompts", "blind-author.md");
  if (!existsSync(promptSource)) {
    fail(
      "sealed prompt not found: prompts/blind-author.md (the blind author prompt must exist before sealing)",
    );
  }

  const briefSource = join(process.cwd(), "styles", "_briefs", "keepsake.md");
  if (!existsSync(briefSource)) {
    fail("control brief not found: styles/_briefs/keepsake.md");
  }

  const target = resolve(process.cwd(), "gate", "blind");
  const reset = resetSealTarget(target, {
    force: hasFlag(args, "force"),
    discardPack: hasFlag(args, "discard-pack"),
  });
  if (reset.preservedPack) {
    console.log(`PACK: preserved existing ${displayPath(join(target, "pack"))}`);
  }
  mkdirSync(target, { recursive: true });

  cpSync(templateSource, join(target, "_template"), { recursive: true });
  cpSync(authoringSource, join(target, "STYLE-AUTHORING.md"));
  cpSync(promptSource, join(target, "prompt.md"));
  cpSync(briefSource, join(target, "brief.md"));
  writeStyleJson(join(target, "contract.json"), STYLE_CONTRACT);
  writeValidatorPackage(target);

  const readme = `# Sealed blind authoring folder

This folder contains the contract, the template, the frozen brief and the
validator. It deliberately does not contain Paper K-pop or any existing style.

## Author a style

1. Copy \`_template/\` to \`pack/\`.
2. Copy \`brief.md\` to \`pack/BRIEF.md\`.
3. Read \`STYLE-AUTHORING.md\`, \`prompt.md\`, \`brief.md\` and \`contract.json\`.
4. Edit only \`pack/\`.
5. Run the validator:

\`\`\`bash
cd validator
npm install
npm run check -- ../pack
\`\`\`

6. When the report is REVIEWABLE, stop. The director runs \`style:approve\`.

## Rules

- Do not open any pack under \`styles/\` while authoring.
- Log every question in \`pack/STYLE.md\` under \`## Questions\`.
- \`SEAL.json\` records the template, contract, brief, prompt and validator
  hashes. A mismatch invalidates the run and needs a new blind author.
- The validator only checks the contract. Taste, phone legibility and motion
  feel are human checks.
`;
  writeFileSync(join(target, "README.md"), readme, "utf8");

  const isSealedInput = (file: string): boolean => {
    const relativePath = relativePosix(target, file);
    if (relativePath === "SEAL.json" || relativePath === "package-lock.json") {
      return false;
    }
    if (relativePath.endsWith("/package-lock.json")) return false;
    if (relativePath === "pack" || relativePath.startsWith("pack/")) return false;
    return !relativePath.split("/").includes("node_modules");
  };
  const files = listFiles(target)
    .filter(isSealedInput)
    .sort((a, b) =>
      relativePosix(target, a).localeCompare(relativePosix(target, b), "en"),
    );
  const fileHashes: Record<string, string> = {};
  for (const file of files) {
    fileHashes[relativePosix(target, file)] = hashFile(file);
  }

  const seal = {
    version: 1,
    createdAt: new Date().toISOString(),
    templateHash: computeTemplateHash(join(target, "_template")),
    contractHash: computeContractHash(),
    briefHash: hashFile(join(target, "brief.md")),
    authoringHash: hashFile(join(target, "STYLE-AUTHORING.md")),
    promptHash: hashFile(join(target, "prompt.md")),
    validatorHash: computeValidatorHash(join(target, "validator")),
    files: fileHashes,
  };
  writeFileSync(
    join(target, "SEAL.json"),
    `${JSON.stringify(seal, null, 2)}\n`,
    "utf8",
  );

  console.log(`SEALED: ${displayPath(target)}`);
  console.log(`TEMPLATE: ${seal.templateHash}`);
  console.log(`CONTRACT: ${seal.contractHash}`);
  console.log(`BRIEF: ${seal.briefHash}`);
  console.log(`PROMPT: ${seal.promptHash}`);
  console.log(`VALIDATOR: ${seal.validatorHash}`);
  console.log("");
  console.log("NEXT: copy _template/ to pack/, author, then run the validator in validator/.");
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

function main(): void {
  const command = process.argv[2];
  const args = parseArgs(process.argv.slice(3));

  switch (command) {
    case "new":
      commandNew(args);
      return;
    case "check":
      commandCheck(args);
      return;
    case "approve":
      commandApprove(args);
      return;
    case "resolve":
      commandResolve(args);
      return;
    case "seal":
      commandSeal(args);
      return;
    case undefined:
    case "--help":
    case "-h":
    case "help":
      printUsage();
      return;
    default:
      printUsage();
      fail(`unknown command: ${command}`);
  }
}

try {
  main();
} catch (error) {
  if (error instanceof StyleResolveError) {
    console.error("RESOLVE FAILED");
    console.error(error.message);
  } else if (error instanceof StyleLoadError) {
    console.error(`STYLE PACK INVALID\n${error.message}`);
  } else {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`ERROR: ${message}`);
  }
  process.exitCode = 1;
}
