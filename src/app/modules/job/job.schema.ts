import { Schema, model } from "mongoose";
import { T_Job } from "./job.interface";

const job_schema = new Schema<T_Job>(
  {
    title: { type: String, required: true, index: true },
    company: { type: String, required: true, index: true },

    bannerImage: { type: String },
    // logoImage: { type: String },

    description: { type: String, required: true },
    requirements: { type: String },

    location: { type: String, required: true },
    locationUrl: { type: String },

    position: { type: String },
    qualification: { type: String },
    experience: { type: String },
    jobExpire: { type: Date },

    type: { type: String, required: true },
    salary: { type: String },

    benefits: [{ type: String }],

    applyLink: { type: String, required: true },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      required: true,
      index: true,
    },

    postedBy: { type: Schema.Types.ObjectId, ref: "account", required: true },
    posterRole: {
      type: String,
      enum: ["ORGANIZER", "SUPER_ADMIN", "EXHIBITOR", "STAFF"],
      required: true,
    },

    eventId: { type: Schema.Types.ObjectId, ref: "Event" },
  },
  { timestamps: true },
);

export const job_model = model<T_Job>("job", job_schema);
