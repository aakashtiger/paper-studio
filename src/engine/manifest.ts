/**
 * The render manifest: **what a picture was made from**.
 *
 * The renderer is the only step that knows the inputs it painted with, so the
 * renderer writes this file. An audit that wrote it afterwards would record the
 * files as they are *at audit time*, which is not the same claim: edit the
 * painter after a render and an audit-written manifest would describe the new
 * painter beside the old picture, and every hash in it would agree.
 *
 * So the writer is `scripts/render-film.ts`, the reader is
 * `scripts/frame-audit.ts` (which refuses a video the manifest does not
 * describe), and `gate:7` re-hashes the paths this file names, so "the code
 * that painted this frame is still the code on disk" is a checked statement.
 */
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";

export type ManifestScore = {
  id: string;
  style?: string;
  duration: number;
  cast?: { character: string; poses?: string }[];
};

export type RenderInputs = {
  score: string | null;
  scoreData: string | null;
  backend: string | null;
  backendPath: string;
  painter: string | null;
  painterPath: string;
  index: string | null;
  captions: string | null;
  vendor: Record<string, string | null>;
  poses: Record<string, string | null>;
};

export type RenderManifest = {
  film: string;
  renderer: string;
  command: string;
  duration: number;
  fps: number;
  frames: number;
  video: string;
  /** The picture: sha256 over the video stream. Survives an audio re-cut. */
  videoHash: string;
  /** The container: sha256 over the whole file, audio included. */
  videoFileHash: string;
  audio: { path: string; hash: string | null } | null;
  inputs: RenderInputs;
};

/** The vendor scripts the film page loads. Missing ones hash to null. */
const VENDOR_FILES = [
  "characters.js",
  "core.js",
  "props.js",
  "scene_kit.js",
  "type.js",
  "gsap.min.js",
];

export async function hashFile(path: string): Promise<string | null> {
  if (!existsSync(path)) return null;
  return `sha256:${createHash("sha256").update(await readFile(path)).digest("hex")}`;
}

/**
 * Every file whose contents can change a frame, hashed **now**, with the path
 * that was hashed beside it. The paths travel because a hash alone cannot be
 * re-checked later.
 */
export async function renderInputs(
  root: string,
  score: ManifestScore,
  scorePath: string,
): Promise<RenderInputs> {
  const filmDir = resolve(root, "films", score.id);
  const style = score.style ?? "";
  const vendor = Object.fromEntries(
    await Promise.all(
      VENDOR_FILES.map(async (name) => [name, await hashFile(join(filmDir, "vendor", name))] as const),
    ),
  );
  // Pose libraries are cast data, not engine data: a pose edit changes frames
  // without touching code, so each file is hashed here too.
  const poses = Object.fromEntries(
    await Promise.all(
      (score.cast ?? []).map(async (entry) => {
        const path = entry.poses ? resolve(root, entry.poses) : null;
        return [entry.character, path ? await hashFile(path) : null] as const;
      }),
    ),
  );
  const backendPath = `styles/${style}/canvas/recipes.js`;
  const painterPath = relative(root, join(filmDir, "painter.js")).replace(/\\/g, "/");
  return {
    score: await hashFile(resolve(root, scorePath)),
    scoreData: await hashFile(join(filmDir, "score-data.js")),
    backend: await hashFile(resolve(root, backendPath)),
    backendPath,
    painter: await hashFile(join(filmDir, "painter.js")),
    painterPath,
    index: await hashFile(join(filmDir, "index.html")),
    captions: await hashFile(join(filmDir, "captions.srt")),
    vendor,
    poses,
  };
}

export function manifestPath(root: string, film: string): string {
  return resolve(root, "build", film, "render-manifest.json");
}

export async function readRenderManifest(
  root: string,
  film: string,
): Promise<RenderManifest | null> {
  const path = manifestPath(root, film);
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(await readFile(path, "utf8")) as RenderManifest;
  } catch {
    return null;
  }
}
