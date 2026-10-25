import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import type { WeddingBrief, WeddingEvent } from "../core/brief.js";

export type Recipe = {
  id: string;
  name: string;
  purpose: string;
  defaultDuration: number;
  duration: { min: number; max: number };
  camera: { move: string; from: number; to: number; ease: string };
  slots: string[];
  optionalSlots?: string[];
  requires: string[];
  requiresPhotos: boolean;
  transitionOut: string;
  reference: string;
  failureModes: string[];
};

export type StyleCapabilities = {
  style: string;
  version: string;
  shots: string[];
  palettes: string[];
  motifs: string[];
  typeLockups: string[];
  aspects: string[];
  durations: number[];
  motion: string[];
  unsupported: string[];
};

export type ShotPlan = {
  id: string;
  recipe: string;
  start: number;
  duration: number;
  slots: Record<string, string>;
  transitionOut: string;
};

export type RenderPlan = {
  projectId: string;
  style: string;
  styleVersion: string;
  seed: string;
  aspect: string;
  fps: number;
  duration: number;
  frames: number;
  shots: ShotPlan[];
  warnings: string[];
};

const FPS = 30;

export function loadStyle(styleDir: string): {
  capabilities: StyleCapabilities;
  recipes: Map<string, Recipe>;
} {
  const capabilities = JSON.parse(
    readFileSync(resolve(styleDir, "capabilities.json"), "utf8"),
  ) as StyleCapabilities;

  const recipes = new Map<string, Recipe>();
  for (const file of readdirSync(resolve(styleDir, "recipes"))) {
    if (!file.endsWith(".json")) continue;
    const recipe = JSON.parse(
      readFileSync(resolve(styleDir, "recipes", file), "utf8"),
    ) as Recipe;
    recipes.set(recipe.id, recipe);
  }

  return { capabilities, recipes };
}

export function planWedding(brief: WeddingBrief, styleDir: string): RenderPlan {
  const { capabilities, recipes } = loadStyle(styleDir);
  const warnings: string[] = [];

  if (brief.style !== capabilities.style) {
    throw new Error(
      `brief asks for style "${brief.style}" but the style pack is "${capabilities.style}"`,
    );
  }
  if (brief.styleVersion !== capabilities.version) {
    warnings.push(
      `brief pins ${brief.style}@${brief.styleVersion} but the pack is @${capabilities.version}`,
    );
  }
  if (!capabilities.palettes.includes(brief.palette)) {
    throw new Error(
      `palette "${brief.palette}" is not supported by ${capabilities.style}. Supported: ${capabilities.palettes.join(", ")}`,
    );
  }
  if (!capabilities.motifs.includes(brief.motif)) {
    throw new Error(
      `motif "${brief.motif}" is not supported by ${capabilities.style}. Supported: ${capabilities.motifs.join(", ")}`,
    );
  }
  if (!capabilities.aspects.includes(brief.aspect)) {
    throw new Error(
      `aspect "${brief.aspect}" is not supported. Supported: ${capabilities.aspects.join(", ")}`,
    );
  }
  if (!capabilities.durations.includes(brief.duration)) {
    throw new Error(
      `duration ${brief.duration}s is not supported. Supported: ${capabilities.durations.join(", ")}`,
    );
  }

  const hasPhotos = brief.photos.length > 0;
  const sequence: string[] = [
    "invitation_unfold",
    "names_lockup",
    hasPhotos ? "portrait_frame" : "blessing_text",
    "date_reveal",
    "rsvp_card",
    "monogram_end",
  ];

  if (!hasPhotos) {
    warnings.push("no photos supplied: portrait_frame replaced with blessing_text");
  }
  if (brief.locale !== "en") {
    warnings.push(
      `locale "${brief.locale}" is not yet supported for date formatting; using English`,
    );
  }

  const selected: Recipe[] = sequence.map((id) => {
    const recipe = recipes.get(id);
    if (!recipe) {
      throw new Error(`recipe "${id}" is missing from ${styleDir}/recipes`);
    }
    if (!capabilities.shots.includes(id)) {
      throw new Error(
        `recipe "${id}" is not declared in capabilities.json for ${capabilities.style}`,
      );
    }
    return recipe;
  });

  const context = buildContext(brief, warnings);
  const durations = scaleDurations(
    selected.map((recipe) => recipe.defaultDuration),
    brief.duration,
  );

  let start = 0;
  const shots: ShotPlan[] = selected.map((recipe, index) => {
    const duration = durations[index];
    if (duration === undefined) {
      throw new Error(`missing duration for shot ${index + 1}`);
    }

    const slots: Record<string, string> = {};
    for (const slot of recipe.slots) {
      const value = context[slot];
      if (!value) {
        if (recipe.optionalSlots?.includes(slot)) continue;
        throw new Error(
          `recipe "${recipe.id}" needs slot "${slot}" but the brief has no value for it`,
        );
      }
      slots[slot] = value;
    }

    const shot: ShotPlan = {
      id: `s${String(index + 1).padStart(2, "0")}`,
      recipe: recipe.id,
      start,
      duration,
      slots,
      transitionOut: recipe.transitionOut,
    };
    start = round(start + duration);
    return shot;
  });

  const total = round(shots.reduce((sum, shot) => sum + shot.duration, 0));
  if (Math.abs(total - brief.duration) > 0.001) {
    throw new Error(`shot durations sum to ${total}s, expected ${brief.duration}s`);
  }

  return {
    projectId: brief.projectId,
    style: capabilities.style,
    styleVersion: capabilities.version,
    seed: brief.seed,
    aspect: brief.aspect,
    fps: FPS,
    duration: brief.duration,
    frames: brief.duration * FPS,
    shots,
    warnings,
  };
}

