import Stripe from "stripe";
import { configs } from ".";

export const stripe = new Stripe(configs.new.stripe_secret_key!, {
  apiVersion: "2023-10-16" as any,
});
