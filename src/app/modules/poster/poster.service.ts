import { AppError } from "../../utils/app_error";
import { Event_Model } from "../superAdmin/event.schema";
import { UserProfile_Model } from "../user/user.schema";
import { poster_model } from "./poster.schema";
import { Types } from "mongoose";
import httpStatus from "http-status";

const create_new_poster_into_db = async (payload: {
  eventId: any;
  authorId: string;
  title: string;
  abstract: string;
  banner: string;
  tags?: string[];
  presenters?: { name: string; role?: string }[];
  videoLink?: string;
  dueDate: string;
  attachments?: {
    url: string;
    type: "pdf" | "image";
    name: string;
    size?: number;
  }[];
}) => {
  const eventId = payload.eventId;

  const event = await Event_Model.findById(eventId);

  if (!event) {
    throw new AppError("Event not found", httpStatus.NOT_FOUND);
  }
  const endDate = event.endDate;

  if (!endDate) {
    throw new AppError("Invalid end date", 400);
  }

  const dueDate = new Date(event.endDate as Date);

  return await poster_model.create({
    eventId: new Types.ObjectId(payload.eventId),
    authorId: new Types.ObjectId(payload.authorId),

    title: payload.title,
    abstract: payload.abstract,
    banner: payload.banner,

    tags: payload.tags || [],
    presenters: payload.presenters || [],
    videoLink: payload.videoLink,
    attachments: payload.attachments || [],
    dueDate: dueDate.toISOString(),

    status: "pending",
  });
};

const get_accepted_posters_from_db = async (query: {
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const { search = "", page = 1, limit = 10 } = query;

  const filter: any = {
    status: "accepted",
  };

  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  const skip = (page - 1) * limit;

  // 1️⃣ posters
  const posters = await poster_model
    .find(filter)
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .select("_id eventId authorId title abstract banner dueDate ")
    .lean();

  // 2️⃣ author profiles
  const authorIds = posters.map((p) => p.authorId);

  const profiles = await UserProfile_Model.find({
    accountId: { $in: authorIds },
  })
    .select("accountId name avatar")
    .lean();

  const profileMap = new Map(profiles.map((p) => [p.accountId.toString(), p]));

  // 3️⃣ merge
  const data = posters.map((poster) => ({
    ...poster,
    author: profileMap.get(poster.authorId.toString()) || null,
  }));

  const total = await poster_model.countDocuments(filter);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data,
  };
};

const get_revised_posters_from_db = async (
  authorId: any,
  query: {
    search?: string;
    page?: number;
    limit?: number;
  },
) => {
  const { search = "", page = 1, limit = 10 } = query;

  const filter: any = {
    authorId,
    "attachments.reviewStatus": "revised",
  };

  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  const skip = (page - 1) * limit;

  // 1️⃣ posters
  const posters = await poster_model
    .find(filter)
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .select("_id eventId authorId title abstract banner dueDate attachments")
    .lean();

  // 2️⃣ author profiles (single author, but keep structure consistent)
  const profiles = await UserProfile_Model.findOne(
    { accountId: authorId },
    { accountId: 1, name: 1, avatar: 1 },
  ).lean();

  // 3️⃣ filter revised attachments only
  const data = posters.map((poster) => ({
    _id: poster._id,
    eventId: poster.eventId,
    title: poster.title,
    abstract: poster.abstract,
    banner: poster.banner,
    dueDate: poster.dueDate,
    author: profiles || null,
    attachments: poster.attachments.filter(
      (att) => att.reviewStatus === "revised",
    ),
  }));

  const total = await poster_model.countDocuments(filter);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data,
  };
};
const update_revised_attachment_from_db = async (
  authorId: any,
  attachmentId: any,
  payload: {
    url: string;
    name?: string;
    size?: number;
  },
) => {
  const poster = await poster_model.findOne({
    authorId,
    "attachments._id": attachmentId,
    "attachments.reviewStatus": "revised",
  });

  if (!poster) {
    throw new Error("Attachment is not allowed to update");
  }

  const attachment = poster.attachments.find(
    (att) => att._id.toString() === attachmentId,
  );

  if (!attachment) {
    throw new Error("Attachment not found");
  }

  // ✅ Only file-related fields update
  attachment.url = payload.url;
  if (payload.name) attachment.name = payload.name;
  if (payload.size) attachment.size = payload.size;

  // ❌ DO NOT TOUCH
  // attachment.reviewStatus
  // attachment.reviewReason
  // poster.status

  await poster.save();

  return {
    attachmentId,
    type: attachment.type,
  };
};

const get_single_accepted_poster_from_db = async (posterId: any) => {
  const poster = await poster_model
    .findOne({
      _id: new Types.ObjectId(posterId),
      status: "accepted",
    })
    .lean();

  if (!poster) {
    throw new Error("Poster not found or not accepted");
  }

  const author = await UserProfile_Model.findOne({
    accountId: poster.authorId,
  })
    .select("name avatar")
    .lean();

  return {
    ...poster,
    author: author || null,
  };
};

export const poster_service = {
  create_new_poster_into_db,
  get_accepted_posters_from_db,
  get_single_accepted_poster_from_db,
  get_revised_posters_from_db,
  update_revised_attachment_from_db,
};
