import { Event_Model } from "../superAdmin/event.schema";
import { attendee_model } from "./attendee.schema";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import { AppError } from "../../utils/app_error";
import httpStatus from "http-status";
import { Organizer_Model } from "../superAdmin/superAdmin.schema";
import { stripe } from "../../configs/stripe";
import { verify_email_model } from "../verifyEmail/verifyEmail.schema";

const get_all_upcoming_events_from_db = async () => {
  const now = new Date();
  return Event_Model.find({ startDate: { $gte: now } }).sort({ startDate: 1 });
};

const register_attendee_into_event = async (
  userId: Types.ObjectId,
  eventId: any,
) => {
  const exists = await attendee_model.findOne({ user: userId, event: eventId });
  if (exists) return exists;

  const event = await Event_Model.findById(eventId);
  if (!event) {
    throw new AppError("Account not found", httpStatus.NOT_FOUND);
  }

  // already joined check
  const alreadyJoined = event.participants.find(
    (p: any) => p.accountId.toString() === userId.toString(),
  );

  if (alreadyJoined) {
    throw new AppError(
      "You already registered for this event",
      httpStatus.NOT_FOUND,
    );
  }

  await Event_Model.findByIdAndUpdate(eventId, {
    $push: {
      participants: {
        accountId: userId,
        role: "ATTENDEE",
        sessionIndex: [],
      },
    },
  });

  return attendee_model.create({
    account: userId,
    event: eventId,
    status: "VERIFIED",
    paymentProvider: "FREE",
  });
};

const initiate_attendee_registration = async (
  userId: Types.ObjectId,
  userEmail: any,
  eventId: Types.ObjectId,
) => {
  const event = await Event_Model.findById(eventId);
  if (!event) {
    throw new AppError("Event not found", httpStatus.NOT_FOUND);
  }

  const alreadyRegistered = await attendee_model.findOne({
    account: userId,
    event: eventId,
    status: "VERIFIED",
  });

  if (alreadyRegistered) {
    throw new AppError(
      "You already registered for this event",
      httpStatus.BAD_REQUEST,
    );
  }

  /* ======================================================
     🟢 STEP 1: GLOBAL EMAIL VERIFICATION CHECK
     ====================================================== */
  const verifyEmail = await verify_email_model.findOne({
    event: eventId,
    email: userEmail.toLowerCase(),
    isUsed: false,
  });

  if (verifyEmail) {
    // mark email as used
    verifyEmail.isUsed = true;
    verifyEmail.usedBy = userId;
    verifyEmail.usedAt = new Date();
    await verifyEmail.save();

    // direct registration (same as normal success)
    await Event_Model.findByIdAndUpdate(eventId, {
      $push: {
        participants: {
          accountId: userId,
          role: "ATTENDEE",
          sessionIndex: [],
        },
      },
    });

    return attendee_model.create({
      account: userId,
      event: eventId,
      status: "VERIFIED",
      paymentProvider: event.paymentType, // 🔑 keep original type
    });
  }

  /* ======================================================
     🟡 STEP 2: NORMAL FLOW (NO VERIFIED EMAIL)
     ====================================================== */

  // ---------- EXTERNAL ----------
  if (event.paymentType === "EXTERNAL") {
    const registration = await attendee_model.create({
      account: userId,
      event: eventId,
      status: "PENDING",
      paymentProvider: "EXTERNAL",
      referenceId: "u123456", // replace with uuid later
    });

    return {
      redirectUrl: `${event.externalPaymentUrl}?ref=${registration.referenceId}`,
    };
  }

  // ---------- STRIPE ----------
  if (event.paymentType === "STRIPE") {
    if (!event.price) {
      throw new AppError(
        "Paid event must have a valid price",
        httpStatus.BAD_REQUEST,
      );
    }

    const organizer = await Organizer_Model.findOne({
      accountId: { $in: event.organizers },
      stripeConnected: true,
    });

    if (!organizer || !organizer.stripeAccountId) {
      throw new AppError(
        "Organizer is not ready for Stripe payments",
        httpStatus.BAD_REQUEST,
      );
    }

    const amount = Math.round(Number(event.price) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        userId: userId.toString(),
        eventId: eventId.toString(),
      },
      transfer_data: {
        destination: organizer.stripeAccountId,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
    };
  }

  /* ======================================================
     ❌ FALLBACK
     ====================================================== */
  throw new AppError(
    "Invalid event payment configuration",
    httpStatus.BAD_REQUEST,
  );
};

// create real register flow
// const initiate_attendee_registration = async (
//   userId: Types.ObjectId,
//   userEmail: any,
//   eventId: Types.ObjectId,
// ) => {
//   const event = await Event_Model.findById(eventId);
//   if (!event) {
//     throw new AppError("Event not found", httpStatus.NOT_FOUND);
//   }

//   const alreadyRegistered = await attendee_model.findOne({
//     account: userId,
//     event: eventId,
//   });

//   if (alreadyRegistered) {
//     throw new AppError(
//       "You already registered for this event",
//       httpStatus.BAD_REQUEST,
//     );
//   }
//   // verify mails for all mails check
//   if (event.paymentType === "EMAIL_VERIFICATION") {
//     const verifyEmail = await verify_email_model.findOne({
//       event: eventId,
//       email: userEmail, // assuming user's email is same as organizer's email, adjust if needed
//       isUsed: false,
//     });
//     console.log(verifyEmail)

//     if (verifyEmail) {
//       // mark as used
//       verifyEmail.isUsed = true;
//       verifyEmail.usedBy = userId;
//       verifyEmail.usedAt = new Date();
//       await verifyEmail.save();

