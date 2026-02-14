import { Schema, model } from "mongoose";

const reportSchema = new Schema(
  {
    taskId: { type: Schema.Types.ObjectId, ref: "task" },
    volunteerId: { type: Schema.Types.ObjectId, ref: "account" },
    category: String,
    urgency: String,
    description: String,
    images: [String],
  },
  { timestamps: true },
);

export const task_report_model = model("task_report", reportSchema);
