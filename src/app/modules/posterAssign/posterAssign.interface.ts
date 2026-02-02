import { Types } from "mongoose";

export type T_PosterAssignStatus =
  | "assigned"
  | "under_review"
  | "reviewed"
  | "reassigned";

export type T_PosterAssign = {
  eventId: Types.ObjectId;
  posterId: Types.ObjectId;
  attachmentId: Types.ObjectId;

  reviewerId: Types.ObjectId;
  assignedBy: Types.ObjectId;

  dueDate?: Date;
  status: T_PosterAssignStatus;

  createdAt: Date;
  updatedAt: Date;
};
