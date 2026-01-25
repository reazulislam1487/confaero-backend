import { Types } from "mongoose";

export type T_Message = {
  eventId: Types.ObjectId;
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  text: string;
  seen: boolean;
  createdAt: Date;
};

export type T_Conversation = {
  eventId: Types.ObjectId;
  participants: Types.ObjectId[]; // sorted, length = 2
  lastMessage: string;
  lastMessageAt: Date;
};
