import { Types } from "mongoose";

// appContent.interface.ts
export type T_AppContentType =
  | "ORGANIZER_GUIDELINE"
  | "TERMS_CONDITION"
  | "PRIVACY_POLICY";

export type T_AppContent = {
  _id?: string;
  type: T_AppContentType;
  title: string;
  content: string;
  isActive: boolean;
  createdBy: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
};
