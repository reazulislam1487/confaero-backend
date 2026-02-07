import { Types } from "mongoose";
import { poster_assign_model } from "./posterAssign.schema";
import { poster_model } from "../poster/poster.schema";
import { UserProfile_Model } from "../user/user.schema";
import { Event_Model } from "../superAdmin/event.schema";
import { Account_Model } from "../auth/auth.schema";
import sendMail from "../../utils/mail_sender";

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

const reassign_poster_to_reviewer_into_db = async (payload: {
  eventId: string;
  posterId: string;
  attachmentId: string;
  reviewerId: string;
  assignedBy: string;
  dueDate?: any;
}) => {
  // 1️⃣ Find attachment & validate reported status
  const poster = await poster_model
    .findOne(
      {
        _id: new Types.ObjectId(payload.posterId),
        "attachments._id": new Types.ObjectId(payload.attachmentId),
      },
      {
        attachments: { $elemMatch: { _id: payload.attachmentId } },
      },
    )
    .lean();

  if (!poster?.attachments?.length) {
    throw new Error("Attachment not found");
  }

  const attachment = poster.attachments[0];

  if (!["rejected", "revised", "flagged"].includes(attachment.reviewStatus)) {
    throw new Error(
      "Reassign is allowed only for rejected, revised or flagged files",
    );
  }

  // 2️⃣ Prevent duplicate assignment to same reviewer
  const alreadyAssigned = await poster_assign_model.findOne({
    eventId: new Types.ObjectId(payload.eventId),
    posterId: new Types.ObjectId(payload.posterId),
    attachmentId: new Types.ObjectId(payload.attachmentId),
    reviewerId: new Types.ObjectId(payload.reviewerId),
  });

  if (alreadyAssigned && alreadyAssigned.status !== "completed") {
    throw new Error("This reviewer is already assigned to this file");
  }
  // 3️⃣ Create NEW assignment (do not touch old one)
  const newAssignment = await poster_assign_model.create({
    eventId: new Types.ObjectId(payload.eventId),
    posterId: new Types.ObjectId(payload.posterId),
    attachmentId: new Types.ObjectId(payload.attachmentId),
    reviewerId: new Types.ObjectId(payload.reviewerId),
    assignedBy: new Types.ObjectId(payload.assignedBy),
    dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
    status: "assigned",
    isReassigned: true, // optional but useful
  });

  return newAssignment;
};

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

      /* -----------------------
         SCORE CALCULATION
      ----------------------- */
      let averageScore: number | null = null;

      if (
        attachment.reviewScore &&
        typeof attachment.reviewScore === "object"
      ) {
        const numericScores = Object.values(attachment.reviewScore).filter(
          (v) => typeof v === "number",
        );

        if (numericScores.length) {
          averageScore = Number(
            (
              numericScores.reduce((sum, v) => sum + v, 0) /
              numericScores.length
            ).toFixed(2),
          );
        }
      }

      /* -----------------------
         STATUS RESOLUTION
      ----------------------- */
      const status = assign.status === "assigned" ? "assigned" : "completed";

      const reviewStatus = attachment.reviewStatus;

      return {
        assignmentId: assign._id,
        posterId: poster._id,
        attachmentId: attachment._id,

        title: poster.title,

        author: profileMap.get(poster.authorId.toString()) || null,
        reviewer: profileMap.get(assign.reviewerId.toString()) || null,

        dueDate: assign.dueDate,

        status,
        reviewReason: attachment.reviewReason || null,

        file: {
          url: attachment.url,
          name: attachment.name,
          size: attachment.size,
          type: attachment.type,
          reviewStatus,
          score: averageScore,
        },

        createdAt: assign.createdAt,
      };
    })
    .filter(Boolean)
    .sort((a: any, b: any) => {
      const scoreA = a.file.score;
      const scoreB = b.file.score;

      if (scoreA === null && scoreB === null) return 0;
      if (scoreA === null) return 1; // null নিচে যাবে
      if (scoreB === null) return -1;

      return scoreB - scoreA; // বেশি score আগে
    });
};

// const get_assigned_files = async (eventId: any, type: "pdf" | "image") => {
//   const assigns = await poster_assign_model
//     .find({ eventId: new Types.ObjectId(eventId) })
//     .sort({ createdAt: -1 })
//     .lean();

//   if (!assigns.length) return [];

//   const posterIds = assigns.map((a) => a.posterId);
//   const reviewerIds = assigns.map((a) => a.reviewerId);

//   const posters = await poster_model
//     .find(
//       { _id: { $in: posterIds } },
//       { title: 1, authorId: 1, attachments: 1 },
//     )
//     .lean();

