import { Schema, model } from "mongoose";
import { T_PollResponse } from "./resouce.interface";

const pollResponseSchema = new Schema<T_PollResponse>(
  {
    pollId: { type: Schema.Types.ObjectId, ref: "poll", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "account", required: true },
    selectedOptionIndex: { type: Number, required: true },
  },
  { timestamps: true },
);

pollResponseSchema.index({ pollId: 1, userId: 1 }, { unique: true });

export const PollResponse_Model = model("poll_response", pollResponseSchema);
