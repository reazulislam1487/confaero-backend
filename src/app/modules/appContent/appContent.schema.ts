import { Schema, model } from "mongoose";
import { T_AppContent } from "./appContent.interface";

const appContentSchema = new Schema<T_AppContent>(
  {
    type: {
      type: String,
      enum: ["ORGANIZER_GUIDELINE", "TERMS_CONDITION", "PRIVACY_POLICY"],
      required: true,
      unique: true, // 🔥 one doc per type
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "account",
      required: true,
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "account",
    },
  },
  {
    timestamps: true, // createdAt, updatedAt auto
  },
);

export const AppContent = model<T_AppContent>("AppContent", appContentSchema);
