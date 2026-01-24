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

export const announcement_service = {
  create_new_announcement_into_db,
  get_event_announcements_from_db,
  get_single_announcement_from_db,
  update_announcement_into_db,
  delete_announcement_from_db,
};
