import { Schema, model, Types } from "mongoose";

const eventSchema = new Schema(
  {
    title: { type: String, required: true },
    website: { type: String },
    location: { type: String, required: true },
    googleMapLink: { type: String },

    eventType: {
      type: String,
      enum: ["OFFLINE", "ONLINE", "HYBRID"],
      default: "OFFLINE",
    },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    expectedAttendee: { type: Number },
    boothSlot: { type: Number },
    details: { type: String },

    organizers: [{ type: Types.ObjectId, ref: "Account", required: true }],
    organizerEmails: [{ type: String }],
    bannerImageUrl: { type: String },
    floorMaps: {
      type: [
        {
          title: {
            type: String,
            required: true,
            trim: true,
          },
          imageUrl: {
            type: String,
            required: true,
          },
          order: {
            type: Number,
            default: 0,
          },
        },
      ],
      default: [],
    },
    agenda: {
      sessions: {
        type: [
          {
            title: String,
            floorMapLocation: String,
            date: String,
            time: String,
            details: String,
            bookmarkCount: {
              type: Number,
              default: 0,
            },
            likesCount: {
              type: Number,
              default: 0,
            },
            //  online / live support
            isOnline: {
              type: Boolean,
              default: false,
            },

            liveProvider: {
              type: String,
              enum: ["ZEGO"],
            },

            roomId: {
              type: String,
            },

            liveStatus: {
              type: String,
              enum: ["NOT_STARTED", "LIVE", "ENDED"],
              default: "NOT_STARTED",
            },

            startedAt: Date,
            endedAt: Date,
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
          type: [Number],
          default: [],
        },
      },
    ],
  },
  { timestamps: true },
);

export const Event_Model = model("Event", eventSchema);
