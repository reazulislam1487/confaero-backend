import { getIO } from "./socket";

type TNotificationPayload = {
  type: "SESSION_CREATED" | "SESSION_UPDATED";
  refId?: string; // sessionId
  title?: string; // optional (UI instant show)
  message?: string; // optional
};

export const emitEventNotification = (
  eventId: string,
  payload: TNotificationPayload,
) => {
  const io = getIO();

  io.to(`event:${eventId}`).emit("notification:new", {
    eventId,
    ...payload,
  });
};
