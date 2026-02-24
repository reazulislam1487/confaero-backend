import { Request, Response } from "express";
import Stripe from "stripe";
import { Organizer_Model } from "../modules/superAdmin/superAdmin.schema";
import { stripe } from "../configs/stripe";
import { configs } from "../configs";
import mongoose from "mongoose";

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
      // Stripe says: this organizer can now receive payments
      if (account.charges_enabled === true) {
        await Organizer_Model.findOneAndUpdate(
          { stripeAccountId: account.id },
          { stripeConnected: true },
        );
      }
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
      console.log("PaymentIntent was successful!", paymentIntent.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Always respond 200
  res.json({ received: true });
};
