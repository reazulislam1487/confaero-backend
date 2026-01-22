import { Schema, model } from "mongoose";
import { T_Poll } from "./resouce.interface";

const pollSchema = new Schema<T_Poll>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "event", required: true },
    question: { type: String, required: true },
    options: [
      {
        text: String,
        voteCount: { type: Number, default: 0 },
      },
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: "account" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Poll_Model = model("poll", pollSchema);
