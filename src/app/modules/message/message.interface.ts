import { Types } from "mongoose";

type Status = "pending" | "active";
export interface T_Attachment {
  url: string;
  name: string;
  size: number; // bytes
  mimeType: string; // image/png, application/pdf etc
}
export type T_Message = {
  eventId: Types.ObjectId;
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;
  text: string;
  readBy: Types.ObjectId[];
  createdAt: Date;
  attachments: [];
};

export type T_Conversation = {
  eventId: Types.ObjectId;
  participants: Types.ObjectId[]; // always length = 2
  participantsKey: string;
  initiatedBy: Types.ObjectId;
  status: Status;
  lastMessage: string;
  lastMessageAt: Date;
};