//   const posterMap = new Map(posters.map((p) => [p._id.toString(), p]));

//   const authorIds = posters.map((p) => p.authorId);

//   const profiles = await UserProfile_Model.find({
//     accountId: { $in: [...authorIds, ...reviewerIds] },
//   })
//     .select("accountId name avatar")
//     .lean();

//   const profileMap = new Map(profiles.map((p) => [p.accountId.toString(), p]));

//   return assigns
//     .map((assign) => {
//       const poster = posterMap.get(assign.posterId.toString());
//       if (!poster) return null;

//       const attachment = poster.attachments.find(
//         (a: any) =>
//           a._id.toString() === assign.attachmentId.toString() &&
//           a.type === type,
//       );

//       if (!attachment) return null;

//       const score = attachment.reviewScore;

//       if (!score || typeof score !== "object") {
//         return {
//           ...attachment,
//           averageScore: null,
//         };
//       }

//       const numericScores = Object.values(score).filter(
//         (v) => typeof v === "number",
//       );

//       const averageScore =
//         numericScores.length > 0
//           ? Number(
//               (
//                 numericScores.reduce((sum, v) => sum + v, 0) /
//                 numericScores.length
//               ).toFixed(2),
//             )
//           : null;
//       return {
//         assignmentId: assign._id,
//         posterId: poster._id,
//         attachmentId: attachment._id,

//         title: poster.title,

//         author: profileMap.get(poster.authorId.toString()) || null,
//         reviewer: profileMap.get(assign.reviewerId.toString()) || null,

//         dueDate: assign.dueDate,

//         status: attachment.reviewStatus,
//         reviewReason: attachment.reviewReason,

//         file: {
//           url: attachment.url,
//           name: attachment.name,
//           size: attachment.size,
//           type: attachment.type,
//           status: attachment.reviewStatus,
//           score: averageScore,
//         },

//         createdAt: assign.createdAt,
//       };
//     })
//     .filter(Boolean);
// };

