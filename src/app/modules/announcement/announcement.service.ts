import { Types } from "mongoose";
import { T_Announcement } from "./announcement.interface";
import { announcement_model } from "./announcement.schema";

const create_new_announcement_into_db = async (payload: T_Announcement) => {
  return await announcement_model.create(payload);
};

const get_event_announcements_from_db = async (eventId: any) => {
  return await announcement_model.find({ eventId }).sort({ createdAt: -1 });
};

const get_single_announcement_from_db = async (id: any, eventId: any) => {
  return await announcement_model.findOne({
    _id: id,
    eventId,
  });
};

const update_announcement_into_db = async (
  id: any,
  eventId: any,
  payload: Partial<T_Announcement>,
) => {
  return await announcement_model.findOneAndUpdate(
    { _id: id, eventId },
    payload,
    { new: true },
  );
};

const delete_announcement_from_db = async (id: any, eventId: any) => {
  return await announcement_model.findOneAndDelete({
    _id: id,
    eventId,
  });
};

const get_all_event_announcements_from_db = async (
  eventId: any,
  organizerId: any,
  options: { page: number; limit: number; skip: number },
) => {
  const { limit, skip, page } = options;

  const filter = {
    eventId,
    createdBy: organizerId,
  };

  const announcements = await announcement_model
    .find(filter)
    .select("_id title description createdAt")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await announcement_model.countDocuments(filter);

  return {
    data: announcements,
    meta: {
      page,
      limit,
      total,
    },
  };
};

export const announcement_service = {
  create_new_announcement_into_db,
  get_event_announcements_from_db,
  get_single_announcement_from_db,
  update_announcement_into_db,
  delete_announcement_from_db,
  get_all_event_announcements_from_db,
};
