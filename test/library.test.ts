import test from "node:test";
import assert from "node:assert/strict";
import { copyFileSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import {
  LibraryIndexSchema,
  addToLibrary,
  resolveLibrary,
  sha256File,
  type LibraryIndex,
} from "../src/engine/library.js";

const root = process.cwd();

function tempLibrary(poseSource: string): { dir: string; index: LibraryIndex } {
  const dir = mkdtempSync(join(tmpdir(), "paper-library-"));
  copyFileSync(resolve(root, poseSource), join(dir, "poses.json"));
  const index = LibraryIndexSchema.parse({
    version: 1,
    characters: [
      {
        id: "test",
        name: "Kiran",
        rig: "worker@0.1.0",
        poses: "poses.json",
        version: "1.0.0",
        source: "test",
        licence: "proprietary",
      },
    ],
  });
  return { dir, index };
}

test("the shipped library is legal and reusable", () => {
  const index = LibraryIndexSchema.parse(
    JSON.parse(readFileSync(resolve(root, "library/characters/index.json"), "utf8")),
  );
  const report = resolveLibrary(index, { root });
  assert.deepEqual(report.errors, []);
  assert.equal(report.characters.length, 2);
  assert.ok(report.characters.every((character) => character.expressionsCount >= 12));
});

test("a character with four expressions is not reusable", () => {
  const { dir, index } = tempLibrary("films/same-alarm/cast/kiran.poses.json");
  try {
    const report = resolveLibrary(index, { root: dir });
    assert.ok(report.errors.some((error) => error.code === "library:expressions"));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("a duplicate character id is refused", () => {
  const { dir, index } = tempLibrary("library/characters/kiran/poses.json");
  try {
    const doubled = LibraryIndexSchema.parse({
      ...index,
      characters: [index.characters[0], index.characters[0]],
    });
    const report = resolveLibrary(doubled, { root: dir });
    assert.ok(report.errors.some((error) => error.code === "library:id"));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("a new pose is appended once and validated", () => {
  const { dir, index } = tempLibrary("library/characters/kiran/poses.json");
  try {
    const before = JSON.parse(readFileSync(join(dir, "poses.json"), "utf8")) as { poses: unknown[]; expressions: unknown[] };
    const result = addToLibrary({
      index,
      root: dir,
      character: "kiran",
      kind: "pose",
      value: { name: "wave-test", params: { armR: [0.2, 0.1] } },
    });
    const after = result.doc as { poses: unknown[]; expressions: unknown[] };
    assert.equal(after.poses.length, before.poses.length + 1);
    writeFileSync(join(dir, "poses.json"), `${JSON.stringify(after, null, 2)}\n`, "utf8");
    const report = resolveLibrary(index, { root: dir });
    assert.deepEqual(report.errors, []);
    assert.equal(report.characters[0]?.posesCount, 9);
    assert.throws(
      () =>
        addToLibrary({
          index,
          root: dir,
          character: "kiran",
          kind: "pose",
          value: { name: "wave-test", params: { armR: [0.2, 0.1] } },
        }),
      /already exists/,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("an expression is appended without touching the poses", () => {
  const { dir, index } = tempLibrary("library/characters/kiran/poses.json");
  try {
    const result = addToLibrary({
      index,
      root: dir,
      character: "Kiran",
      kind: "expression",
      value: { name: "test-face", params: { open: 1, brow: 0.2, lookX: 0, lookY: 0 } },
    });
    const after = result.doc as { poses: unknown[]; expressions: unknown[] };
    assert.equal(after.poses.length, 8);
    assert.equal(after.expressions.length, 15);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("a pinned hash catches a changed pose file", () => {
  const { dir, index } = tempLibrary("library/characters/kiran/poses.json");
  try {
    const pinned = {
      ...index,
      characters: [{ ...index.characters[0]!, hash: sha256File(join(dir, "poses.json")) }],
    };
    assert.deepEqual(resolveLibrary(pinned, { root: dir }).errors, []);
    const doc = JSON.parse(readFileSync(join(dir, "poses.json"), "utf8")) as { poses: { params: Record<string, unknown> }[] };
    doc.poses[0]!.params.armL = [0.11, 0.09];
    writeFileSync(join(dir, "poses.json"), `${JSON.stringify(doc, null, 2)}\n`);
    const changed = resolveLibrary(pinned, { root: dir });
    assert.ok(changed.errors.some((error) => error.code === "library:hash"));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("character ids are compared case-insensitively", () => {
  const { dir, index } = tempLibrary("library/characters/kiran/poses.json");
  try {
    const doubled = LibraryIndexSchema.parse({
      ...index,
      characters: [index.characters[0], { ...index.characters[0], id: index.characters[0]!.id.toUpperCase() }],
    });
    assert.ok(resolveLibrary(doubled, { root: dir }).errors.some((error) => error.code === "library:id"));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
