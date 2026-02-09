import { Schema, model } from "mongoose";
import { T_Sponsor } from "./sponsor.interface";

const sponsor_schema = new Schema<T_Sponsor>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    sponsorId: {
      type: Schema.Types.ObjectId,
      ref: "account",
      required: true,
      index: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    logoUrl: {
      type: String,
      required: true,
    },
    websiteUrl: {
      type: String,
    },
    publicEmail: {
      type: String,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

sponsor_schema.index({ eventId: 1, sponsorId: 1 }, { unique: true });

export const sponsor_model = model<T_Sponsor>("sponsor", sponsor_schema);
