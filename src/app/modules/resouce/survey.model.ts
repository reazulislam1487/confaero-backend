import { Schema, model } from "mongoose";
import { T_Survey } from "./resouce.interface";

const surveySchema = new Schema<T_Survey>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "event", required: true },
    title: String,
    questions: [
      {
        label: String,
        type: { type: String, enum: ["rating", "yes_no", "text"] },
        required: Boolean,
      },
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: "account" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Survey_Model = model("survey", surveySchema);
