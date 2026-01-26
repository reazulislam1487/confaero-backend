import { Types } from "mongoose";
import { conversation_model } from "./conversation.model";
import { message_model } from "./message.schema";
import { getIO } from "../../socket/socket";
import { AppError } from "../../utils/app_error";
import httpStatus from "http-status";

const getOrCreateConversation = async (
  eventId: any,
  userA: any,
  userB: any,
) => {
  // if (userA.equals(userB)) {
  //   throw new AppError("Cannot chat with yourself", httpStatus.BAD_REQUEST);
  // }

  if (userA.toString() === userB.toString()) {
    throw new AppError("Cannot chat with yourself", httpStatus.BAD_REQUEST);
  }
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
  userId: Types.ObjectId,
  eventId: any,
  receiverId: Types.ObjectId,
  text: string,
) => {
  const conversation = await getOrCreateConversation(
    eventId,
    userId,
    receiverId,
  );

  const message = await message_model.create({
    eventId,
    conversationId: conversation._id,
    senderId: userId,
    text,
    readBy: [userId],
  });

  conversation.lastMessage = text;
  conversation.lastMessageAt = new Date();
  await conversation.save();

  const io = getIO();
  io.to(`event:${eventId}`).emit("message:new", message);

  return message;
};

const get_conversations = async (userId: any, eventId: any) => {
  const conversations = await conversation_model
    .find({
      eventId,
      participants: userId,
    })
    .sort({ lastMessageAt: -1 })
    .lean();

  console.log(eventId, userId);

  const results = await Promise.all(
    conversations.map(async (conv) => {
      const unreadCount = await message_model.countDocuments({
        conversationId: conv._id,
        readBy: { $ne: userId },
      });

      return { ...conv, unreadCount };
    }),
  );

  return results;
};

const get_messages = async (conversationId: any, userId: Types.ObjectId) => {
  return message_model.find({ conversationId }).sort({ createdAt: 1 });
};

const mark_seen = async (conversationId: any, userId: any) => {
  await message_model.updateMany(
    {
      conversationId,
      readBy: { $ne: userId },
    },
    { $addToSet: { readBy: userId } },
  );
};

export const message_service = {
  send_message,
  get_conversations,
  get_messages,
  mark_seen,
};
