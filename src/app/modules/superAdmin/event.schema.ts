import { Schema, model, Types } from "mongoose";

const eventSchema = new Schema(
  {
    title: { type: String, required: true },
    website: { type: String },
    location: { type: String, required: true },
    googleMapLink: { type: String },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    expectedAttendee: { type: Number },
    boothSlot: { type: Number },
    details: { type: String },

    organizers: [{ type: Types.ObjectId, ref: "Account", required: true }],
    organizerEmails: [{ type: String }],
  },
  { timestamps: true }
);

export const Event_Model = model("Event", eventSchema);
