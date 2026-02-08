import { Schema, model } from "mongoose";
import { T_Booth, T_BoothStaff } from "./booth.interface";

const booth_schema = new Schema<T_Booth>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    exhibitorId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    banner: {
      type: String,
    },

    offerTitle: {
      type: String,
      trim: true,
    },

    boothOpening: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2500,
    },

    boothNumber: {
      type: String,
      trim: true,
    },

    websiteUrl: {
      type: String,
      trim: true,
    },

    publicEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },

    resources: [
      {
        name: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ["pdf", "image", "link"],
          default: "pdf",
        },
      },
    ],

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    isAccepted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

booth_schema.index({ eventId: 1, exhibitorId: 1 }, { unique: true });

const booth_staff_schema = new Schema<T_BoothStaff>(
  {
    boothId: {
      type: Schema.Types.ObjectId,
      ref: "booth",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "account",
      required: true,
      index: true,
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: "account",
      required: true,
    },
  },
  { timestamps: true },
);

booth_staff_schema.index({ boothId: 1, userId: 1 }, { unique: true });

export const booth_staff_model = model<T_BoothStaff>(
  "booth_staff",
  booth_staff_schema,
);

export const booth_model = model<T_Booth>("booth", booth_schema);
