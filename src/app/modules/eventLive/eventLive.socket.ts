import { Server, Socket } from "socket.io";
import { EVENT_LIVE_EVENTS } from "./eventLive.events";
import { ensureSpeaker } from "./eventLive.guard";

export const registerEventLiveSockets = (
  io: Server,
  socket: Socket & { user?: any },
) => {
  const { userId, role } = socket.user;

  const getRoom = (eventId: string, sessionIndex: number) =>
    `session:${eventId}:${sessionIndex}`;

  // JOIN LIVE SESSION
  socket.on(EVENT_LIVE_EVENTS.JOIN_SESSION, ({ eventId, sessionIndex }) => {
    socket.join(getRoom(eventId, sessionIndex));

    console.log(
      `🟢 User ${userId} joined live session ${eventId}:${sessionIndex}`,
    );
  });

  // LIVE CHAT (pure realtime, no DB, no memory)
  socket.on(EVENT_LIVE_EVENTS.SEND_MESSAGE, ({ eventId, sessionIndex, text }) => {
    io.to(getRoom(eventId, sessionIndex)).emit(
      EVENT_LIVE_EVENTS.MESSAGE_NEW,
      {
        userId,
        text,
        time: new Date(),
      },
    );
  });
  
  // CREATE POLL (speaker only)
  socket.on(
    EVENT_LIVE_EVENTS.CREATE_POLL,
    ({ eventId, sessionIndex, question, options }) => {
      ensureSpeaker(role);

      const poll = {
        id: Date.now().toString(),
        question,
        options: options.map((text: string) => ({
          text,
          count: 0,
        })),
      };

      io.to(getRoom(eventId, sessionIndex)).emit(
        EVENT_LIVE_EVENTS.POLL_CREATED,
        poll,
      );
    },
  );

  // VOTE POLL (realtime only)
  socket.on(
    EVENT_LIVE_EVENTS.VOTE_POLL,
    ({ eventId, sessionIndex, pollId, optionIndex }) => {
      io.to(getRoom(eventId, sessionIndex)).emit(
        EVENT_LIVE_EVENTS.POLL_UPDATED,
        {
          pollId,
          optionIndex,
        },
      );
    },
  );

  // SESSION ENDED
  socket.on(EVENT_LIVE_EVENTS.SESSION_ENDED, ({ eventId, sessionIndex }) => {
    io.to(getRoom(eventId, sessionIndex)).emit(
      EVENT_LIVE_EVENTS.SESSION_ENDED,
    );
  });
};
