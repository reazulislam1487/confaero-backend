import { Types } from "mongoose";
import { T_ReviewerDashboardResponse } from "./reviewer.interface";
import { poster_assign_model } from "../posterAssign/posterAssign.schema";

const get_reviewer_dashboard_from_db = async (
  reviewerId: any,
): Promise<T_ReviewerDashboardResponse> => {
  const reviewerObjectId = new Types.ObjectId(reviewerId);

  const result = await poster_assign_model.aggregate([
    {
      $match: { reviewerId: reviewerObjectId },
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
      $lookup: {
        from: "user_profiles",
        localField: "attachment.authorId",
        foreignField: "accountId",
        as: "author",
      },
    },
    { $unwind: "$author" },
    {
      $facet: {
        summary: [
          {
            $group: {
              _id: null,
              totalAssigned: { $sum: 1 },
              totalAbstracts: {
                $sum: {
                  $cond: [{ $eq: ["$attachment.type", "PDF"] }, 1, 0],
                },
              },
              totalPosters: {
                $sum: {
                  $cond: [{ $eq: ["$attachment.type", "IMAGE"] }, 1, 0],
                },
              },
              reviewed: {
                $sum: {
                  $cond: [
                    { $eq: ["$attachment.reviewStatus", "reviewed"] },
                    1,
                    0,
                  ],
                },
              },
            },
          },
          {
            $addFields: {
              remaining: {
                $subtract: ["$totalAssigned", "$reviewed"],
              },
              progress: {
                $cond: [
                  { $eq: ["$totalAssigned", 0] },
                  0,
                  {
                    $multiply: [
                      { $divide: ["$reviewed", "$totalAssigned"] },
                      100,
                    ],
                  },
                ],
              },
            },
          },
        ],
        latestDocuments: [
          { $sort: { createdAt: -1 } },
          { $limit: 5 },
          {
            $project: {
              attachmentId: "$attachment._id",
              type: "$attachment.type",
              title: "$attachment.title",
              reviewStatus: "$attachment.reviewStatus",
              assignedAt: "$createdAt",
              author: {
                name: "$author.name",
                avatar: "$author.avatar",
              },
            },
          },
        ],
      },
    },
  ]);

  return {
    summary: result[0]?.summary[0] || {
      totalAbstracts: 0,
      totalPosters: 0,
      totalAssigned: 0,
      reviewed: 0,
      remaining: 0,
      progress: 0,
    },
    latestDocuments: result[0]?.latestDocuments || [],
  };
};

export const reviewer_service = {
  get_reviewer_dashboard_from_db,
};
