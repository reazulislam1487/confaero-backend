import { Types } from "mongoose";

export type T_Booth = {
  eventId: Types.ObjectId;
  exhibitorId: Types.ObjectId;

  companyName: string;
  banner?: string;

  offerTitle?: string;
  boothOpening?: string;

  description?: string;

  boothNumber?: string;

  websiteUrl?: string;
  publicEmail?: string;

  resources?: {
    name: string;
    url: string;
    type?: "pdf" | "image" | "link";
  }[];

  status: "active" | "inactive";
  isAccepted: boolean;

  createdAt?: Date;
  updatedAt?: Date;
};
