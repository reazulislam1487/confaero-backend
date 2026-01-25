// src/socket/socket.ts
import { Server as HTTPServer } from "http";
import { Server } from "socket.io";
import socketAuth from "./socket.auth";

let io: Server;

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

    socket.on("disconnect", () => {
      console.log(` User ${userId} disconnected`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
