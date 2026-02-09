import { Types } from "mongoose";

export type T_Sponsor = {
  eventId: Types.ObjectId;
  sponsorId: Types.ObjectId; // logged-in sponsor user id

  companyName: string;
  description: string;
  logoUrl: string;
  websiteUrl?: string;
  publicEmail?: string;

  status: "pending" | "approved" | "rejected";
  isApproved: boolean;

  createdAt?: Date;
  updatedAt?: Date;
};
