import { Types } from "mongoose";
import { Event_Model } from "../superAdmin/event.schema";
import { AppError } from "../../utils/app_error";
import httpStatus from "http-status";
import { UserProfile_Model } from "../user/user.schema";

type T_Query = {
  page?: number;
  limit?: number;
  search?: string;
};

/* =================================================
   EVENT SPEAKERS LIST (CLEAN & SAFE)
================================================= */
const get_event_speakers_from_db = async (eventId: any, query: T_Query) => {
  const page = Number(query.page) > 0 ? Number(query.page) : 1;
  const limit = Number(query.limit) > 0 ? Number(query.limit) : 10;
  const search = query.search?.trim() || "";
  const skip = (page - 1) * limit;

  const eventExists = await Event_Model.exists({ _id: eventId });
  if (!eventExists) {
    throw new AppError("Event not found", httpStatus.NOT_FOUND);
  }

  const pipeline: any[] = [
    { $match: { _id: new Types.ObjectId(eventId) } },
    { $unwind: "$participants" },
    {
      $match: {
        "participants.role": "SPEAKER",
        "participants.accountId": { $exists: true },
      },
    },
    {
      $group: {
        _id: "$participants.accountId",
        sessionsCount: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "user_profiles",
        localField: "_id",
        foreignField: "accountId",
        as: "profile",
      },
    },
    {
      $unwind: {
        path: "$profile",
        preserveNullAndEmptyArrays: false, // ❗ no profile = skip
      },
    },
    ...(search
      ? [
          {
            $match: {
              $or: [
                { "profile.name": { $regex: search, $options: "i" } },
                {
                  "profile.affiliations.company": {
                    $regex: search,
                    $options: "i",
                  },
                },
              ],
            },
          },
        ]
      : []),
    {
      $project: {
        _id: 1,
        sessionsCount: 1,
        name: "$profile.name",
        avatar: "$profile.avatar",
        company: { $arrayElemAt: ["$profile.affiliations.company", 0] },
        email: "$profile.contact.email",
        phone: {
          $ifNull: ["$profile.contact.phone", "$profile.contact.mobile"],
        },
        location: "$profile.location.address",
      },
    },
    { $skip: skip },
    { $limit: limit },
  ];

  const speakers = await Event_Model.aggregate(pipeline);

  const totalAgg = await Event_Model.aggregate([
    { $match: { _id: new Types.ObjectId(eventId) } },
    { $unwind: "$participants" },
    { $match: { "participants.role": "SPEAKER" } },
    { $group: { _id: "$participants.accountId" } },
    { $count: "total" },
  ]);

  const total = totalAgg[0]?.total || 0;

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    speakers: speakers.map((s) => ({
      _id: s._id,
      name: s.name || null,
      avatar: s.avatar || null,
      company: s.company || null,
      email: s.email || null,
      phone: s.phone || null,
      location: s.location || null,
      sessionsCount: s.sessionsCount || 0,
      isBookmarked: false,
    })),
  };
};

/* =================================================
   SINGLE SPEAKER DETAILS (CLEAN)
================================================= */
const get_event_speaker_details_from_db = async (
  eventId: any,
  speakerAccountId: any,
) => {
  const eventExists = await Event_Model.exists({
    _id: eventId,
    "participants.role": "SPEAKER",
    "participants.accountId": new Types.ObjectId(speakerAccountId),
  });

  if (!eventExists) {
    throw new AppError(
      "Speaker not found for this event",
      httpStatus.NOT_FOUND,
    );
  }

  const sessionsAgg = await Event_Model.aggregate([
    { $match: { _id: new Types.ObjectId(eventId) } },
    { $unwind: "$participants" },
    {
      $match: {
        "participants.role": "SPEAKER",
        "participants.accountId": new Types.ObjectId(speakerAccountId),
      },
    },
    { $count: "count" },
  ]);

  const sessionsCount = sessionsAgg[0]?.count || 0;

  const profile = await UserProfile_Model.findOne({
    accountId: speakerAccountId,
  }).lean();

  if (!profile) {
    throw new AppError("Speaker profile not found", httpStatus.NOT_FOUND);
  }

  return {
    _id: profile.accountId,
    name: profile.name,
    avatar: profile.avatar || null,
    company: profile.affiliations?.[0]?.company || null,
    role: "Speaker",
    sessionsCount,
    contact: {
      email: profile.contact?.email || null,
      phone: profile.contact?.phone || profile.contact?.mobile || null,
      location: profile.location?.address || null,
    },
  };
};

export const speaker_service = {
  get_event_speakers_from_db,
  get_event_speaker_details_from_db,
};
