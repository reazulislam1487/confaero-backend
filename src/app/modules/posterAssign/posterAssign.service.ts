import { Types } from "mongoose";
import { poster_assign_model } from "./posterAssign.schema";

const create_new_poster_assign_into_db = async (payload: {
  eventId: string;
  posterId: string;
  attachmentId: string;
  reviewerId: string;
  assignedBy: string;
  dueDate?: string;
}) => {
  return await poster_assign_model.create({
    eventId: new Types.ObjectId(payload.eventId),
    posterId: new Types.ObjectId(payload.posterId),
    attachmentId: new Types.ObjectId(payload.attachmentId),

    reviewerId: new Types.ObjectId(payload.reviewerId),
    assignedBy: new Types.ObjectId(payload.assignedBy),

    dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
    status: "assigned",
  });
};

export const poster_assign_service = {
  create_new_poster_assign_into_db,
};
