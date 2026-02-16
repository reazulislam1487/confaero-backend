import { Types } from "mongoose";
import { connection_model } from "../connection/connection.schema";
import { Attendance, Lead } from "./qr.schema";

export const volunteer_checkin_service = async ({
  attendeeId,
  eventId,
  checkedInBy,
}: {
  attendeeId: string;
  eventId: string;
  checkedInBy: string;
}) => {
  const exists = await Attendance.findOne({ attendeeId, eventId });

  if (exists) {
    return {
      status: "ALREADY_CHECKED_IN",
      checkedInAt: exists.checkedInAt,
    };
  }

  const attendance = await Attendance.create({
    attendeeId,
    eventId,
    checkedInBy,
    checkedInAt: new Date(),
  });

  return {
    status: "CHECKED_IN",
    checkedInAt: attendance.checkedInAt,
  };
};

export const exhibitor_lead_service = async ({
  exhibitorId,
  attendeeId,
  eventId,
}: {
  exhibitorId: string;
  attendeeId: string;
  eventId: string;
}) => {
  const exists = await Lead.findOne({
    exhibitorId,
    attendeeId,
    eventId,
  });

  if (exists) {
    return {
      status: "ALREADY_LEAD",
      createdAt: exists.createdAt,
    };
  }

  const lead = await Lead.create({
    exhibitorId,
    attendeeId,
    eventId,
    createdAt: new Date(),
  });

  return {
    status: "LEAD_ADDED",
    createdAt: lead.createdAt,
  };
};
export const create_instant_connection_from_scan = async ({
  scannerId,
  scannedUserId,
  eventId,
  role,
  sessionsCount = 0,
}: {
  scannerId: Types.ObjectId;
  scannedUserId: Types.ObjectId;
  eventId: Types.ObjectId;
  role: string;
  sessionsCount?: number;
}) => {
  if (scannerId.toString() === scannedUserId.toString()) {
    throw new Error("You cannot connect with yourself");
  }

  // already connected check (either direction)
  const exists = await connection_model.findOne({
    ownerAccountId: scannerId,
    connectedAccountId: scannedUserId,
    status: "accepted",
  });

  if (exists) {
    return { alreadyConnected: true };
  }

  const eventInfo = [{ eventId, role, sessionsCount }];
  const now = new Date();

  // A → B
  await connection_model.create({
    ownerAccountId: scannerId,
    connectedAccountId: scannedUserId,
    status: "accepted",
    events: eventInfo,
    lastConnectedAt: now,
  });

  // B → A
  await connection_model.create({
    ownerAccountId: scannedUserId,
    connectedAccountId: scannerId,
    status: "accepted",
    events: eventInfo,
    lastConnectedAt: now,
  });

  return { connected: true };
};
