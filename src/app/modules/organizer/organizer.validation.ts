// organizer.validation.ts
import { z } from "zod";

export const organizer_validations = {
  update_event: z
    .object({
      details: z.string().optional(),
      website: z.string().optional(),

      // agenda comes as string (multipart/form-data)
      agenda: z.string().optional(),
    })
    .refine((d) => Object.keys(d).length > 0),
};
