import { Types } from "mongoose";

export type T_Message = {
  eventId: Types.ObjectId;
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;
  text: string;
  readBy: Types.ObjectId[];
  createdAt: Date;
};

export type T_Conversation = {
  eventId: Types.ObjectId;
  participants: Types.ObjectId[]; // always length = 2
  lastMessage: string;
  lastMessageAt: Date;
};
