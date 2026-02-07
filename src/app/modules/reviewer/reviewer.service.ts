import { Types } from "mongoose";
import { poster_assign_model } from "../posterAssign/posterAssign.schema";
import { poster_model } from "../poster/poster.schema";
import { UserProfile_Model } from "../user/user.schema";
import { Account_Model } from "../auth/auth.schema";
import { send_revision_mail } from "./utilities/send_revision_mail";

/* =========================
   DASHBOARD
========================= */
const get_reviewer_dashboard_from_db = async (reviewerId: any) => {
  const reviewerObjectId = new Types.ObjectId(reviewerId);

  // 🔹 assigned + completed দুটোই আনতে হবে
  const assignments = await poster_assign_model
    .find({
      reviewerId: reviewerObjectId,
      status: { $in: ["assigned", "completed"] },
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
        { _id: assign.posterId, "attachments._id": assign.attachmentId },
        {
          authorId: 1,
          attachments: { $elemMatch: { _id: assign.attachmentId } },
        },
      )
      .lean();

    if (!poster?.attachments?.length) continue;

    const attachment = poster.attachments[0];

    // 🔹 type based counting (PDF ≠ IMAGE)
    if (attachment.type === "pdf") totalAbstracts++;
    if (attachment.type === "image") totalPosters++;

    // 🔹 reviewed = reviewer এই attachment শেষ করেছে
    if ((assign.status as string) === "completed") {
      reviewed++;
    }

    // 🔹 latest 5 tasks (review হোক বা না হোক)
    if (latestDocuments.length < 5) {
      const author = await UserProfile_Model.findOne(
        { accountId: poster.authorId },
        { name: 1, avatar: 1 },
      ).lean();

      latestDocuments.push({
        attachmentId: attachment._id,
        type: attachment.type,
        title: attachment.name,
        reviewStatus: attachment.reviewStatus || "pending",
        assignedAt: assign.createdAt,
        url: attachment.url,
        author: {
          name: author?.name || "",
          avatar: author?.avatar || "",
        },
      });
    }
  }

  const totalAssigned = assignments.length;

  return {
    summary: {
      totalAbstracts, // PDF tasks
      totalPosters, // IMAGE tasks
      totalAssigned, // total attachments assigned
      reviewed, // completed assignments
      remaining: totalAssigned - reviewed,
      progress:
        totalAssigned === 0 ? 0 : Math.round((reviewed / totalAssigned) * 100),
    },
    latestDocuments,
  };
};
/* =========================
   FIRST PAGE – AUTHORS LIST
   ?type=pdf | image
========================= */
const get_reviewer_authors_from_db = async (
  reviewerId: any,
  type?: "pdf" | "image",
) => {
  const reviewerObjectId = new Types.ObjectId(reviewerId);

  const assignments = await poster_assign_model
    .find({ reviewerId: reviewerObjectId, status: "assigned" })
    .lean();

  const authorsMap: Record<string, any> = {};

  for (const assign of assignments) {
    const poster = await poster_model.findById(assign.posterId).lean();
    if (!poster) continue;

    const attachment = poster.attachments.find(
      (a: any) => a._id.toString() === assign.attachmentId.toString(),
    );
    if (!attachment) continue;

    if (type && attachment.type !== type) continue;
    const accountRole = await Account_Model.findById({ _id: poster.authorId });

    const authorId = poster.authorId.toString();

    if (!authorsMap[authorId]) {
      const authorR = await UserProfile_Model.findOne(
        { accountId: poster.authorId },
        { name: 1, avatar: 1, _id: 0 },
      ).lean();

      const author = {
        ...authorR,
        role: accountRole?.activeRole,
      };
      authorsMap[authorId] = {
        authorId,
        author,
        totalFiles: 0,
        pending: 0,
        lastSubmittedAt: poster.createdAt,
      };
    }

    authorsMap[authorId].totalFiles++;
    if (attachment.reviewStatus === "pending") {
      authorsMap[authorId].pending++;
    }

    if (poster.createdAt > authorsMap[authorId].lastSubmittedAt) {
      authorsMap[authorId].lastSubmittedAt = poster.createdAt;
    }
  }

  return Object.values(authorsMap);
};

