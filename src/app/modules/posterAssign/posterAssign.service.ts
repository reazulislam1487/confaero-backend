import { Types } from "mongoose";
import { poster_assign_model } from "./posterAssign.schema";
import { poster_model } from "../poster/poster.schema";
import { UserProfile_Model } from "../user/user.schema";
import { Event_Model } from "../superAdmin/event.schema";
import { Account_Model } from "../auth/auth.schema";

const create_new_poster_assign_into_db = async (payload: {
  eventId: string;
  posterId: string;
  attachmentId: string;
  reviewerId: string;
  assignedBy: string;
  dueDate: any;
}) => {
  const assignment = await poster_assign_model.create({
    eventId: new Types.ObjectId(payload.eventId),
    posterId: new Types.ObjectId(payload.posterId),
    attachmentId: new Types.ObjectId(payload.attachmentId),
    reviewerId: new Types.ObjectId(payload.reviewerId),
    assignedBy: new Types.ObjectId(payload.assignedBy),
    dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
    status: "assigned",
  });

  await poster_model.updateOne(
    {
      _id: new Types.ObjectId(payload.posterId),
      "attachments._id": new Types.ObjectId(payload.attachmentId),
    },
    {
      $set: {
        "attachments.$.reviewStatus": "assigned",
      },
    },
  );

  return assignment;
};
// const get_unassigned_files = async (eventId: any) => {
//   const assignedIds = await poster_assign_model.distinct("attachmentId", {
//     eventId: new Types.ObjectId(eventId),
//   });

//   return poster_model.find(
//     {
//       eventId,
//       "attachments._id": { $nin: assignedIds },
//     },
//     {
//       title: 1,
//       authorId: 1,
//       attachments: 1,
//       dueDate: 1,
//       createdAt: 1,
//     },
//   );
// };
const get_unassigned_files = async (eventId: any) => {
  const assignedIds = await poster_assign_model.distinct("attachmentId", {
    eventId: new Types.ObjectId(eventId),
  });

  const posters = await poster_model
    .find(
      { eventId: new Types.ObjectId(eventId) },
      {
        title: 1,
        authorId: 1,
        attachments: 1,
        createdAt: 1,
      },
    )
    .lean();

  return posters
    .map((poster) => {
      const unassignedAttachments = poster.attachments.filter(
        (att: any) =>
          !assignedIds.some((id: any) => id.toString() === att._id.toString()),
      );

      if (!unassignedAttachments.length) return null;

      return {
        posterId: poster._id,
        title: poster.title,
        authorId: poster.authorId,
        attachments: unassignedAttachments,
        createdAt: poster.createdAt,
      };
    })
    .filter(Boolean);
};

const get_assigned_files = async (eventId: any, type: "pdf" | "image") => {
  const assigns = await poster_assign_model
    .find({ eventId: new Types.ObjectId(eventId) })
    .sort({ createdAt: -1 })
    .lean();

  if (!assigns.length) return [];

  const posterIds = assigns.map((a) => a.posterId);
  const reviewerIds = assigns.map((a) => a.reviewerId);

  const posters = await poster_model
    .find(
      { _id: { $in: posterIds } },
      { title: 1, authorId: 1, attachments: 1 },
    )
    .lean();

  const posterMap = new Map(posters.map((p) => [p._id.toString(), p]));

  const authorIds = posters.map((p) => p.authorId);

  const profiles = await UserProfile_Model.find({
    accountId: { $in: [...authorIds, ...reviewerIds] },
  })
    .select("accountId name avatar")
    .lean();

  const profileMap = new Map(profiles.map((p) => [p.accountId.toString(), p]));

  return assigns
    .map((assign) => {
      const poster = posterMap.get(assign.posterId.toString());
      if (!poster) return null;

      const attachment = poster.attachments.find(
        (a: any) =>
          a._id.toString() === assign.attachmentId.toString() &&
          a.type === type,
      );

      if (!attachment) return null;
      console.log(attachment);
      return {
        assignmentId: assign._id,
        posterId: poster._id,
        attachmentId: attachment._id,

        title: poster.title,

        author: profileMap.get(poster.authorId.toString()) || null,
        reviewer: profileMap.get(assign.reviewerId.toString()) || null,

        dueDate: assign.dueDate,

        status: attachment.reviewStatus,
        reviewReason: attachment.reviewReason,

        file: {
          url: attachment.url,
          name: attachment.name,
          size: attachment.size,
          type: attachment.type,
        },

        createdAt: assign.createdAt,
      };
    })
    .filter(Boolean);
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

// !ekhane speaker hbe na abstract reviewer hbe sob jaiga
const search_event_speakers = async (eventId: any, search: string) => {
  const event = await Event_Model.findById(eventId)
    .select("participants")
    .lean();

  if (!event) return [];

  const speakerIds = event.participants
    .filter((p: any) => p.role === "ABSTRACT_REVIEWER")
    .map((p: any) => p.accountId);

  if (!speakerIds.length) return [];

  const speakers = await Account_Model.find({
    _id: { $in: speakerIds },
    email: { $regex: search.trim(), $options: "i" },
  })
    .select("_id email")
    .limit(10)
    .lean();

  return speakers.map((s) => ({
    reviewerId: s._id,
    email: s.email,
  }));
};
const search_unassigned_files_for_assign = async (params: {
  eventId: any;
  search?: string;
  type?: "pdf" | "image";
}) => {
  const { eventId, search = "", type } = params;

  const assignedIds = await poster_assign_model.distinct("attachmentId", {
    eventId: new Types.ObjectId(eventId),
  });

  const posters = await poster_model
    .find(
      {
        eventId: new Types.ObjectId(eventId),
        title: { $regex: search, $options: "i" },
      },
      { title: 1, authorId: 1, attachments: 1, createdAt: 1 },
    )
    .lean();

  return posters.flatMap((poster) =>
    poster.attachments
      .filter((att: any) => {
        if (type && att.type !== type) return false;

        return !assignedIds.some(
          (id: any) => id.toString() === att._id.toString(),
        );
      })
      .map((att: any) => ({
        posterId: poster._id,
        attachmentId: att._id,

        title: poster.title,
        authorId: poster.authorId,

        file: {
          type: att.type,
          name: att.name,
          size: att.size,
          url: att.url,
        },

        createdAt: poster.createdAt,
      })),
  );
};

const get_assigned_abstracts_by_reviewer_test = async (reviewerId: string) => {
  const reviewerObjectId = new Types.ObjectId(reviewerId);

  return await poster_assign_model.aggregate([
    {
      $match: {
        reviewerId: reviewerObjectId,
        status: "assigned",
      },
    },
    {
      $lookup: {
        from: "poster_attachments",
        localField: "attachmentId",
        foreignField: "_id",
        as: "attachment",
      },
    },
    { $unwind: "$attachment" },
    {
      $match: {
        "attachment.type": "PDF",
      },
    },
    {
      $project: {
        _id: 0,
        attachmentId: "$attachment._id",
        title: "$attachment.title",
        reviewStatus: "$attachment.reviewStatus",
        assignedAt: "$createdAt",
        dueDate: "$dueDate",
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
  search_event_speakers,
  search_unassigned_files_for_assign,
  get_assigned_abstracts_by_reviewer_test,
};
