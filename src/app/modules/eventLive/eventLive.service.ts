import httpStatus from "http-status";
import { Event_Model } from "../superAdmin/event.schema";
import { AppError } from "../../utils/app_error";
import { generateZegoToken } from "../zego/utils";

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

  const session = event.agenda.sessions[sessionIndex];

  if (!session) {
    throw new AppError("Session not found", 404);
  }
  if (session.liveStatus === "LIVE") {
    throw new AppError("Session already live", 400);
  }

  // only speaker can start
  const participant = event.participants.find(
    (p: any) =>
      p.accountId.toString() === user.id &&
      p.sessionIndex.includes(sessionIndex) &&
      p.role === "SPEAKER",
  );

  if (!participant) {
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

  console.log(session);
  return {
    roomId: session.roomId,
    sessionIndex,
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
  const session = event.agenda?.sessions?.[sessionIndex];

  if (!session) {
    throw new AppError("Session not found", httpStatus.NOT_FOUND);
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
    (p: any) =>
      p.accountId.toString() === user.id &&
      p.sessionIndex.includes(sessionIndex),
  );

  if (!participant) {
    throw new AppError(
      "User is not assigned to this session",
      httpStatus.FORBIDDEN,
    );
  }

  // 6️⃣ Role validation
  if (!["SPEAKER", "ATTENDEE"].includes(participant.role)) {
    throw new AppError(
      "Role not allowed in live session",
      httpStatus.FORBIDDEN,
    );
  }
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

  const session = event.agenda.sessions[sessionIndex];

  if (!session) {
    throw new AppError("Session not found", 404);
  }

  if (session.liveStatus !== "LIVE") {
    throw new AppError("Session is not live", 400);
  }

  const participant = event.participants.find(
    (p: any) =>
      p.accountId.toString() === user.id &&
      p.sessionIndex.includes(sessionIndex) &&
      p.role === "SPEAKER",
  );

  if (!participant) {
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

export const eventLive_service = {
  join_live_session,
  start_live_session,
  end_live_session,
};
