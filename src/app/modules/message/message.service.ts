import { Types } from "mongoose";
import httpStatus from "http-status";
import { conversation_model } from "./conversation.model";
import { getIO } from "../../socket/socket";
import { message_model } from "./message.schema";

const getOrCreateConversation = async (
  eventId: any,
  userA: any,
  userB: any,
) => {
  const participants = [userA, userB].sort();

  let conversation = await conversation_model.findOne({
    eventId,
    participants,
  });

  if (!conversation) {
    conversation = await conversation_model.create({
      eventId,
      participants,
    });
  }

  return conversation;
};

const send_message = async (
  userId: any,
  eventId: any,
  receiverId: any,
  text: string,
) => {
  const conversation = await getOrCreateConversation(
    eventId,
    userId,
    receiverId,
  );
  console.log(userId);
  const message = await message_model.create({
    eventId,
    conversationId: conversation.id,
    senderId: userId,
    receiverId,
    text,
  });

  conversation.lastMessage = text;
  conversation.lastMessageAt = new Date();
  await conversation.save();

  const io = getIO();
  io.to(`event:${eventId}`).emit("message:new", message);

  return message;
};

const get_conversations = async (userId: any, eventId: any) => {
  return conversation_model
    .find({
      eventId,
      participants: userId,
    })
    .sort({ lastMessageAt: -1 });
};

const get_messages = async (conversationId: any, userId: any) => {
  return message_model.find({
    conversationId,
    $or: [{ senderId: userId }, { receiverId: userId }],
  });
};

const mark_seen = async (conversationId: any, userId: any) => {
  await message_model.updateMany(
    {
      conversationId,
      receiverId: userId,
      seen: false,
    },
    { seen: true },
  );
};

export const message_service = {
  send_message,
  get_conversations,
  get_messages,
  mark_seen,
};
