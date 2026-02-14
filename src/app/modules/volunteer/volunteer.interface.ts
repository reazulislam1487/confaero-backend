import { Types } from "mongoose";

export type T_Task = {
  eventId: Types.ObjectId;
  title: string;
  date: string;
  time: string;
  location: string;
  instruction: string;
  referenceImage?: string;
  assignedVolunteer: Types.ObjectId;
  status: "ASSIGNED" | "COMPLETED" | "REPORTED";
  createdBy: Types.ObjectId;
};
