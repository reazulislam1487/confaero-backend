import { z } from "zod";

const create_qna = z.object({
  eventId: z.string(),
  question: z.string(),
  answer: z.string(),
});

export const resouce_validations = { create_qna };

export const submitSurveySchema = z.object({
  rating: z.number().min(1).max(5),
  helpful: z.boolean(),
  suggestion: z.string().min(80).optional(),
});
