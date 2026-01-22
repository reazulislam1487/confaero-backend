import { Schema, model } from "mongoose";
import { T_Speaker } from "./speaker.interface";

const speaker_schema = new Schema<T_Speaker>(
  {
    account: {
      type: Schema.Types.ObjectId,
      ref: "account",
      required: true,
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "event",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    avatar: String,
    company: String,
    email: String,
    sessions: [
      {
        type: Schema.Types.ObjectId,
        ref: "session",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// prevent duplicate speaker per event
speaker_schema.index({ account: 1, event: 1 }, { unique: true });

export const speaker_model = model<T_Speaker>("speaker", speaker_schema);
