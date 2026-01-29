import { Schema, model } from "mongoose";
import { T_OrganizerNotification } from "./messageOrganizer.interface";

const organizer_notification_schema = new Schema<T_OrganizerNotification>(
  {
    eventId: { type: Schema.Types.ObjectId, required: true },
    receiverId: { type: Schema.Types.ObjectId, required: true },
    type: { type: String, required: true },
    refId: { type: Schema.Types.ObjectId },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const organizer_notification_model = model(
  "organizer_notification",
  organizer_notification_schema,
);
