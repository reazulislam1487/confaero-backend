import { Types } from "mongoose";
import { speaker_model } from "./speaker.schema";
import { Event_Model } from "../superAdmin/event.schema";
import { AppError } from "../../utils/app_error";
import httpStatus from "http-status";

type T_Query = {
  page?: number;
  limit?: number;
  search?: string;
};

const get_event_speakers_from_db = async (
  eventId: any,
  query: T_Query,
  currentUserId?: Types.ObjectId,
) => {
  const page = Number(query.page) > 0 ? Number(query.page) : 1;
  const limit = Number(query.limit) > 0 ? Number(query.limit) : 10;

  // ✅ SAFE string conversion
  const search =
    typeof query.search === "string" ? query.search.toLowerCase().trim() : "";

  const event = await Event_Model.findById(eventId)
    .populate({
      path: "participants.accountId",
      select: "name avatar company email phone location",
    })
    .lean();

  if (!event) {
    throw new AppError("Event not found", httpStatus.NOT_FOUND);
  }

  const speakerMap = new Map<string, any>();

  for (const p of event.participants || []) {
    const participant = p as any;
    if (participant.role !== "SPEAKER" || !participant.accountId) continue;

    const name =
      typeof participant.accountId.name === "string"
        ? participant.accountId.name.toLowerCase()
        : "";

    const company =
      typeof participant.accountId.company === "string"
        ? participant.accountId.company.toLowerCase()
        : "";

    // 🔍 SEARCH FILTER (SAFE)
    if (search && !name.includes(search) && !company.includes(search)) {
      continue;
    }

    const id = participant.accountId._id.toString();

    if (!speakerMap.has(id)) {
      speakerMap.set(id, {
        _id: participant.accountId._id,
        name: participant.accountId.name,
        avatar: participant.accountId.avatar || null,
        company: participant.accountId.company || null,
        email: participant.accountId.email || null,
        phone: participant.accountId.phone || null,
        location: participant.accountId.location || null,
        sessionsCount: 1,
        isBookmarked: false,
      });
    } else {
      speakerMap.get(id).sessionsCount += 1;
    }
  }

  const speakers = Array.from(speakerMap.values());
  const total = speakers.length;

  const start = (page - 1) * limit;
  const paginatedSpeakers = speakers.slice(start, start + limit);

  return {
    total,
    bookmarked: 0,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    speakers: paginatedSpeakers,
  };
};

const get_event_speaker_details_from_db = async (
  eventId: any,
  speakerAccountId: any,
) => {
  const event = await Event_Model.findById(eventId)
    .populate({
      path: "participants.accountId",
      select: "name avatar company email phone location",
    })
    .lean();

  if (!event) {
    throw new AppError("Event not found", httpStatus.NOT_FOUND);
  }

  let sessionsCount = 0;
  let speaker: any = null;

  for (const p of event.participants || []) {
    if (
      (p as any).role === "SPEAKER" &&
      (p as any).accountId &&
      (p as any).accountId._id.toString() === speakerAccountId.toString()
    ) {
      speaker = (p as any).accountId;
      sessionsCount += 1;
    }
  }

  if (!speaker) {
    throw new AppError(
      "Speaker not found for this event",
      httpStatus.NOT_FOUND,
    );
  }

  return {
    _id: speaker._id,
    name: speaker.name,
    avatar: speaker.avatar || null,
    company: speaker.company || null,
    role: "Speaker",
    sessionsCount,
    contact: {
      email: speaker.email || null,
      phone: speaker.phone || null,
      location: speaker.location || null,
    },
  };
};

export const speaker_service = {
  get_event_speakers_from_db,
  get_event_speaker_details_from_db,
};
