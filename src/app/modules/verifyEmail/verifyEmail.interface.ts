import { Types } from "mongoose";

export type T_VerifyEmail = {
  event: Types.ObjectId;
  email: string;
  isUsed: boolean;
  usedBy?: Types.ObjectId;
  usedAt?: Date;
};