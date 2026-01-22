import { z } from "zod";

const create_qna = z.object({
  eventId: z.string(),
  question: z.string(),
  answer: z.string(),
});

export const resouce_validations = { create_qna };
