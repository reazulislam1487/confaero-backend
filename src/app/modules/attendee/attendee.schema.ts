import { Schema, model } from "mongoose";
import { T_Attendee_Registration } from "./attendee.interface";

const attendee_schema = new Schema<T_Attendee_Registration>(
  {
    account: { type: Schema.Types.ObjectId, ref: "account", required: true },
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    status: {
      type: String,
      enum: ["PENDING", "VERIFIED"],
      default: "VERIFIED",
    },
    paymentProvider: {
      type: String,
      enum: ["STRIPE", "FREE"],
      default: "FREE",
    },
    stripeSessionId: String,
    stripePaymentIntentId: String,
    amount: Number,
    currency: String,
  },
  { timestamps: true },
);

export const attendee_model = model("attendee_registration", attendee_schema);
