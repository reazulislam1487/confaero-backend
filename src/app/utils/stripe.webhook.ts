import { Request, Response } from "express";
import Stripe from "stripe";
import { Organizer_Model } from "../modules/superAdmin/superAdmin.schema";
import { stripe } from "../configs/stripe";
import { configs } from "../configs";
import mongoose from "mongoose";
import { finalize_attendee_registration } from "../modules/attendee/attendee.service";

export const stripeWebhookController = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      configs.new.webhook_secret as string,
    );
  } catch (err: any) {
    console.error("❌ Stripe Webhook Signature Failed", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  console.log("Webhook event received:", event.type);
  // ✅ Handle events
  switch (event.type) {
    case "account.updated": {
      const account = event.data.object as Stripe.Account;
      // Seamlessly sync account status to DB
      await Organizer_Model.findOneAndUpdate(
        { stripeAccountId: account.id },
        { 
          stripeConnected: account.charges_enabled && account.payouts_enabled,
          stripeChargesEnabled: account.charges_enabled,
          stripePayoutsEnabled: account.payouts_enabled
        }
      );
      /*       console.log("this is account:", account.id);
      const exists = await Organizer_Model.findOne({
        stripeAccountId: account.id,
      });

      console.log("Organizer exists?", !!exists);
      const updatedOrganizer = await Organizer_Model.findOneAndUpdate(
        { stripeAccountId: account.id },
        { stripeConnected: true },
        { new: true }, // ⬅️ important
      );

      console.log("Updated organizer:", updatedOrganizer);
      console.log("DB name:", mongoose.connection.name); */
      break;
    }
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const intent = event.data.object;

      await finalize_attendee_registration(
        intent.metadata.userId,
        intent.metadata.eventId,
        intent.id,
      );
      console.log("PaymentIntent was successful!", paymentIntent.id);
      break;
    }
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log("❌ Payment failed for intent:", paymentIntent.id);
      
      // Optionally notify the frontend or delete pending attendee model logic here
      // if tracking PENDING attendee state (currently attendee registration ignores failures 
      // and leaves them out of db/verified status)
      
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Always respond 200
  res.json({ received: true });
};
