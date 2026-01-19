import { Schema, model } from "mongoose";
import { T_Invitation } from "./invitation.interface";

const invitation_schema = new Schema<T_Invitation>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    organizerId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["ATTENDEE", "EXHIBITOR", "VOLUNTEER", "SPEAKER"],
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      default: "PENDING",
      enum: ["PENDING", "ACCEPTED", "REJECTED", "EXPIRED"],
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

export const invitation_model = model("invitation", invitation_schema);
