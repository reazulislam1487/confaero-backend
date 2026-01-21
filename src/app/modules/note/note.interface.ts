import { Types } from "mongoose";

export type T_Note = {
  accountId: Types.ObjectId;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
};
