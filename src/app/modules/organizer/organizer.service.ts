import httpStatus from "http-status";
import { Event_Model } from "../superAdmin/event.schema";
import { AppError } from "../../utils/app_error";

const get_my_events_from_db = async (user: any) => {
  if (!user?.email) {
    throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
  }

  return Event_Model.find({ organizerEmails: user.email });
};

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
export const organizer_service = {
  get_my_events_from_db,
  update_my_event_in_db,
};