/* =========================
   AUTHOR SUBMISSIONS
   ?type=pdf | image
========================= */
const get_author_submissions_from_db = async (
  reviewerId: string,
  authorId: any,
  type?: "pdf" | "image",
) => {
  const reviewerObjectId = new Types.ObjectId(reviewerId);
  const authorObjectId = new Types.ObjectId(authorId);

  // 1️⃣ reviewer assignments
  const assignments = await poster_assign_model
    .find({
      reviewerId: reviewerObjectId,
      status: "assigned",
    })
    .sort({ createdAt: -1 })
    .lean();

  const results: any[] = [];

  for (const assign of assignments) {
    // 2️⃣ find poster + specific attachment
    const poster = await poster_model
      .findOne(
        {
          _id: assign.posterId,
          authorId: authorObjectId,
          "attachments._id": assign.attachmentId,
        },
        {
          title: 1,
          authorId: 1,
          createdAt: 1,
          attachments: { $elemMatch: { _id: assign.attachmentId } },
        },
      )
      .lean();

    if (!poster?.attachments?.length) continue;

    const attachment = poster.attachments[0];

    // 3️⃣ tab filter (Abstracts / Posters)
    if (type && attachment.type !== type) continue;

    // 4️⃣ author profile (for top card)
    const author = await UserProfile_Model.findOne(
      { accountId: poster.authorId },
      { name: 1, avatar: 1 },
    ).lean();

    const account = await Account_Model.findById({ _id: poster.authorId });

    // 5️⃣ final UI-ready object
    results.push({
      attachmentId: attachment._id,

      title: attachment.name,
      type: attachment.type,
      fileUrl: attachment.url,
      size: attachment.size,

      uploadedAt: poster.createdAt,
      reviewStatus: attachment.reviewStatus,

      author: {
        name: author?.name || "",
        avatar: author?.avatar || "",
        role: account?.activeRole || "Attendee",
      },

      dueDate: assign.dueDate,
    });
  }

  return results;
};
/* =========================
   ATTACHMENT DETAILS
========================= */
const get_attachment_details_from_db = async (
  reviewerId: any,
  attachmentId: any,
) => {
  const reviewerObjectId = new Types.ObjectId(reviewerId);
  const attachmentObjectId = new Types.ObjectId(attachmentId);

  const assign = await poster_assign_model
    .findOne({
      reviewerId: reviewerObjectId,
      attachmentId: attachmentObjectId,
      status: "assigned",
    })
    .lean();

  if (!assign) return null;

  const poster = await poster_model
    .findOne(
      { _id: assign.posterId, "attachments._id": attachmentObjectId },
      {
        authorId: 1,
        createdAt: 1,
        attachments: { $elemMatch: { _id: attachmentObjectId } },
      },
    )
    .lean();

  if (!poster?.attachments?.length) return null;

  const attachment = poster.attachments[0];
  const account = await Account_Model.findById({ _id: poster.authorId });

  const authorE = await UserProfile_Model.findOne(
    { accountId: poster.authorId },
    { name: 1, avatar: 1 },
  ).lean();
  const author = {
    ...authorE,
    role: account?.activeRole,
  };
  return {
    attachmentId: attachment._id,
    title: attachment.name,
    type: attachment.type,
    fileUrl: attachment.url,
    reviewStatus: attachment.reviewStatus,
    uploadedAt: poster.createdAt,
    dueDate: assign.dueDate,
    author,
  };
};
// 4 actions
const validate_assignment = async (
  reviewerId: string,
  attachmentId: string,
) => {
  const assign = await poster_assign_model.findOne({
    reviewerId: new Types.ObjectId(reviewerId),
    attachmentId: new Types.ObjectId(attachmentId),
    status: "assigned",
  });

  if (!assign) throw new Error("Not authorized");
  return assign;
};

const update_attachment_status = async (
  posterId: Types.ObjectId,
  attachmentId: Types.ObjectId,
  status: string,
  reason?: string,
) => {
  const poster = await poster_model
    .findOne(
      { _id: posterId, "attachments._id": attachmentId },
      { attachments: { $elemMatch: { _id: attachmentId } } },
    )
    .lean();

  if (!poster || !poster.attachments?.length) {
    throw new Error("Poster or attachment not found");
  }

  const attachment = poster.attachments[0];

  if (attachment.type === "pdf") {
    await poster_model.updateOne(
      { _id: posterId, "attachments._id": attachmentId },
      {
        $set: {
          "attachments.$.reviewStatus": status,
          "attachments.$.reviewReason": reason,
        },
      },
    );
    return;
  }

  if (attachment.type === "image") {
    await poster_model.updateOne(
      { _id: posterId, "attachments._id": attachmentId },
      {
        $set: {
          "attachments.$.reviewStatus": status,
          "attachments.$.reviewReason": reason,
          status: status === "approved" ? "accepted" : "pending",
        },
      },
    );
    return;
  }
};
const approve_attachment_from_db = async (
  reviewerId: any,
  attachmentId: any,
) => {
  const assign = await validate_assignment(reviewerId, attachmentId);

  await update_attachment_status(
    assign.posterId,
    assign.attachmentId,
    "approved",
  );

  await poster_assign_model.updateOne(
    { _id: assign._id },
    { $set: { status: "completed" } },
  );

  return { attachmentId };
};

