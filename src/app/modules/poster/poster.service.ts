import { UserProfile_Model } from "../user/user.schema";
import { poster_model } from "./poster.schema";
import { Types } from "mongoose";

const create_new_poster_into_db = async (payload: {
  eventId: any;
  authorId: string;
  title: string;
  abstract: string;
  banner: string;
  tags?: string[];
  presenters?: { name: string; role?: string }[];
  videoLink?: string;
  attachments?: {
    url: string;
    type: "pdf" | "image";
    name: string;
    size?: number;
  }[];
}) => {
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
    status: "pending",
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
    .select("_id eventId authorId title abstract banner ")
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

const get_single_accepted_poster_from_db = async (posterId: any) => {
  const poster = await poster_model
    .findOne({
      _id: new Types.ObjectId(posterId),
      status: "pending",
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
};
