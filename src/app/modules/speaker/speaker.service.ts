import { Types } from "mongoose";
import { speaker_model } from "./speaker.schema";
import { Event_Model } from "../superAdmin/event.schema";
import { AppError } from "../../utils/app_error";
import httpStatus from "http-status";

const get_event_speakers_from_db = async (
  eventId: any,
  currentUserId?: any,
) => {
  // find event
  const event = await Event_Model.findById(eventId)
    .populate({
      path: "participants.accountId",
      select: "name avatar company email", // adjust based on your user/profile schema
    })
    .lean();

  if (!event) {
    if (!event) {
      throw new AppError("Event not found", httpStatus.NOT_FOUND);
    }
  }
  // 🔹 Filter only SPEAKERS
  const speakers = (event.participants || [])
    .filter((p: any) => p.role === "SPEAKER" && p.accountId)
    .map((p: any) => ({
      _id: p.accountId._id,
      name: p.accountId.name,
      avatar: p.accountId.avatar || null,
      company: p.accountId.company || null,
      email: p.accountId.email || null,
      sessionsCount: 1, // sessionIndex based, can be improved later
      isBookmarked: false, // future feature
    }));

  return {
    total: speakers.length,
    speakers,
  };
};

export const speaker_service = {
  get_event_speakers_from_db,
};
