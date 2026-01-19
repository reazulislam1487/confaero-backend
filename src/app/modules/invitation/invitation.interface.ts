import { Types } from "mongoose";

export type TInvitationStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED";
export type TInvitationRole =
  | "ATTENDEE"
  | "EXHIBITOR"
  | "VOLUNTEER"
  | "SPEAKER";

export type T_Invitation = {
  eventId: Types.ObjectId;
  organizerId: Types.ObjectId;

  name: string;
  email: string;
  role: TInvitationRole;

  token: string;
  status: TInvitationStatus;
  expiresAt: Date;
};
