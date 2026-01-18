import { Schema, model } from "mongoose";
import { TOrganizer } from "./superAdmin.interface";

const organizerSchema = new Schema<TOrganizer>(
  {
    accountId: {
      type: Schema.Types.ObjectId,
      ref: "account", // reference to Account_Model
      required: true,
      unique: true, // one account → one organizer profile
    },

    organizationName: {
      type: String,
      required: true,
      trim: true,
    },

    verifiedBySuperAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Organizer_Model = model<TOrganizer>("organizer", organizerSchema);
