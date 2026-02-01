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

    status: "submitted",
  });
};

export const poster_service = { create_new_poster_into_db };
