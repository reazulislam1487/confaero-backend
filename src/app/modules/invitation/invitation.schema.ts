import { Schema, model } from "mongoose";

const invitation_schema = new Schema(
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

    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },

    role: {
      type: String,
      enum: [
        "SPEAKER",
        "STAFF",
        "EXHIBITOR",
        "VOLUNTEER",
        "TRACK_CHAIR",
        "SPONSOR",
        "ABSTRACT_REVIEWER",
      ],
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true },
);

export const invitation_model = model("invitation", invitation_schema);
