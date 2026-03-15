import { Schema, model } from "mongoose";
import { T_AppContent, APP_CONTENT_TYPES } from "./appContent.interface";

const appContentSchema = new Schema<T_AppContent>(
  {
    type: {
      type: String,
      enum: APP_CONTENT_TYPES,
      required: true,
      unique: true,
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
    timestamps: true,
  },
);

export const AppContent = model<T_AppContent>("AppContent", appContentSchema);
