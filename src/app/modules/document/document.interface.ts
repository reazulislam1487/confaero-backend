import { Types } from "mongoose";

export type T_Document = {
  eventId: Types.ObjectId;
  uploadedBy: Types.ObjectId;

  documentType: string;
  documentUrl: string;
  documentName?: string;

  status: "pending" | "approved" | "rejected";
};
