import { Schema, model } from "mongoose";
import { T_Announcement } from "./announcement.interface";

const announcement_schema = new Schema<T_Announcement>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "event",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true },
);

export const announcement_model = model("announcement", announcement_schema);
