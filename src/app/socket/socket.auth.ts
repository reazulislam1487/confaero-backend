// src/socket/socket.auth.ts
import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { configs } from "../configs";
import { Account_Model } from "../modules/auth/auth.schema";
import { Event_Model } from "../modules/superAdmin/event.schema";
import { Types } from "mongoose";

declare module "socket.io" {
  interface Socket {
    user?: {
      userId: string;
      activeRole: string;
      eventId: any;
    };
  }
}

const socketAuth = async (socket: Socket, next: any) => {
  try {
    console.log("🧪 SOCKET AUTH HIT");
    // console.log("eventId", socket.handshake?.headers?.eventid);
    const token = socket.handshake?.headers?.token;
    const eventId = socket.handshake?.headers?.eventid;

    if (!token || !eventId) {
      console.error("❌ Missing token or eventId");
      return next(new Error("Missing token or eventId"));
    }

    // ✅ SAME SECRET AS REST
    const decoded: any = jwt.verify(
      token as string,
      configs.jwt.jwt_access_secret as string,
    );

    console.log("🧪 Decoded user:", decoded.id);
    console.log("🧪 EventId:", eventId);

    // ✅ Correct model
    const account = await Account_Model.findById(decoded.id);

    if (!account) {
      console.error("❌ Account not found");
      return next(new Error("Account not found"));
    }

    const event = await Event_Model.findOne({
      _id: new Types.ObjectId(eventId as string),
      participants: {
        $elemMatch: {
          accountId: new Types.ObjectId(decoded.id),
        },
      },
    });

    if (!event) {
      console.error("❌ User not part of event");
      return next(new Error("Event access denied"));
    }

    socket.user = {
      userId: decoded.id,
      activeRole: decoded.activeRole,
      eventId,
    };

    console.log("✅ SOCKET AUTH SUCCESS");
    next();
  } catch (error: any) {
    console.error("❌ SOCKET AUTH ERROR:", error.message);
    next(new Error(error.message));
  }
};

export default socketAuth;
