/**
 * One identity for a film's **picture**, separate from its container.
 *
 * `videoHash` used to be the sha256 of the MP4 file. That made the picture's
 * identity depend on the audio muxed into it: re-cutting the master changed a
 * hash every video audit was tied to, even though not one frame had moved, and
 * the alternative — re-rendering 900 frames to change a fade — is worse.
 *
 * The picture is the encoded video stream. A stream hash is taken over the
 * copied packets, so it is instant, needs no decode, and survives a re-mux.
 * The container hash is still recorded, because the deliverable is a file and a
 * file is what ships.
 */
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

export function findFfmpeg(root: string = process.cwd()): string {
  const candidates = [
    process.env.FFMPEG_PATH,
    join(root, "node_modules", "ffmpeg-static", "ffmpeg.exe"),
    join(root, "node_modules", "ffmpeg-static", "ffmpeg"),
    join(root, "..", "node_modules", "ffmpeg-static", "ffmpeg.exe"),
    join(root, "..", "node_modules", "ffmpeg-static", "ffmpeg"),
  ].filter((value): value is string => Boolean(value));
  const found = candidates.find((candidate) => existsSync(candidate));
  if (found) return found;
  const probe = spawnSync("ffmpeg", ["-version"], { stdio: "ignore" });
  if (probe.status === 0) return "ffmpeg";
  throw new Error("ffmpeg not found. Set FFMPEG_PATH or install ffmpeg-static.");
}

/**
 * sha256 over the encoded video packets of `path`'s first video stream.
 *
 * Deterministic for a given encode: the same frames, encoded the same way, hash
 * the same. It says nothing about the audio, which is the point.
 */
export function videoStreamHash(ffmpeg: string, path: string): string {
  const result = spawnSync(
    ffmpeg,
    [
      "-hide_banner",
      "-loglevel",
      "error",
      "-i",
      resolve(path),
      "-map",
      "0:v:0",
      "-c",
      "copy",
      "-f",
      "streamhash",
      "-hash",
      "sha256",
      "-",
    ],
    { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 },
  );
  if (result.status !== 0) {
    throw new Error(`could not hash the video stream of ${path}: ${result.stderr || result.status}`);
  }
  const line = String(result.stdout ?? "").trim().split(/\r?\n/)[0] ?? "";
  // "0,v,SHA256=abc..."
  const match = /SHA256=([0-9a-f]+)/i.exec(line);
  if (!match) throw new Error(`unexpected streamhash output for ${path}: ${line}`);
  return `sha256:${match[1]}`;
}

export function fileHash(path: string): string {
  return `sha256:${createHash("sha256").update(readFileSync(path)).digest("hex")}`;
}

/** Does `path` exist and does its picture hash equal `expected`? */
export function pictureMatches(ffmpeg: string, path: string, expected: string): boolean {
  if (!existsSync(path)) return false;
  try {
    return videoStreamHash(ffmpeg, path) === expected;
  } catch {
    return false;
  }
}
