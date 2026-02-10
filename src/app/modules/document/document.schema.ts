import { Schema, model } from "mongoose";
import { T_Document } from "./document.interface";

const document_schema = new Schema<T_Document>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "account",
      required: true,
      index: true,
    },
    documentType: {
      type: String,
      required: true,
      trim: true,
    },
    documentUrl: {
      type: String,
      required: true,
    },
    documentName: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true },
);

export const document_model = model("Document", document_schema);