//       // directly register attendee without payment
//       await Event_Model.findByIdAndUpdate(eventId, {
//         $push: {
//           participants: {
//             accountId: userId,
//             role: "ATTENDEE",
//             sessionIndex: [],
//           },
//         },
//       });

//       return attendee_model.create({
//         account: userId,
//         event: eventId,
//         status: "VERIFIED",
//         paymentProvider: "EMAIL_VERIFICATION",
//       });
//     }
//   }
//   if (event.paymentType === "EXTERNAL") {
//     // external flow

//     // const alreadyRegistered = await attendee_model.findOne({
//     //   account: userId,
//     //   event: eventId,
//     // });

//     // if (alreadyRegistered) {
//     //   throw new AppError(
//     //     "You already registered for this event",
//     //     httpStatus.BAD_REQUEST,
//     //   );
//     // }

//     const registration = await attendee_model.create({
//       account: userId,
//       event: eventId,
//       status: "PENDING",
//       paymentProvider: "EXTERNAL",
//       referenceId: "u123456", //fake uuid
//       // referenceId: uuid(), // VERY IMPORTANT
//     });
//     return {
//       redirectUrl: `${event.externalPaymentUrl}?ref=${registration.referenceId}`,
//     };
//   }
//   // if (event.paymentType !== "STRIPE") {
//   //   throw new AppError("This event is not paid", httpStatus.BAD_REQUEST);
//   // }

//   // organizer stripe check (VERY IMPORTANT)
//   const organizer = await Organizer_Model.findOne({
//     accountId: { $in: event.organizers },
//     stripeConnected: true,
//   });
//   console.log(organizer);
//   if (!organizer) {
//     throw new AppError(
//       "Organizer has not completed Stripe onboarding",
//       httpStatus.BAD_REQUEST,
//     );
//   }

//   // already registered check
//   // const alreadyRegistered = await attendee_model.findOne({
//   //   account: userId,
//   //   event: eventId,
//   // });

//   // if (alreadyRegistered) {
//   //   throw new AppError(
//   //     "You already registered for this event",
//   //     httpStatus.BAD_REQUEST,
//   //   );
//   // }

//   // again start normal stripe flow if verify email not found or already used
//   if (event.paymentType === "STRIPE" && !event.price) {
//     throw new AppError(
//       "Paid event must have a valid price",
//       httpStatus.BAD_REQUEST,
//     );
//   }

//   // Stripe payment intent create করার আগে organizer এর stripe account id থাকা দরকার
//   if (!organizer.stripeAccountId) {
//     throw new AppError(
//       "Organizer Stripe account is missing",
//       httpStatus.BAD_REQUEST,
//     );
//   }
//   const amount = Math.round(Number(event.price) * 100);

//   const paymentIntent = await stripe.paymentIntents.create({
//     amount,
//     currency: "usd",
//     automatic_payment_methods: { enabled: true },
//     metadata: {
//       userId: userId.toString(),
//       eventId: eventId.toString(),
//     },
//     transfer_data: {
//       destination: organizer.stripeAccountId,
//     },
//   });

//   return {
//     clientSecret: paymentIntent.client_secret,
//   };
// };

// register for create attendee after successful payment
export const finalize_attendee_registration = async (
  userId: string,
  eventId: string,
  paymentIntentId: string,
) => {
  const exists = await attendee_model.findOne({
    account: userId,
    event: eventId,
  });

  if (exists) return exists;

  await Event_Model.findByIdAndUpdate(eventId, {
    $push: {
      participants: {
        accountId: userId,
        role: "ATTENDEE",
        sessionIndex: [],
      },
    },
  });

  return attendee_model.create({
    account: userId,
    event: eventId,
    status: "VERIFIED",
    paymentProvider: "STRIPE",
    stripePaymentIntentId: paymentIntentId,
  });
};

const get_my_registered_events_from_db = async (userId: Types.ObjectId) => {
  return attendee_model.find({ user: userId }).populate("event");
};

//
const get_single_event_from_db = async (eventId: Types.ObjectId) => {
  const event = await Event_Model.findById(eventId).lean();
  return event;
};

const get_event_sessions_from_db = async (eventId: Types.ObjectId) => {
  const event = (await Event_Model.findById(eventId)
    .select("agenda")
    .lean()) as { agenda?: any[] };

  return event?.agenda || [];
};

const get_event_home_from_db = async (eventId: any) => {
  const event = await Event_Model.findById(eventId)
    .select(
      "title bannerImageUrl location startDate endDate sponsors sessions speakers exhibitors resources",
    )
    .lean();

  if (!event) return null;

  return {
    eventInfo: {
      title: event.title,
      banner: event.bannerImageUrl,
      venue: event.location,
      startDate: event.startDate,
      endDate: event.endDate,
    },
    quickLinks: {
      speakers: event.speakers?.length || 0,
      exhibitors: event.exhibitors?.length || 0,
      resources: event.resources?.length || 0,
    },
    sponsors: event.sponsors || [],
  };
};

const QR_SECRET = process.env.QR_SECRET as string;

const generate_qr_token_from_db = async (
  attendeeId: Types.ObjectId,
  eventId: any,
) => {
  const payload = {
    attendeeId,
    eventId,
    type: "ATTENDEE_QR",
  };

  const token = jwt.sign(payload, QR_SECRET, {
    expiresIn: "12h", // event duration অনুযায়ী adjust করতে পারো
  });

  return {
    qrToken: token,
  };
};
export const attendee_service = {
  get_all_upcoming_events_from_db,
  register_attendee_into_event,
  get_my_registered_events_from_db,
  get_single_event_from_db,
  get_event_sessions_from_db,
  get_event_home_from_db,
  generate_qr_token_from_db,
  initiate_attendee_registration,
};
