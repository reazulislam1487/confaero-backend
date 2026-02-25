import { Schema, model } from "mongoose";
import { T_VerifyEmail } from "./verifyEmail.interface";

const verify_email_schema = new Schema<T_VerifyEmail>(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "event",
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    usedBy: {
      type: Schema.Types.ObjectId,
      ref: "account",
    },
    usedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// 🔐 prevent duplicate email per event
verify_email_schema.index({ event: 1, email: 1 }, { unique: true });

export const verify_email_model = model(
  "verify_email",
  verify_email_schema
);