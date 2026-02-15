import { Types } from "mongoose";

export type T_JobStatus = "PENDING" | "APPROVED" | "REJECTED";
export type T_JobRole = "ORGANIZER" | "SUPER_ADMIN" | "EXHIBITOR" | "STAFF";

export type T_Job = {
  title: string;
  company: string;

  bannerImage?: string;
//   logoImage?: string;

  description: string;
  requirements?: string;

  location: string;
  locationUrl?: string;

  position?: string;
  qualification?: string;
  experience?: string;
  jobExpire?: Date;

  type: string;
  salary?: string;

  benefits?: string[];

  applyLink: string;

  status: T_JobStatus;
  postedBy: Types.ObjectId;
  posterRole: T_JobRole;

  eventId?: Types.ObjectId;
};
