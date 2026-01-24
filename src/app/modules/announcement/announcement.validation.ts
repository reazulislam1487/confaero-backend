import { z } from "zod";

const create = z.object({
  eventId: z.string(),
  title: z.string().min(3),
  description: z.string().min(10),
  image: z.string().optional(),
});

const update = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
});

export const announcement_validations = {
  create,
  update,
};
