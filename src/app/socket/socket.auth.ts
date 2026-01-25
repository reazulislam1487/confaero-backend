// src/socket/socket.auth.ts
import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import { Account_Model } from "../modules/auth/auth.schema";
import { AppError } from "../utils/app_error";
import { configs } from "../configs";

declare module "socket.io" {
  interface Socket {
    user?: {
      userId: string;
      activeRole: string;
      eventId: string;
    };
  }
}

const socketAuth = async (socket: Socket, next: any) => {
  try {
    console.log("🧪 SOCKET AUTH HIT");

    const token = socket.handshake.auth?.token;
    const eventId = socket.handshake.auth?.eventId;

    if (!token || !eventId) {
      return next(new Error("Missing token or eventId"));
    }

    const decoded: any = jwt.verify(
      token,
      configs.new.jwt_access_secret as string,
    );

    const account = await Account_Model.findOne({
      _id: decoded.userId,
      "events.eventId": eventId,
    });

    if (!account) {
      return next(new Error("Event access denied"));
    }

    socket.user = {
      userId: decoded.userId,
      activeRole: decoded.activeRole,
      eventId,
    };

    console.log("✅ SOCKET AUTH SUCCESS");

    next();
  } catch (error: any) {
    console.error("❌ SOCKET AUTH ERROR:", error.message);
    next(new Error(error.message || "Socket auth failed"));
  }
};

export default socketAuth;
