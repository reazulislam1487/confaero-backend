import { z } from "zod";

const create = z.object({
  noteId: z.string().optional(),
  content: z.string().min(1, "Note content is required"),
});

export const note_validations = { create };
