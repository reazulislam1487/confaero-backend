import { Types } from "mongoose";
type Role =
  | "ATTENDEE"
  | "SPEAKER"
  | "EXHIBITOR"
  | "STAFF"
  | "SPONSOR"
  | "VOLUNTEER"
  | "ABSTRACT_REVIEWER"
  | "TRACK_CHAIR";

export type T_ConnectionStatus = "pending" | "accepted" | "rejected";

export type T_ConnectionEvent = {
  eventId: Types.ObjectId;
  role: Role;
  sessionsCount: number;
};

export type T_Connection = {
  ownerAccountId: Types.ObjectId;
  connectedAccountId: Types.ObjectId;

  status: T_ConnectionStatus;

  isBookmarked: boolean;

  events: T_ConnectionEvent[];

  lastConnectedAt: Date;
};
