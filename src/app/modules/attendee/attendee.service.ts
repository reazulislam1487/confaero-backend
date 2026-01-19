import { Event_Model } from "../superAdmin/event.schema";
import { attendee_model } from "./attendee.schema";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import { AppError } from "../../utils/app_error";
import httpStatus from "http-status";

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
    (p: any) => p.userId.toString() === userId.toString(),
  );

  if (alreadyJoined) {
    throw new AppError(
      "You already registered for this event",
      httpStatus.NOT_FOUND,
    );
  }

  // push participant
  await Event_Model.findByIdAndUpdate(eventId, {
    $push: {
      participants: {
        userId,
        role: "attendee",
      },
    },
  });

  return attendee_model.create({
    user: userId,
    event: eventId,
    status: "VERIFIED",
    paymentProvider: "FREE",
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
};
