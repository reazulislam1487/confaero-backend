import { z } from "zod";

const generate = z.object({
  params: z.object({
    eventId: z.string(),
  }),
});

const scan = z.object({
  body: z.object({
    qrToken: z.string(),
  }),
});

export const qr_validations = {
  generate,
  scan,
};
