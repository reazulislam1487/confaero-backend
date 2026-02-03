import { Types } from "mongoose";
import { poster_assign_model } from "../posterAssign/posterAssign.schema";
import {
  T_PaginatedAbstractResponse,
  T_ReviewerDashboardResponse,
} from "./reviewer.interface";
import { poster_model } from "../poster/poster.schema";
import { UserProfile_Model } from "../user/user.schema";

const get_reviewer_dashboard_from_db = async (
  reviewerId: string,
): Promise<T_ReviewerDashboardResponse> => {
  const reviewerObjectId = new Types.ObjectId(reviewerId);

  const assignments = await poster_assign_model
    .find({
      reviewerId: reviewerObjectId,
      status: "assigned",
    })
    .sort({ createdAt: -1 })
    .lean();

  let totalAbstracts = 0;
  let totalPosters = 0;
  let reviewed = 0;

  const latestDocuments: any[] = [];

  for (const assign of assignments) {
    const poster = await poster_model
      .findOne(
        {
          _id: assign.posterId,
          "attachments._id": assign.attachmentId,
        },
        {
          authorId: 1,
          attachments: { $elemMatch: { _id: assign.attachmentId } },
        },
      )
      .lean();

    if (!poster || !poster.attachments?.length) continue;

    const attachment = poster.attachments[0];

    if (attachment.type === "pdf") totalAbstracts++;
    if (attachment.type === "image") totalPosters++;

    if (attachment.reviewStatus === "reviewed") reviewed++;

    if (latestDocuments.length < 5) {
      const author = await UserProfile_Model.findOne(
        { accountId: poster.authorId },
        { name: 1, avatar: 1 },
      ).lean();

      latestDocuments.push({
        attachmentId: attachment._id,
        type: attachment.type,
        title: attachment.name,
        reviewStatus: attachment.reviewStatus,
        assignedAt: assign.createdAt,
        author: {
          name: author?.name || "",
          avatar: author?.avatar || "",
        },
      });
    }
  }

  const totalAssigned = assignments.length;
  const remaining = totalAssigned - reviewed;
  const progress =
    totalAssigned === 0 ? 0 : Math.round((reviewed / totalAssigned) * 100);

  return {
    summary: {
      totalAbstracts,
      totalPosters,
      totalAssigned,
      reviewed,
      remaining,
      progress,
    },
    latestDocuments,
  };
};

const get_assigned_abstracts_from_db = async (
  reviewerId: string,
  page = 1,
  limit = 10,
) => {
  const reviewerObjectId = new Types.ObjectId(reviewerId);

  // 1️⃣ সব assigned আনো (pagination ছাড়া)
  const assignments = await poster_assign_model
    .find({
      reviewerId: reviewerObjectId,
      status: "assigned",
    })
    .sort({ createdAt: -1 })
    .lean();

  // 2️⃣ PDF only resolve করো
  const resolved = await Promise.all(
    assignments.map(async (assign) => {
      const poster = await poster_model
        .findOne(
          {
            _id: assign.posterId,
            "attachments._id": assign.attachmentId,
          },
          {
            authorId: 1,
            createdAt: 1,
            attachments: { $elemMatch: { _id: assign.attachmentId } },
          },
        )
        .lean();

      if (!poster || !poster.attachments?.length) return null;

      const attachment = poster.attachments[0];
      if (attachment.type !== "pdf") return null;

      const author = await UserProfile_Model.findOne(
        { accountId: poster.authorId },
        { name: 1, avatar: 1 },
      ).lean();

      return {
        attachmentId: attachment._id,
        attachment: {
          name: attachment.name,
          url: attachment.url,
          size: attachment.size,
          type: attachment.type,
        },
        uploadedAt: poster.createdAt,
        reviewStatus: attachment.reviewStatus,
        url: attachment.url,
        author: {
          name: author?.name || "",
          avatar: author?.avatar || "",
        },
        dueDate: assign.dueDate,
      };
    }),
  );

  const filtered = resolved.filter(Boolean);

  // 3️⃣ এখন pagination (correct place)
  const total = filtered.length;
  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: filtered.slice(start, end),
  };
};
const get_assigned_abstract_details_from_db = async (
  reviewerId: any,
  attachmentId: any,
) => {
  const reviewerObjectId = new Types.ObjectId(reviewerId);
  const attachmentObjectId = new Types.ObjectId(attachmentId);

  // 1️⃣ validate assignment (security)
  const assign = await poster_assign_model
    .findOne({
      reviewerId: reviewerObjectId,
      attachmentId: attachmentObjectId,
      status: "assigned",
    })
    .lean();

  if (!assign) return null;

  // 2️⃣ find poster + embedded attachment
  const poster = await poster_model
    .findOne(
      {
        _id: assign.posterId,
        "attachments._id": attachmentObjectId,
      },
      {
        title: 1,
        authorId: 1,
        createdAt: 1,
        attachments: { $elemMatch: { _id: attachmentObjectId } },
      },
    )
    .lean();

  if (!poster || !poster.attachments?.length) return null;

  const attachment = poster.attachments[0];

  // only abstract
  if (attachment.type !== "pdf") return null;

  // 3️⃣ author profile
  const author = await UserProfile_Model.findOne(
    { accountId: poster.authorId },
    { name: 1, avatar: 1 },
  ).lean();

  return {
    attachmentId: attachment._id,
    title: attachment.name,
    fileUrl: attachment.url,
    size: attachment.size,
    reviewStatus: attachment.reviewStatus,
    uploadedAt: poster.createdAt,
    dueDate: assign.dueDate,
    author: {
      name: author?.name || "",
      avatar: author?.avatar || "",
    },
  };
};
export const reviewer_service = {
  get_reviewer_dashboard_from_db,
  get_assigned_abstracts_from_db,
  get_assigned_abstract_details_from_db,
};
