import { Types } from "mongoose";

export const APP_CONTENT_TYPES = [
  "ORGANIZER_GUIDELINE",
  "TERMS_CONDITION",
  "PRIVACY_POLICY",
  "ABOUT_US",
] as const;

export type T_AppContentType = (typeof APP_CONTENT_TYPES)[number];

export type T_AppContent = {
  _id?: string;
  type: T_AppContentType;
  title: string;
  content: string;
  isActive?: boolean;
  createdBy: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
};
