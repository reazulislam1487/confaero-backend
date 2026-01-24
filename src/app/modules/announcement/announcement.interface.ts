import { Types } from "mongoose";

export type T_Announcement = {
  eventId: Types.ObjectId;
  title: string;
  description: string;
  image?: string;
  createdBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};
