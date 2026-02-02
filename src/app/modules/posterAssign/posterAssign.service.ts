import { Types } from "mongoose";
import { poster_assign_model } from "./posterAssign.schema";
import { poster_model } from "../poster/poster.schema";

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
const get_unassigned_files = async (eventId: any) => {
  const assignedIds = await poster_assign_model.distinct("attachmentId", {
    eventId: new Types.ObjectId(eventId),
  });

  return poster_model.find(
    {
      eventId,
      "attachments._id": { $nin: assignedIds },
    },
    {
      title: 1,
      authorId: 1,
      attachments: 1,
      createdAt: 1,
    },
  );
};

/* ASSIGNED FILES */
const get_assigned_files = async (eventId: any) => {
  return poster_assign_model
    .find({ eventId })
    .populate("posterId", "title attachments authorId")
    .populate("reviewerId", "name email")
    .sort({ createdAt: -1 });
};

/* REPORTED FILES */
const get_reported_files = async (eventId: any) => {
  return poster_model.find({
    eventId,
    "attachments.reviewStatus": {
      $in: ["rejected", "revised", "flagged"],
    },
  });
};

/* SUBMIT REVIEW */
const submit_review = async (payload: {
  eventId: string;
  posterId: string;
  attachmentId: string;
  reviewStatus: string;
  reviewReason?: string;
  reviewerId: string;
}) => {
  await poster_model.updateOne(
    {
      _id: payload.posterId,
      "attachments._id": payload.attachmentId,
    },
    {
      $set: {
        "attachments.$.reviewStatus": payload.reviewStatus,
        "attachments.$.reviewReason": payload.reviewReason,
      },
    },
  );

  await poster_assign_model.updateOne(
    {
      posterId: payload.posterId,
      attachmentId: payload.attachmentId,
      reviewerId: payload.reviewerId,
    },
    { status: "reviewed" },
  );

  const imageApproved = await poster_model.exists({
    _id: payload.posterId,
    "attachments.type": "image",
    "attachments.reviewStatus": "approved",
  });

  if (imageApproved) {
    await poster_model.updateOne(
      { _id: payload.posterId },
      { status: "accepted" },
    );
  }
};

/* REASSIGN */
const reassign_reviewer = async (payload: {
  eventId: string;
  posterId: string;
  attachmentId: string;
  reviewerId: string;
  assignedBy: string;
}) => {
  return poster_assign_model.create({
    eventId: new Types.ObjectId(payload.eventId),
    posterId: new Types.ObjectId(payload.posterId),
    attachmentId: new Types.ObjectId(payload.attachmentId),
    reviewerId: new Types.ObjectId(payload.reviewerId),
    assignedBy: new Types.ObjectId(payload.assignedBy),
    status: "reassigned",
  });
};

/* REVIEWER STATS */
const get_reviewer_stats = async (eventId: any) => {
  return poster_assign_model.aggregate([
    { $match: { eventId: new Types.ObjectId(eventId) } },
    {
      $group: {
        _id: "$reviewerId",
        assigned: { $sum: 1 },
        completed: {
          $sum: { $cond: [{ $eq: ["$status", "reviewed"] }, 1, 0] },
        },
      },
    },
  ]);
};

export const poster_assign_service = {
  create_new_poster_assign_into_db,
  get_unassigned_files,
  get_assigned_files,
  get_reported_files,
  submit_review,
  reassign_reviewer,
  get_reviewer_stats,
};
