import { Schema, model } from "mongoose";
import { T_Task } from "./volunteer.interface";

const taskSchema = new Schema<T_Task>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "event", required: true },
    title: String,
    date: String,
    time: String,
    location: String,
    instruction: String,
    referenceImage: String,

    assignedVolunteer: {
      type: Schema.Types.ObjectId,
      ref: "account",
      required: true,
    },

    status: {
      type: String,
      enum: ["ASSIGNED", "COMPLETED", "REPORTED"],
      default: "ASSIGNED",
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "account",
    },
  },
  { timestamps: true }
);

export const task_model = model("task", taskSchema);