function buildContext(
  brief: WeddingBrief,
  warnings: string[],
): Record<string, string> {
  const partnerA = brief.couple.partnerA.name;
  const partnerB = brief.couple.partnerB.name;
  const primary = primaryEvent(brief);

  const inviteLine = brief.text.inviteLine ?? "Together with our families";
  const quote = brief.text.quote ?? inviteLine;

  let blessing = brief.text.blessing ?? brief.text.quote;
  if (!blessing) {
    blessing = brief.text.inviteLine ?? "With love and gratitude";
    warnings.push("no blessing or quote supplied: using a neutral blessing line");
  }

  const rsvpLabels: Record<WeddingBrief["rsvp"]["method"], string> = {
    phone: "RSVP",
    whatsapp: "RSVP on WhatsApp",
    link: "RSVP",
    qr: "Scan to RSVP",
  };

  const familyNames = brief.families.flatMap((family) => family.names);

  return {
    "couple.namesLine": `${partnerA} & ${partnerB}`,
    "couple.partnerA.name": partnerA,
    "couple.partnerB.name": partnerB,
    "couple.initials": `${initial(partnerA)} & ${initial(partnerB)}`,
    "events.primary.date": formatDate(primary.date),
    "events.primary.venue": `${primary.venue}, ${primary.city}`,
    "events.primary.time": primary.time ?? "",
    "text.inviteLine": inviteLine,
    "text.quote": quote,
    "text.blessing": blessing,
    "text.hashtag": brief.text.hashtag ?? "",
    "rsvp.line": `${rsvpLabels[brief.rsvp.method]} · ${brief.rsvp.value}`,
    "families.line": familyNames.join(", "),
  };
}

function primaryEvent(brief: WeddingBrief): WeddingEvent {
  const ceremony = brief.events.find((event) => event.type === "ceremony");
  const event = ceremony ?? brief.events[0];
  if (!event) {
    throw new Error("brief.events must contain at least one event");
  }
  return event;
}

function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function initial(name: string): string {
  return name.trim().charAt(0).toUpperCase();
}

function scaleDurations(base: number[], target: number): number[] {
  const total = base.reduce((sum, value) => sum + value, 0);
  const scaled = base.map((value) =>
    Math.round(((value / total) * target) * 2) / 2,
  );

  const sum = scaled.reduce((acc, value) => acc + value, 0);
  const diff = round(target - sum);
  const lastIndex = scaled.length - 1;
  scaled[lastIndex] = round((scaled[lastIndex] ?? 0) + diff);

  return scaled;
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}
