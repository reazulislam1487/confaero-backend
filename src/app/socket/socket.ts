// src/socket/socket.ts
import { Server as HTTPServer } from "http";
import { Server } from "socket.io";
import socketAuth from "./socket.auth";
import { message_service } from "../modules/message/message.service";
import { UserProfile_Model } from "../modules/user/user.schema";
import { registerEventLiveSockets } from "../modules/eventLive/eventLive.socket";

let io: Server;
const activeUsers = new Map<string, Set<string>>();
const presenceMap = new Map<string, Map<string, string>>();

export const initSocket = (server: HTTPServer) => {
  io = new Server(server, {
    cors: {
      origin: "*", // later restrict
      credentials: true,
    },
  });

  io.use(socketAuth);

  io.on("connection", (socket: any) => {
    const { eventId, userId } = socket.user;

    //  Join event room
    socket.join(`event:${eventId}`);

    console.log(`🔌 User ${userId} joined event:${eventId}`);
    // init set if not exists
    if (!activeUsers.has(eventId)) {
      activeUsers.set(eventId, new Set());
    }

    // add current user
    activeUsers.get(eventId)!.add(userId);

    // emit active count to everyone in this event
    io.to(`event:${eventId}`).emit(
      "active-count",
      activeUsers.get(eventId)!.size,
    );

    if (!presenceMap.has(eventId)) {
      presenceMap.set(eventId, new Map());
    }

    // user online
    presenceMap.get(eventId)!.set(userId, socket.id);

    // notify everyone: this user is online
    io.to(`event:${eventId}`).emit("user:online", {
      userId,
    });
    // 2️⃣ LISTEN message from frontend
    socket.on("send-message", async (payload: any) => {
      try {
        const { receiverId, text, attachments = [] } = payload;

        console.log(`📩 SOCKET MESSAGE: ${text}`, {
          from: userId,
          to: receiverId,
          text,
          attachments,
        });

        // 3️⃣ Save message + update conversation (DB)
        const message = await message_service.send_message(
          userId,
          eventId,
          receiverId,
          text,
          attachments,
        );

        // 4️⃣ Emit realtime message to event room
        io.to(`event:${eventId}`).emit("message:new", message);
      } catch (error: any) {
        console.error("❌ SOCKET MESSAGE ERROR:", error.message);
        socket.emit("error", { message: error.message });
      }
    });

    socket.on("disconnect", async () => {
      console.log(` User ${userId} disconnected`);

      // remove user from active list
      activeUsers.get(eventId)?.delete(userId);

      // emit updated active count
      io.to(`event:${eventId}`).emit(
        "active-count",
        activeUsers.get(eventId)?.size || 0,
      );

      presenceMap.get(eventId)?.delete(userId);

      const lastSeen = new Date();

      // save lastSeen (for refresh / later load)
      await UserProfile_Model.updateOne({ accountId: userId }, { lastSeen });
      console.log(`user ${userId} is offline from ${lastSeen}`);

      // notify everyone
      io.to(`event:${eventId}`).emit("user:offline", {
        userId,
        lastSeen,
      });
    });

    //message for testing
    // socket.on("send-message", (payload: any) => {
    //   console.log("📤 Message received:", payload);

    //   io.to(`event:${eventId}`).emit("receive-message", {
    //     senderId: userId,
    //     text: payload.text,
    //     time: new Date(),
    //   });
    // });

    registerEventLiveSockets(io, socket);
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
