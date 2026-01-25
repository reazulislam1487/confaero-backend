import { z } from "zod";

const send = z.object({
  receiverId: z.string(),
  text: z.string().min(1),
});

const getConversation = z.object({
  params: z.object({
    conversationId: z.string(),
  }),
});

export const message_validations = {
  send,
  getConversation,
};
