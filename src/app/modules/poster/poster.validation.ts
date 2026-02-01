import { z } from "zod";
import { Types } from "mongoose";

const objectId = z.string().refine((id) => Types.ObjectId.isValid(id));

const attachmentSchema = z.object({
  url: z.string().url(),
  type: z.enum(["pdf", "image"]),
  name: z.string(),
  size: z.number().optional(),
});

const presenterSchema = z.object({
  name: z.string(),
  role: z.string().optional(),
});

const create = z.object({
  body: z.object({
    eventId: objectId,
    title: z.string().max(25),
    abstract: z.string().max(200),
    banner: z.string().url(),

    tags: z.array(z.string()).optional(),
    presenters: z.array(presenterSchema).optional(),

    videoLink: z.string().url().optional(),
    attachments: z.array(attachmentSchema).optional(),
  }),
});

export const poster_validations = { create };
