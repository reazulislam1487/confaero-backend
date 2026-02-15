import { Types } from "mongoose";

export type T_JobStatus = "PENDING" | "APPROVED" | "REJECTED";
export type T_JobRole = "ORGANIZER" | "SUPER_ADMIN" | "EXHIBITOR" | "STAFF";

export type T_Job = {
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  salary?: string;
  applyLink: string;

  status: T_JobStatus;
  postedBy: Types.ObjectId;
  posterRole: T_JobRole;

  eventId?: Types.ObjectId;
};
