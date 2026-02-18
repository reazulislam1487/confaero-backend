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

  // 🟢 JOIN LIVE SESSION
  socket.on(EVENT_LIVE_EVENTS.JOIN_SESSION, ({ sessionIndex }) => {
    socket.join(getRoom(sessionIndex));

    console.log(`🟢 User ${userId} joined session ${eventId}:${sessionIndex}`);
  });

  // 💬 LIVE CHAT (ephemeral)
  socket.on(EVENT_LIVE_EVENTS.SEND_MESSAGE, ({ sessionIndex, text }) => {
    console.log(text);
    io.to(getRoom(sessionIndex)).emit(EVENT_LIVE_EVENTS.MESSAGE_NEW, {
      userId,
      text,
      time: new Date(),
    });
  });

  // 📊 CREATE POLL (speaker only)
  socket.on(
    EVENT_LIVE_EVENTS.CREATE_POLL,
    ({ sessionIndex, question, options }) => {
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
    },
  );

  // 🗳️ VOTE POLL (stateless)
  socket.on(
    EVENT_LIVE_EVENTS.VOTE_POLL,
    ({ sessionIndex, pollId, optionIndex }) => {
      io.to(getRoom(sessionIndex)).emit(EVENT_LIVE_EVENTS.POLL_UPDATED, {
        pollId,
        optionIndex,
      });
    },
  );

 
  socket.onAny((event, payload) => {
    console.log("📡 SOCKET EVENT:", event, payload);
  });
};
