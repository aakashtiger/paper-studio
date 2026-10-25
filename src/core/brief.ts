import { z } from "zod";

const PersonSchema = z.object({
  name: z.string().min(1),
  role: z.enum(["bride", "groom", "partner"]).optional(),
});

const FamilySchema = z.object({
  relation: z.string().min(1),
  names: z.array(z.string().min(1)).min(1),
});

const EventSchema = z.object({
  type: z.enum(["mehndi", "haldi", "sangeet", "ceremony", "reception", "other"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "time must be HH:MM").optional(),
  venue: z.string().min(1),
  city: z.string().min(1),
});

const PhotoSchema = z.object({
  id: z.string().min(1),
  path: z.string().min(1),
  mustUse: z.boolean().default(false),
  consent: z.boolean().refine((value) => value === true, {
    message: "photo consent must be true",
  }),
});

export const WeddingBriefSchema = z.object({
  projectId: z.string().min(1),
  format: z.literal("wedding"),
  style: z.literal("paper-vows"),
  styleVersion: z.string().min(1),
  seed: z.string().min(1),
  duration: z.union([z.literal(30), z.literal(45), z.literal(60)]),
  aspect: z.enum(["9:16", "16:9", "1:1"]),
  locale: z.enum(["en", "hi", "en-hi"]),
  couple: z.object({
    partnerA: PersonSchema,
    partnerB: PersonSchema,
  }),
  families: z.array(FamilySchema).default([]),
  events: z.array(EventSchema).min(1),
  rsvp: z.object({
    method: z.enum(["phone", "whatsapp", "link", "qr"]),
    value: z.string().min(1),
  }),
  text: z
    .object({
      inviteLine: z.string().min(1).optional(),
      quote: z.string().min(1).optional(),
      blessing: z.string().min(1).optional(),
      hashtag: z.string().min(1).optional(),
    })
    .default({}),
  photos: z.array(PhotoSchema).default([]),
  music: z.object({
    source: z.enum(["library", "upload"]),
    id: z.string().min(1),
  }),
  palette: z.string().min(1),
  motif: z.string().min(1),
  tone: z.enum(["traditional", "modern", "playful", "minimal"]),
  deliverables: z
    .array(z.enum(["9:16", "16:9", "1:1", "still", "rsvp-qr", "captions"]))
    .min(1),
});

export type WeddingBrief = z.infer<typeof WeddingBriefSchema>;
export type WeddingEvent = z.infer<typeof EventSchema>;
