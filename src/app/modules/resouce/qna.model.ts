import { Schema, model } from "mongoose";
import { T_QNA } from "./resouce.interface";

const qnaSchema = new Schema<T_QNA>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "event", required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "account" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const QNA_Model = model("qna", qnaSchema);
