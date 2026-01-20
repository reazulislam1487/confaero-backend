import httpStatus from "http-status";
import { Event_Model } from "../superAdmin/event.schema";
import { AppError } from "../../utils/app_error";

type TSession = {
  title: string;
  floorMapLocation?: string;
  date: string;
  time: string;
  type?: string;
  details?: string;
};

const get_event = async (user: any, eventId: any) => {
  const event: any = await Event_Model.findById(eventId);

  if (!event) {
    throw new AppError("Event not found", httpStatus.NOT_FOUND);
  }

  if (!event.organizerEmails.includes(user.email)) {
    throw new AppError("Forbidden", httpStatus.FORBIDDEN);
  }

  // ensure agenda structure
  if (!event.agenda) {
    event.agenda = { sessions: [] };
  }

  if (!Array.isArray(event.agenda.sessions)) {
    event.agenda.sessions = [];
  }

  return event;
};

export const get_sessions = async (user: any, eventId: any) => {
  const event = await get_event(user, eventId);
  return event.agenda.sessions;
};

export const get_single_session = async (
  user: any,
  eventId: any,
  sessionId: any,
) => {
  const event = await get_event(user, eventId);

  const session = event.agenda.sessions.find(
    (s: any) => s._id.toString() === sessionId,
  );

  if (!session) {
    throw new AppError("Session not found", httpStatus.NOT_FOUND);
  }

  return session;
};
export const add_session = async (
  user: any,
  eventId: any,
  payload: TSession,
) => {
  const event = await get_event(user, eventId);

  event.agenda.sessions.push(payload);
  await event.save();

  return event.agenda.sessions;
};

export const update_session = async (
  user: any,
  eventId: any,
  sessionId: any,
  payload: Partial<TSession>,
) => {
  const event = await get_event(user, eventId);

  const session = event.agenda.sessions.find(
    (s: any) => s._id.toString() === sessionId,
  );

  if (!session) {
    throw new AppError("Session not found", httpStatus.NOT_FOUND);
  }

  Object.assign(session, payload);
  await event.save();

  return session;
};

export const delete_session = async (
  user: any,
  eventId: any,
  sessionId: any,
) => {
  const event = await get_event(user, eventId);

  event.agenda.sessions = event.agenda.sessions.filter(
    (s: any) => s._id.toString() !== sessionId,
  );

  await event.save();
  return event.agenda.sessions;
};

export const bulk_add_sessions = async (
  user: any,
  eventId: string,
  sessions: any[],
) => {
  const event = await get_event(user, eventId);
  event.agenda.sessions.push(...sessions);
  await event.save();
  return event.agenda.sessions;
};

// export { bulk_add_sessions };
