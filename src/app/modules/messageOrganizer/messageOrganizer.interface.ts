import { Types } from "mongoose";

export type T_OrganizerNotification = {
  eventId: Types.ObjectId;

  receiverId: Types.ObjectId; // organizer / super admin

  type: "SESSION_CREATED" | "SESSION_UPDATED";

  refId?: Types.ObjectId; // sessionId

  isRead: boolean;
  title: string;
  message: string;
  sendToEmail: boolean;

  createdAt?: Date;
  updatedAt?: Date;
};
