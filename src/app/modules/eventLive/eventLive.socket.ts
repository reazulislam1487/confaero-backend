import { Server, Socket } from "socket.io";
import { EVENT_LIVE_EVENTS } from "./eventLive.events";
import { ensureSpeaker } from "./eventLive.guard";

export const registerEventLiveSockets = (
  io: Server,
  socket: Socket & {
    user?: {
      userId: string;
      activeRole: string;
      eventId: string;
    };
  },
) => {
  const { userId, activeRole, eventId } = socket.user!;

  const getRoom = (sessionIndex: number) =>
    `session:${eventId}:${sessionIndex}`;

  const emitViewerCount = (sessionIndex: number) => {
    const room = getRoom(sessionIndex);
    const count = io.sockets.adapter.rooms.get(room)?.size || 0;

    io.to(room).emit(EVENT_LIVE_EVENTS.VIEWER_COUNT, {
      sessionIndex,
      count,
    });
  };
  // 🟢 JOIN LIVE SESSION
  socket.on(EVENT_LIVE_EVENTS.JOIN_SESSION, ({ sessionIndex }) => {
    try {
      if (typeof sessionIndex !== "number") return;

      const room = getRoom(sessionIndex);
      socket.join(room);

      // 🔐 remember session
      socket.data.sessionIndex = sessionIndex;
      console.log(
        `🟢 User ${userId} joined session ${eventId}:${sessionIndex}`,
      );

      // 👀 UPDATE VIEWER COUNT
      emitViewerCount(sessionIndex);
    } catch (err) {
      console.error("JOIN_SESSION error", err);
    }
  });

  // 💬 LIVE CHAT
  socket.on(EVENT_LIVE_EVENTS.SEND_MESSAGE, ({ sessionIndex, text }) => {
    try {
      if (typeof sessionIndex !== "number") return;
      if (typeof text !== "string" || !text.trim()) return;

      io.to(getRoom(sessionIndex)).emit(EVENT_LIVE_EVENTS.MESSAGE_NEW, {
        userId,
        text,
        time: new Date(),
      });
    } catch (err) {
      console.error("SEND_MESSAGE error", err);
    }
  });

  // 📊 CREATE POLL (speaker only)
  socket.on(EVENT_LIVE_EVENTS.CREATE_POLL, (payload) => {
    try {
      const { sessionIndex, question, options } = payload;

      if (typeof sessionIndex !== "number") return;
      if (typeof question !== "string" || !question.trim()) return;
      if (!Array.isArray(options) || options.length < 2) return;

      ensureSpeaker(activeRole);

      const poll = {
        id: Date.now().toString(),
        question,
        options: options.map((text: string) => ({
          text,
          count: 0,
        })),
      };

      io.to(getRoom(sessionIndex)).emit(EVENT_LIVE_EVENTS.POLL_CREATED, poll);
    } catch (err) {
      console.error("CREATE_POLL error", err);
    }
  });

  // 🗳️ VOTE POLL
  socket.on(EVENT_LIVE_EVENTS.VOTE_POLL, (payload) => {
    try {
      const { sessionIndex, pollId, optionIndex } = payload;

      if (typeof sessionIndex !== "number") return;
      if (typeof pollId !== "string") return;
      if (typeof optionIndex !== "number") return;

      io.to(getRoom(sessionIndex)).emit(EVENT_LIVE_EVENTS.POLL_UPDATED, {
        pollId,
        optionIndex,
      });
    } catch (err) {
      console.error("VOTE_POLL error", err);
    }
  });

  // 🔴 SESSION ENDED (speaker only)
  socket.on(EVENT_LIVE_EVENTS.SESSION_ENDED, ({ sessionIndex }) => {
    try {
      if (typeof sessionIndex !== "number") return;

      ensureSpeaker(activeRole);

      io.to(getRoom(sessionIndex)).emit(EVENT_LIVE_EVENTS.SESSION_ENDED, {
        endedBy: "SPEAKER",
        endedAt: new Date(),
      });
    } catch (err) {
      console.error("SESSION_ENDED error", err);
    }
  });

  // ❌ DISCONNECT → UPDATE VIEWER COUNT
  socket.on("disconnect", () => {
    const sessionIndex = socket.data.sessionIndex;

    if (typeof sessionIndex === "number") {
      emitViewerCount(sessionIndex);
    }
  });

  // 🧪 DEBUG
  socket.onAny((event, payload) => {
    console.log("📡 SOCKET EVENT:", event, payload);
  });
};
