import { Types } from "mongoose";

export type T_Attendee_Registration = {
  account: Types.ObjectId;
  event: Types.ObjectId;
  status: "PENDING" | "VERIFIED";
  paymentProvider: "STRIPE" | "FREE" | "EXTERNAL" | "EMAIL_VERIFICATION";
  stripeSessionId?: string;
  referenceId?: string;
  stripePaymentIntentId?: string;
  amount?: number;
  currency?: string;
};
