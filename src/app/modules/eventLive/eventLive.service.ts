import httpStatus from "http-status";
import { Event_Model } from "../superAdmin/event.schema";
import { AppError } from "../../utils/app_error";
import { generateZegoToken } from "../../utils/generateZegoToken";

type zogo = "SPEAKER" | "ATTENDEE";
const start_live_session = async ({
  eventId,
  sessionIndex,
  user,
}: {
  eventId: string;
  sessionIndex: number;
  user: { id: string };
}) => {
  const event: any = await Event_Model.findById(eventId);

  if (!event) {
    throw new AppError("Event not found", 404);
  }

  const session = event.agenda.sessions[Number(sessionIndex)];

  if (!session) {
    throw new AppError("Session not found", 404);
  }
  if (session.liveStatus === "LIVE") {
    throw new AppError("Session already live", 400);
  }

  // only speaker can start
  const isSpeaker = event.participants.some(
    (p: any) =>
      p.accountId?.toString() === String(user.id) && p.role === "SPEAKER",
  );

  if (!isSpeaker) {
    throw new AppError("Only speaker can start live", 403);
  }
  // ✅ ENSURE roomId ONCE
  if (!session.roomId) {
    session.roomId = `${eventId}_${sessionIndex}`;
  }

  session.isOnline = true;
  session.liveProvider = "ZEGO";
  session.liveStatus = "LIVE";
  session.startedAt = new Date();

  await event.save();

  return {
    roomId: session.roomId,
    sessionIndex: Number(sessionIndex),
    liveStatus: "LIVE",
  };
};

const join_live_session = async ({
  eventId,
  sessionIndex,
  user,
}: {
  eventId: string;
  sessionIndex: number;
  user: {
    id: string;
    role: string;
  };
}) => {
  // 1️⃣ Event fetch
  const event: any = await Event_Model.findById(eventId);

  if (!event) {
    throw new AppError("Event not found", httpStatus.NOT_FOUND);
  }

  // 2️⃣ Session fetch by index
  const session = event.agenda?.sessions?.[Number(sessionIndex)];

  if (!session) {
    throw new AppError("Session not found", httpStatus.NOT_FOUND);
  }

  // 🔥 AUTO END LOGIC (ADDED)
  const MAX_SESSION_DURATION = 4 * 60 * 60 * 1000; // 4 hours

  const isSessionExpired = (s: any) => {
    if (!s.startedAt) return false;

    return Date.now() - new Date(s.startedAt).getTime() > MAX_SESSION_DURATION;
  };

  if (session.liveStatus === "LIVE" && isSessionExpired(session)) {
    session.liveStatus = "ENDED";
    session.endedAt = new Date();
    await event.save();

    throw new AppError(
      "Session has ended (time limit reached)",
      httpStatus.BAD_REQUEST,
    );
  }

  // 3️⃣ Live status check
  if (session.liveStatus !== "LIVE") {
    throw new AppError("Session is not live", httpStatus.BAD_REQUEST);
  }

  // 4️⃣ Online + provider check
  if (!session.isOnline) {
    throw new AppError(
      "Session is not a Zego online live session",
      httpStatus.BAD_REQUEST,
    );
  }

  // 5️⃣ Participant validation
  const participant = event.participants.find(
    (p: any) => p.accountId.toString() === user.id,
    // && p.sessionIndex.includes(sessionIndex),
  );

  if (!participant) {
    throw new AppError(
      "User is not assigned to this session",
      httpStatus.FORBIDDEN,
    );
  }

  // 6️⃣ Role validation
  // if (!["SPEAKER", "ATTENDEE"].includes(participant.role)) {
  //   throw new AppError(
  //     "Role not allowed in live session",
  //     httpStatus.FORBIDDEN,
  //   );
  // }
  // 7️⃣ Ensure roomId (create once)
  if (!session.roomId) {
    session.roomId = `${eventId}_${sessionIndex}`;
    session.startedAt = new Date();
    await event.save();
  }

  // 8️⃣ Generate Zego token
  const zegoRole = participant.role === "SPEAKER" ? "SPEAKER" : "ATTENDEE";

  const zegoToken = generateZegoToken(
    user.id,
    zegoRole as zogo,
    session.roomId,
  );

  return {
    sessionIndex,
    roomId: session.roomId,
    role: zegoRole,
    zego: {
      token: zegoToken,
      roomId: session.roomId,
      appId: Number(process.env.ZEGOCLOUD_APP_ID),
    },
  };
};

const end_live_session = async ({
  eventId,
  sessionIndex,
  user,
}: {
  eventId: string;
  sessionIndex: number;
  user: { id: string };
}) => {
  const event: any = await Event_Model.findById(eventId);

  if (!event) {
    throw new AppError("Event not found", 404);
  }

  const session = event.agenda.sessions[Number(sessionIndex)];

  if (!session) {
    throw new AppError("Session not found", 404);
  }

  if (session.liveStatus !== "LIVE") {
    throw new AppError("Session is not live", 400);
  }

  // only speaker can end
  const isSpeaker = event.participants.some(
    (p: any) =>
      p.accountId?.toString() === String(user.id) && p.role === "SPEAKER",
  );

  if (!isSpeaker) {
    throw new AppError("Only speaker can end live", 403);
  }

  // 🔥 END SESSION
  session.liveStatus = "ENDED";
  session.endedAt = new Date();

  await event.save();

  return {
    sessionIndex,
    liveStatus: "ENDED",
    sessionEndedAt: session.endedAt,
    endedBy: user.id,
  };
};
// get speaker sessions
export const get_event_live_sessions = async ({
  eventId,
  userId,
}: {
  eventId: string;
  userId: string;
}) => {
  const event: any = await Event_Model.findById(eventId);

  if (!event) {
    throw new AppError("Event not found", 404);
  }

  const participant = event.participants.find(
    (p: any) => p.accountId.toString() === userId,
  );

  if (!participant) {
    throw new AppError("User is not part of this event", 403);
  }

  // 🟢 SPEAKER FLOW
  if (participant.role === "SPEAKER") {
    const sessions = (event.agenda?.sessions || [])
      .map((s: any, index: number) => {
        if (!s) return null;

        return {
          sessionIndex: index,
          title: s.title,
          date: s.date,
          time: s.time,
          liveStatus: s.liveStatus,
          startedAt: s.startedAt || null,
        };
      })
      .filter(Boolean);

    return {
      role: "SPEAKER",
      sessions,
    };
  }

  if (participant.role === "ATTENDEE") {
    const allSessions = event.agenda?.sessions;

    if (!Array.isArray(allSessions) || allSessions.length === 0) {
      return {
        role: "ATTENDEE",
        message: "No live session is available right now",
        sessions: [],
      };
    }

    const sessions = allSessions
      .map((s: any, index: number) => {
        if (!s) return null;

        return {
          sessionIndex: index,
          title: s.title,
          date: s.date,
          time: s.time,
          roomId: s.roomId,
          liveStatus: s.liveStatus,
        };
      })
      .filter((s: any) => s && s.liveStatus === "LIVE");

    if (sessions.length === 0) {
      return {
        role: "ATTENDEE",
        message: "No live session is available right now",
        sessions: [],
      };
    }

    return {
      role: "ATTENDEE",
      sessions,
    };
  }

  return {
    role: participant.role,
    sessions: [],
  };
};

export const eventLive_service = {
  join_live_session,
  start_live_session,
  end_live_session,
  get_event_live_sessions,
};
