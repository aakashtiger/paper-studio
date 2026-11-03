import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";
import { ExpressionSchema, PoseLibrarySchema, PoseSchema, resolvePoseLibrary, type PoseIssue } from "./pose.js";

/**
 * The shared character/pose library (decision 0038).
 *
 * A character is expensive: eight poses, fourteen expressions, a rig, anchors.
 * Before this, every film copied the pose file into its own `cast/` and the next
 * film copied it again. The library makes the character a versioned file that a
 * film points at, so the same person can appear in every film and a new pose is
 * added once.
 *
 * The index is deliberately small and explicit. It is not a package manager: a
 * character is a name, a rig, a pose file, a version, a source and a licence.
 */

export const LibraryCharacterSchema = z.object({
  /** Stable id used by commands, e.g. "kiran". */
  id: z.string().min(1),
  /** The name the pose file and the film's cast use. */
  name: z.string().min(1),
  rig: z.string().min(1),
  /** Repo-relative path to the pose library. */
  poses: z.string().min(1),
  version: z.string().min(1),
  /** sha256 of the pose file, when the index pins one. */
  hash: z.string().regex(/^sha256:[a-f0-9]{64}$/).optional(),
  /** Where it came from: a style pack, a previous film, or "new". */
  source: z.string().min(1),
  /** Who may use it. A character without a licence is not reusable. */
  licence: z.string().min(1),
});

export const LibraryIndexSchema = z.object({
  version: z.number().int().positive(),
  characters: z.array(LibraryCharacterSchema).min(1),
});

export type LibraryCharacter = z.infer<typeof LibraryCharacterSchema>;
export type LibraryIndex = z.infer<typeof LibraryIndexSchema>;

export type LibraryCharacterReport = LibraryCharacter & {
  posesCount: number;
  expressionsCount: number;
};

export type LibraryReport = {
  characters: LibraryCharacterReport[];
  errors: PoseIssue[];
  warnings: PoseIssue[];
};

/** The library refuses a character with fewer expressions than a reusable face set. */
export const LIBRARY_MIN_EXPRESSIONS = 12;

/** The sha256 of a pose file, in the same form the index pins. */
export function sha256File(path: string): string {
  return `sha256:${createHash("sha256").update(readFileSync(path)).digest("hex")}`;
}

export function resolveLibrary(
  index: LibraryIndex,
  options: { root: string; minExpressions?: number },
): LibraryReport {
  const errors: PoseIssue[] = [];
  const warnings: PoseIssue[] = [];
  const ids = new Set<string>();
  const names = new Set<string>();
  const characters: LibraryCharacterReport[] = [];
  const minExpressions = options.minExpressions ?? LIBRARY_MIN_EXPRESSIONS;

  for (const character of index.characters) {
    if (ids.has(character.id.toLowerCase())) {
      errors.push({ code: "library:id", message: `character id "${character.id}" is declared twice` });
    }
    ids.add(character.id.toLowerCase());
    if (names.has(character.name.toLowerCase())) {
      errors.push({ code: "library:name", message: `character name "${character.name}" is declared twice` });
    }
    names.add(character.name.toLowerCase());
    if (/^(none|unknown|n\/a|tbd|found on the internet)$/i.test(character.licence.trim())) {
      errors.push({
        code: "library:licence",
        message: `${character.id}: "${character.licence}" is not a licence — a reusable character needs a real one`,
      });
    }
    if (/^(internet|unknown|none)$/i.test(character.source.trim())) {
      errors.push({
        code: "library:source",
        message: `${character.id}: "${character.source}" is not a source`,
      });
    }

    const path = resolve(options.root, character.poses);
    if (!existsSync(path)) {
      errors.push({
        code: "library:path",
        message: `${character.id}: pose file "${character.poses}" does not exist`,
      });
      continue;
    }
    if (character.hash) {
      const actual = sha256File(path);
      if (actual !== character.hash) {
        errors.push({
          code: "library:hash",
          message: `${character.id}: pose file hash ${actual} does not match the index ${character.hash}`,
        });
      }
    }

    let library;
    try {
      library = PoseLibrarySchema.parse(JSON.parse(readFileSync(path, "utf8")));
    } catch (error) {
      errors.push({
        code: "library:poses",
        message: `${character.id}: ${character.poses} is not a pose library — ${error instanceof Error ? error.message : "invalid"}`,
      });
      continue;
    }

    if (library.character !== character.name) {
      errors.push({
        code: "library:character",
        message: `${character.id}: the index says "${character.name}" but the pose file says "${library.character}"`,
      });
    }
    if (library.rig !== character.rig) {
      errors.push({
        code: "library:rig",
        message: `${character.id}: the index says rig "${character.rig}" but the pose file says "${library.rig}"`,
      });
    }

    const poseReport = resolvePoseLibrary(library);
    for (const issue of poseReport.errors) errors.push(issue);
    for (const issue of poseReport.warnings) warnings.push(issue);
    if (library.expressions.length < minExpressions) {
      errors.push({
        code: "library:expressions",
        message:
          `${character.id}: ${library.expressions.length} expressions — a reusable character needs at least ` +
          `${minExpressions} (add them with \`npm run library:add\`)`,
      });
    }

    characters.push({
      ...character,
      posesCount: library.poses.length,
      expressionsCount: library.expressions.length,
    });
  }

  return { characters, errors, warnings };
}

/** Add a pose or an expression to a library character, then validate the whole index. */
export type LibraryAddInput = {
  index: LibraryIndex;
  root: string;
  character: string;
  kind: "pose" | "expression";
  value: unknown;
};

export function addToLibrary(input: LibraryAddInput): { index: LibraryIndex; doc: unknown } {
  const character = input.index.characters.find(
    (entry) => entry.id.toLowerCase() === input.character.toLowerCase() || entry.name.toLowerCase() === input.character.toLowerCase(),
  );
  if (!character) throw new Error(`no library character "${input.character}"`);
  const path = resolve(input.root, character.poses);
  const doc = PoseLibrarySchema.parse(JSON.parse(readFileSync(path, "utf8")));
  if (input.kind === "pose") {
    const value = PoseSchema.parse(input.value);
    if (doc.poses.length >= 12) throw new Error(`${character.id} already has 12 poses — the maximum`);
    if (doc.poses.some((pose) => pose.name === value.name)) {
      throw new Error(`pose "${value.name}" already exists on ${character.id}`);
    }
    doc.poses.push(value);
  } else {
    const value = ExpressionSchema.parse(input.value);
    if (doc.expressions.length >= 16) throw new Error(`${character.id} already has 16 expressions — the maximum`);
    if (doc.expressions.some((expression) => expression.name === value.name)) {
      throw new Error(`expression "${value.name}" already exists on ${character.id}`);
    }
    doc.expressions.push(value);
  }
  const check = resolvePoseLibrary(doc);
  if (check.errors.length > 0) {
    throw new Error(`${character.id}: the new set is not legal — ${check.errors.map((issue) => issue.message).join("; ")}`);
  }
  return { index: input.index, doc };
}
