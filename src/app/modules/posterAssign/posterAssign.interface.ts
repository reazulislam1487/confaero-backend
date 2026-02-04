import { Types } from "mongoose";

export type T_PosterAssignStatus =
  | "assigned"
  | "under_review"
  | "reviewed"
  | "reassigned"
  | "flagged";

export type T_PosterAssign = {
  eventId: Types.ObjectId;
  posterId: Types.ObjectId;
  attachmentId: Types.ObjectId;

  reviewerId: Types.ObjectId;
  assignedBy: Types.ObjectId;

  status: T_PosterAssignStatus;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
};
