import { Types } from "mongoose";

export type T_Photo = {
  eventId: Types.ObjectId;
  imageUrl: string;
  type: string;
  uploadedBy: Types.ObjectId;
};
