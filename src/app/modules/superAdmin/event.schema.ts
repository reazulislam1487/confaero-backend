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
    bannerImageUrl: { type: String },
    floorMapImageUrl: [{ type: String }],
    agenda: {
      sessions: {
        type: [
          {
            title: String,
            floorMapLocation: String,
            date: String,
            time: String,
            details: String,
          },
        ],
        default: [],
      },
    },
    participants: [
      {
        accountId: {
          type: Schema.Types.ObjectId,
          ref: "account",
        },
        role: {
          type: String,
          enum: [
            "ATTENDEE",
            "SPEAKER",
            "STAFF",
            "EXHIBITOR",
            "VOLUNTEER",
            "TRACK_CHAIR",
            "SPONSOR",
            "ABSTRACT_REVIEWER",
          ],
          default: "ATTENDEE",
        },
        sessionIndex: {
          type: Number, //  agenda.sessions[index]
        },
      },
    ],
  },
  { timestamps: true },
);

export const Event_Model = model("Event", eventSchema);