const reject_attachment_from_db = async (
  reviewerId: any,
  attachmentId: any,
  reason: string,
) => {
  if (!reason?.trim()) {
    throw new Error("Reject reason is required");
  }

  const assign = await validate_assignment(reviewerId, attachmentId);

  await update_attachment_status(
    assign.posterId,
    assign.attachmentId,
    "rejected",
    reason,
  );

  await poster_assign_model.updateOne(
    { _id: assign._id },
    { $set: { status: "completed", reason } },
  );

  return { attachmentId };
};

const revise_attachment_from_db = async (
  reviewerId: any,
  attachmentId: any,
  reason: string,
) => {
  if (!reason?.trim()) {
    throw new Error("Revision reason is required");
  }
  const assign = await validate_assignment(reviewerId, attachmentId);

  await update_attachment_status(
    assign.posterId,
    assign.attachmentId,
    "revised",
    reason,
  );
  await send_revision_mail(assign.posterId, assign.attachmentId, reason);
  return { attachmentId };
};

const flag_attachment_for_admin_from_db = async (
  reviewerId: any,
  attachmentId: any,
  reason: string,
) => {
  if (!reason?.trim()) {
    throw new Error("Revision reason is required");
  }
  const assign = await validate_assignment(reviewerId, attachmentId);

  await update_attachment_status(
    assign.posterId,
    assign.attachmentId,
    "flagged",
    reason,
  );
  // update posterAssin
  await poster_assign_model.updateOne(
    { _id: assign._id },
    { $set: { status: "flagged" } },
  );

  return { attachmentId };
};

const review_image_attachment_from_db = async (
  reviewerId: any,
  attachmentId: any,
  payload: any,
) => {
  const assign = await poster_assign_model.findOne({
    reviewerId: new Types.ObjectId(reviewerId),
    attachmentId: new Types.ObjectId(attachmentId),
    status: "assigned",
  });

  if (!assign) throw new Error("Not authorized");

  const poster = await poster_model.findOne(
    { _id: assign.posterId, "attachments._id": assign.attachmentId },
    { attachments: { $elemMatch: { _id: assign.attachmentId } } },
  );

  if (!poster || !poster.attachments?.length) {
    throw new Error("Attachment not found");
  }

  const attachment = poster.attachments[0];

  if (attachment.type !== "image") {
    throw new Error("Only image attachments can be reviewed here");
  }

  if (!payload.overall && !payload.reviewReason?.trim()) {
    throw new Error("Review reason is required");
  }

  const attachmentStatus = payload.overall
    ? "approved"
    : payload.reviewStatus || "rejected";

  await poster_model.updateOne(
    { _id: assign.posterId, "attachments._id": assign.attachmentId },
    {
      $set: {
        "attachments.$.reviewScore": {
          originality: payload.originality,
          scientificRigor: payload.scientificRigor,
          clarity: payload.clarity,
          visualDesign: payload.visualDesign,
          impact: payload.impact,
          presentation: payload.presentation,
          overall: payload.overall,
        },
        "attachments.$.reviewStatus": attachmentStatus,
        "attachments.$.reviewReason": payload.overall
          ? null
          : payload.reviewReason,
        status: payload.overall ? "accepted" : "pending",
      },
    },
  );

  await poster_assign_model.updateOne(
    { _id: assign._id },
    { $set: { status: "completed" } },
  );

  return { attachmentId };
};

export const reviewer_service = {
  get_reviewer_dashboard_from_db,
  get_reviewer_authors_from_db,
  get_author_submissions_from_db,
  get_attachment_details_from_db,
  approve_attachment_from_db,
  reject_attachment_from_db,
  revise_attachment_from_db,
  flag_attachment_for_admin_from_db,
  review_image_attachment_from_db,
};