/* REPORTED FILES */
const get_reported_files = async (eventId: any) => {
  const eventObjectId = new Types.ObjectId(eventId);

  const posters = await poster_model
    .find(
      {
        eventId: eventObjectId,
        "attachments.reviewStatus": {
          $in: ["rejected", "revised", "flagged"],
        },
      },
      {
        title: 1,
        authorId: 1,
        attachments: 1,
      },
    )
    .lean();

  const results: any[] = [];

  for (const poster of posters) {
    const author = await UserProfile_Model.findOne(
      { accountId: poster.authorId },
      { name: 1 },
    ).lean();

    for (const attachment of poster.attachments) {
      if (
        !["rejected", "revised", "flagged"].includes(attachment.reviewStatus)
      ) {
        continue;
      }

      const assign = await poster_assign_model
        .findOne(
          {
            posterId: poster._id,
            attachmentId: attachment._id,
          },
          {
            reviewerId: 1,
            reason: 1,
            dueDate: 1,
          },
        )
        .lean();

      const reviewer = assign
        ? await UserProfile_Model.findOne(
            { accountId: assign.reviewerId },
            { name: 1 },
          ).lean()
        : null;

      results.push({
        posterId: poster._id,
        attachmentId: attachment._id,
        fileType: attachment.type,
        title: attachment.name,
        reviewType: attachment.reviewStatus,
        reason: attachment.reviewReason,

        dueDate: assign?.dueDate || null,

        author: {
          author,
        },

        reviewer: {
          reviewer: assign?.reviewerId,
          name: reviewer?.name || "",
        },
      });
    }
  }

  return results;
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

const get_reviewer_stats = async (eventId: any) => {
  return poster_assign_model.aggregate([
    /* =========================
       1️⃣ Event filter
    ========================= */
    {
      $match: {
        eventId: new Types.ObjectId(eventId),
      },
    },

    /* =========================
       2️⃣ Join poster (for attachment)
    ========================= */
    {
      $lookup: {
        from: "posters",
        localField: "posterId",
        foreignField: "_id",
        as: "poster",
      },
    },
    { $unwind: "$poster" },

    /* =========================
       3️⃣ Extract assigned attachment
    ========================= */
    {
      $addFields: {
        attachment: {
          $first: {
            $filter: {
              input: "$poster.attachments",
              as: "a",
              cond: { $eq: ["$$a._id", "$attachmentId"] },
            },
          },
        },
      },
    },

    /* =========================
       4️⃣ Extract IMAGE numeric scores
    ========================= */
    {
      $addFields: {
        numericScores: {
          $cond: [
            {
              $and: [
                { $eq: ["$status", "completed"] },
                { $eq: ["$attachment.type", "image"] },
                { $ne: ["$attachment.reviewScore", null] },
              ],
            },
            {
              $map: {
                input: {
                  $filter: {
                    input: { $objectToArray: "$attachment.reviewScore" },
                    as: "kv",
                    cond: {
                      $in: [
                        { $type: "$$kv.v" },
                        ["int", "long", "double", "decimal"],
                      ],
                    },
                  },
                },
                as: "item",
                in: "$$item.v",
              },
            },
            [],
          ],
        },
      },
    },

    /* =========================
       5️⃣ Group by reviewer (accountId)
    ========================= */
    {
      $group: {
        _id: "$reviewerId", // reviewerId === accountId

        assigned: { $sum: 1 },

        completed: {
          $sum: {
            $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
          },
        },

        allScores: { $push: "$numericScores" },
      },
    },

    /* =========================
       6️⃣ Flatten scores
    ========================= */
    {
      $addFields: {
        flatScores: {
          $reduce: {
            input: "$allScores",
            initialValue: [],
            in: { $concatArrays: ["$$value", "$$this"] },
          },
        },
      },
    },

    /* =========================
       7️⃣ Avg Score
    ========================= */
    {
      $addFields: {
        avgScore: {
          $cond: [
            { $eq: [{ $size: "$flatScores" }, 0] },
            null,
            { $round: [{ $avg: "$flatScores" }, 2] },
          ],
        },
      },
    },

    /* =========================
       8️⃣ Progress %
    ========================= */
    {
      $addFields: {
        progress: {
          $cond: [
            { $eq: ["$assigned", 0] },
            0,
            {
              $round: [
                {
                  $multiply: [{ $divide: ["$completed", "$assigned"] }, 100],
                },
                0,
              ],
            },
          ],
        },
      },
    },

    /* =========================
       9️⃣ Join USER PROFILE (SOURCE OF TRUTH)
    ========================= */
    {
      $lookup: {
        from: "user_profiles",
        localField: "_id", // reviewerId
        foreignField: "accountId", // accountId
        as: "profile",
      },
    },
    { $unwind: { path: "$profile", preserveNullAndEmptyArrays: true } },

    /* =========================
       🔟 Final UI-ready shape
    ========================= */
    {
      $project: {
        reviewerId: "$_id",

        name: "$profile.name",
        avatar: "$profile.avatar",
        email: "$profile.contact.email",
        assigned: 1,
        completed: 1,
        progress: 1,
        avgScore: 1,

        _id: 0,
      },
    },

    /* =========================
       1️⃣1️⃣ Sort (best reviewers first)
    ========================= */
    {
      $sort: {
        avgScore: -1,
        completed: -1,
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

// send remainder using mail
const send_review_reminder_into_db = async (assignmentId: any) => {
  // 1️⃣ assignment
  const assign = await poster_assign_model
    .findById(new Types.ObjectId(assignmentId))
    .lean();

  if (!assign) {
    throw new Error("Assignment not found");
  }

  // 2️⃣ attachment status check
  const poster = await poster_model
    .findOne(
      {
        _id: assign.posterId,
        "attachments._id": assign.attachmentId,
      },
      {
        attachments: { $elemMatch: { _id: assign.attachmentId } },
      },
    )
    .lean();

  if (!poster?.attachments?.length) {
    throw new Error("Attachment not found");
  }

  const attachment = poster.attachments[0];

  // if (attachment.reviewStatus !== "assigned") {
  //   throw new Error("Reminder can be sent only for pending reviews");
  // }

  // 3️⃣ reviewer email
  const reviewer = await Account_Model.findById(assign.reviewerId)
    .select("email")
    .lean();

  if (!reviewer?.email) {
    throw new Error("Reviewer email not found");
  }

  console.log(reviewer.email);

  // 4️⃣ send mail
  await sendMail({
    to: reviewer.email,
    subject: "Review Reminder",
    textBody: `
You have a pending review.

File: ${attachment.name}
Due Date: ${assign.dueDate ?? "N/A"}

    `,
    htmlBody: `
      <p>Please complete the review.</p>
    `,
  });
  return { assignmentId };
};
export const poster_assign_service = {
  create_new_poster_assign_into_db,
  reassign_poster_to_reviewer_into_db,
  get_unassigned_files,
  get_assigned_files,
  get_reported_files,
  // submit_review,
  reassign_reviewer,
  get_reviewer_stats,
  search_event_speakers,
  search_unassigned_files_for_assign,
  get_assigned_abstracts_by_reviewer_test,

  send_review_reminder_into_db,
};
