import { Types } from "mongoose";

export type T_OrganizerNotification = {
  eventId: Types.ObjectId;
  receiverId: Types.ObjectId; // organizer
  type: "chat_message" | "session_created";
  refId?: Types.ObjectId;
  isRead: boolean;
  createdAt?: Date;
};
