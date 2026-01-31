import { Schema, model } from "mongoose";
import { T_OrganizerNotification } from "./messageOrganizer.interface";

const organizer_notification_schema = new Schema<T_OrganizerNotification>(
  {
    eventId: { type: Schema.Types.ObjectId, required: true },
    receiverId: { type: Schema.Types.ObjectId, required: true },

    type: {
      type: String,
      enum: ["SESSION_CREATED", "SESSION_UPDATED"],
      required: true,
    },

    refId: { type: Schema.Types.ObjectId }, // sessionId
   title: { type: String, required: true },   // 👈 UI title
    message: { type: String, required: true }, // 👈 details text
    isRead: { type: Boolean, default: false },

    sendToEmail: { type: Boolean, default: false }, // ✅ optional email
  },
  { timestamps: true },
);

export const organizer_notification_model = model(
  "organizer_notification",
  organizer_notification_schema,
);
