import { Types } from "mongoose";

export type T_Speaker = {
  account: Types.ObjectId;      // user/account id
  event: Types.ObjectId;        // event id
  name: string;
  avatar?: string;
  company?: string;
  email?: string;
  sessions: Types.ObjectId[];   // session ids
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
