import { z } from "zod";

const create = z.object({
  body: z.object({
    eventId: z.string(),
    name: z.string().min(1),
    email: z.string().email(),
    role: z.enum(["ATTENDEE", "EXHIBITOR", "VOLUNTEER", "SPEAKER"]),
  }),
});

const accept = z.object({
  body: z.object({
    token: z.string(),
  }),
});

const reject = z.object({
  body: z.object({
    token: z.string(),
  }),
});

const makeSpeaker = z.object({
  email: z.string().email(),
  sessionIndex: z.array(z.number()),
});

export const invitation_validations = { create, accept, reject, makeSpeaker };
