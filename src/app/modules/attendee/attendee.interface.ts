import { Types } from "mongoose";

export type T_Attendee_Registration = {
  user: Types.ObjectId;
  event: Types.ObjectId;
  status: "PENDING" | "VERIFIED";
  paymentProvider: "STRIPE" | "FREE";
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  amount?: number;
  currency?: string;
};
