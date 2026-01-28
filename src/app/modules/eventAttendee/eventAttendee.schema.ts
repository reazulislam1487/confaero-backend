import { Schema, model, Types } from "mongoose";

const eventAttendeeBookmarkSchema = new Schema(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "event",
      required: true,
    },
    viewerAccountId: {
      type: Schema.Types.ObjectId,
      ref: "account",
      required: true,
    },
    attendeeAccountId: {
      type: Schema.Types.ObjectId,
      ref: "account",
      required: true,
    },
  },
  { timestamps: true },
);

// prevent duplicate bookmark
eventAttendeeBookmarkSchema.index(
  { eventId: 1, viewerAccountId: 1, attendeeAccountId: 1 },
  { unique: true },
);

export const EventAttendeeBookmark_Model = model(
  "event_attendee_bookmark",
  eventAttendeeBookmarkSchema,
);
