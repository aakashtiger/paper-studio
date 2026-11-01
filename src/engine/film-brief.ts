import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";

export const FilmBriefSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  audience: z.string().min(1),
  style: z.string().min(1),
  styleVersion: z.string().min(1),
  aspect: z.string().min(1),
  duration: z.number().positive(),
  fps: z.number().int().positive(),
  audioMode: z.enum(["music", "narration", "sfx", "hybrid"]),
  references: z.array(z.string()).default([]),
  mustSay: z.array(z.string()).default([]),
  notes: z.string().optional(),
});

export type FilmBrief = z.infer<typeof FilmBriefSchema>;
export type BriefIssue = { code: string; message: string };

/** Lowercase, letters and digits only — the same rule the ASR uses on words. */
function plain(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

/**
 * The lines of the brief the film has to *say*, checked as words rather than as
 * intent. `mustSay` is the client's promise — the phrase a wedding film must
 * contain, the name a brand film must land — so the check is literal: the words
 * have to be in the narration, the captions or the type, in that order of
 * plainness. Anything looser would be the director grading their own film.
 *
 * `texts` is every word the audience hears or reads; `mustSayGaps` returns the
 * ones the film does not contain, so a gate row can name them.
 */
export function mustSayGaps(mustSay: string[], texts: string[]): string[] {
  const haystack = plain(texts.join(" \n "));
  return mustSay.filter((phrase) => plain(phrase) !== "" && !haystack.includes(plain(phrase)));
}

type Capabilities = {
  identity: { id: string; version: string };
  limits: { aspects: string[]; durations: number[] };
};

export function resolveBrief(
  brief: FilmBrief,
  styleDir: string,
): { errors: BriefIssue[]; warnings: BriefIssue[] } {
  const errors: BriefIssue[] = [];
  const warnings: BriefIssue[] = [];
  const capabilities = JSON.parse(
    readFileSync(resolve(styleDir, "capabilities.json"), "utf8"),
  ) as Capabilities;

  if (brief.style !== capabilities.identity.id) {
    errors.push({ code: "brief_style", message: `brief style "${brief.style}" is not the pack` });
  }
  if (brief.styleVersion !== capabilities.identity.version) {
    warnings.push({
      code: "brief_version",
      message: `brief pins ${brief.style}@${brief.styleVersion} but the pack is @${capabilities.identity.version}`,
    });
  }
  if (!capabilities.limits.aspects.includes(brief.aspect)) {
    errors.push({ code: "brief_aspect", message: `aspect "${brief.aspect}" is not supported` });
  }
  if (!capabilities.limits.durations.includes(brief.duration)) {
    errors.push({
      code: "brief_duration",
      message: `duration ${brief.duration}s is not in ${capabilities.limits.durations.join(", ")}`,
    });
  }

  return { errors, warnings };
}
