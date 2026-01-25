import httpStatus from "http-status";
import { Event_Model } from "../superAdmin/event.schema";
import { AppError } from "../../utils/app_error";
import { UserProfile_Model } from "../user/user.schema";

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

// for agenda
const get_event_fun = async (eventId: any) => {
  const event = await Event_Model.findById(eventId);
  if (!event) {
    throw new AppError("Event not found", httpStatus.NOT_FOUND);
  }
  return event;
};

// 🔹 All Sessions
export const get_all_sessions = async (user: any, eventId: any, query: any) => {
  const event: any = await get_event_fun(eventId);

  let sessions = event.agenda?.sessions || [];

  if (query.date) {
    sessions = sessions.filter((s: any) => s.date === query.date);
  }

  if (query.month) {
    sessions = sessions.filter((s: any) => s.date?.startsWith(query.month));
  }

  return sessions;
};

// 🔹 My Agenda
export const get_my_agenda = async (user: any, eventId: any, query: any) => {
  const event: any = await get_event_fun(eventId);

  // const participant = event.participants.find(
  //   (p: any) => p.accountId === user.id,
  // );
  // ✅ FIX 1: proper ObjectId comparison
  let participant = event.participants.find(
    (p: any) => String(p.accountId) === String(user.id),
  );
  if (!participant) return [];

  let sessions = participant.sessionIndex
    .map((i: number) => event.agenda.sessions[i])
    .filter(Boolean);

  if (query.date) {
    sessions = sessions.filter((s: any) => s.date === query.date);
  }

  if (query.month) {
    sessions = sessions.filter((s: any) => s.date?.startsWith(query.month));
  }

  return sessions;
};

// 🔹 Bookmark
export const add_to_my_agenda = async (
  user: any,
  eventId: any,
  sessionIndex: number,
) => {
  const event: any = await get_event_fun(eventId);

  if (!event.agenda.sessions[sessionIndex]) {
    throw new AppError("Invalid session index", httpStatus.BAD_REQUEST);
  }

  // ✅ FIX 1: proper ObjectId comparison
  let participant = event.participants.find(
    (p: any) => String(p.accountId) === String(user.id),
  );

  // ✅ FIX 2: push via mongoose subdocument
  if (!participant) {
    event.participants.push({
      accountId: user.id,
      role: "ATTENDEE",
      sessionIndex: [sessionIndex],
    });

    await event.save();
    return [sessionIndex];
  }

  // ✅ Prevent duplicate
  if (participant.sessionIndex.includes(sessionIndex)) {
    throw new AppError("Session already bookmarked", httpStatus.CONFLICT);
  }

  participant.sessionIndex.push(sessionIndex);

  // ✅ Ensure mongoose detects change
  event.markModified("participants");
  await event.save();

  return participant.sessionIndex;
};

// 🔹 Unbookmark
export const remove_from_my_agenda = async (
  user: any,
  eventId: any,
  sessionIndex: number,
) => {
  const event: any = await get_event_fun(eventId);

  let participant = event.participants.find(
    (p: any) => String(p.accountId) === String(user.id),
  );

  if (!participant) {
    throw new AppError("Nothing to remove", httpStatus.BAD_REQUEST);
  }

  participant.sessionIndex = participant.sessionIndex.filter(
    (i: number) => i !== sessionIndex,
  );

  await event.save();
  return participant.sessionIndex;
};

export const get_single_agenda_session = async (
  user: any,
  eventId: any,
  sessionIndex: number,
) => {
  const event: any = await Event_Model.findById(eventId);

  if (!event) {
    throw new AppError("Event not found", httpStatus.NOT_FOUND);
  }

  const session = event.agenda.sessions[sessionIndex];

  if (!session) {
    throw new AppError("Invalid session index", httpStatus.BAD_REQUEST);
  }

  const speakers = event.participants.filter((p: any) => p.role === "SPEAKER");

  return {
    session,
    speakers,
  };
};

// detail for speaker
export const get_speaker_profile_from_db = async (
  user: any,
  eventId: any,
  speakerId: any,
) => {
  // 🔹 Event check
  const event: any = await Event_Model.findById(eventId);

  if (!event) {
    throw new AppError("Event not found", httpStatus.NOT_FOUND);
  }

  // 🔹 Speaker participant check (event-wise)
  const participant = event.participants.find(
    (p: any) =>
      p.role === "SPEAKER" && String(p.accountId) === String(speakerId),
  );

  if (!participant) {
    throw new AppError("Speaker not found in this event", httpStatus.NOT_FOUND);
  }

  // 🔹 Speaker profile (from user_profile)
  const profile = await UserProfile_Model.findOne({
    accountId: speakerId,
  });

  if (!profile) {
    throw new AppError("Speaker profile not found", httpStatus.NOT_FOUND);
  }

  // 🔹 Sessions where speaker is speaking
  const speakingAt = participant.sessionIndex
    .map((index: number) => event.agenda.sessions[index])
    .filter(Boolean);

  return {
    speaker: {
      accountId: profile.accountId,
      name: profile.name,
      avatar: profile.avatar,
      about: profile.about,
      location: profile.location,
      affiliations: profile.affiliations,
      socialLinks: profile.socialLinks,
      personalWebsites: profile.personalWebsites,
    },
    speakingAt,
  };
};

// export { bulk_add_sessions };
