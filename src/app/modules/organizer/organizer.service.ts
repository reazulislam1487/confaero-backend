import httpStatus from "http-status";
import { Event_Model } from "../superAdmin/event.schema";
import { AppError } from "../../utils/app_error";
import { User_Model, UserProfile_Model } from "../user/user.schema";
import { Account_Model } from "../auth/auth.schema";
import { attendee_model } from "../attendee/attendee.schema";
type TSession = {
  title: string;
  floorMapLocation?: string;
  date: string;
  time: string;
  details?: string;
};

type TAgenda = {
  sessions: TSession[];
};
const get_my_events_from_db = async (user: any) => {
  if (!user?.email) {
    throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
  }

  return Event_Model.find({ organizerEmails: user.email });
};

const update_my_event_in_db = async (user: any, eventId: any, payload: any) => {
  const event = await Event_Model.findById(eventId);

  if (!event) {
    throw new AppError("Event not found", httpStatus.NOT_FOUND);
  }

  if (!event.organizerEmails.includes(user.email)) {
    throw new AppError("Forbidden", httpStatus.FORBIDDEN);
  }

  if (payload.__session) {
    //  SAFE CAST ONLY agenda
    const agenda = (event.agenda ?? { sessions: [] }) as TAgenda;

    agenda.sessions = agenda.sessions || [];
    agenda.sessions.push(payload.__session as TSession);

    event.agenda = agenda;
    delete payload.__session;
  }
  event.participants = [];

  /* ---------- LOCKED ---------- */
  delete payload.title;
  delete payload.googleMapLink;

  Object.assign(event, payload);
  await event.save();

  return event;
};

const get_all_register_from_db = async (user: any) => {
  if (!user?.email) {
    throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
  }

  // 1️⃣ organizer er event gula
  const events = await Event_Model.find({
    organizerEmails: user.email,
  }).select("_id");

  const eventIds = events.map((e: any) => e._id);

  // 2️⃣ attendee registrations
  const registrations = await attendee_model
    .find({
      event: { $in: eventIds },
      status: "VERIFIED",
    })
    .populate({
      path: "user",
      select: "name accountId",
    })
    .populate({
      path: "event",
      select: "title",
    });

  // 3️⃣ accountIds collect
  const accountIds = registrations.map((r: any) => r.user?.accountId);

  // 4️⃣ accounts
  const accounts = await Account_Model.find({
    _id: { $in: accountIds },
  }).select("email");

  // 5️⃣ profiles
  const profiles = await UserProfile_Model.find({
    accountId: { $in: accountIds },
  }).select("location accountId");

  // 6️⃣ maps
  const accountMap = new Map(accounts.map((a: any) => [a._id.toString(), a]));

  const profileMap = new Map(
    profiles.map((p: any) => [p.accountId.toString(), p]),
  );

  // 7️⃣ FINAL response
  return registrations.map((r: any) => {
    const accId = r.user?.accountId?.toString();

    return {
      userId: r.user?._id,
      name: r.user?.name,
      email: accountMap.get(accId)?.email,
      address: profileMap.get(accId)?.location,
      status: r.status,
      eventId: r.event?._id,
      eventTitle: r.event?.title,
    };
  });
};

export const organizer_service = {
  get_my_events_from_db,
  update_my_event_in_db,
  get_all_register_from_db,
};
