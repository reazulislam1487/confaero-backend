import { Schema, model, Types } from "mongoose";

const attendanceSchema = new Schema(
  {
    eventId: {
      type: Types.ObjectId,
      ref: "Event",
      required: true,
    },

    attendeeId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    checkedInBy: {
      type: Types.ObjectId,
      ref: "User", // Volunteer
      required: true,
    },

    checkedInAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// 🔒 Prevent duplicate check-in
attendanceSchema.index({ eventId: 1, attendeeId: 1 }, { unique: true });

// lead schema
const leadSchema = new Schema(
  {
    eventId: {
      type: Types.ObjectId,
      ref: "Event",
      required: true,
    },

    exhibitorId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    attendeeId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    source: {
      type: String,
      enum: ["QR_SCAN"],
      default: "QR_SCAN",
    },
  },
  {
    timestamps: true,
  },
);

// 🔒 Prevent duplicate lead per exhibitor
leadSchema.index(
  { eventId: 1, exhibitorId: 1, attendeeId: 1 },
  { unique: true },
);

export const Lead = model("Lead", leadSchema);

export const Attendance = model("Attendance", attendanceSchema);
