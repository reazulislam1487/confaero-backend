import httpStatus from "http-status";
import { Types } from "mongoose";
import { sponsor_model } from "./sponsor.schema";
import { AppError } from "../../utils/app_error";
import { Event_Model } from "../superAdmin/event.schema";

const create_new_sponsor_into_db = async (payload: any, sponsorId: string) => {
  const isExist = await sponsor_model.findOne({
    eventId: payload.eventId,
    sponsorId,
  });

  if (isExist) {
    throw new AppError(
      "Sponsor profile already exists for this event",
      httpStatus.BAD_REQUEST,
    );
  }

  const sponsor = await sponsor_model.create({
    ...payload,
    eventId: new Types.ObjectId(payload.eventId),
    sponsorId: new Types.ObjectId(sponsorId),
    status: "pending",
    isApproved: false,
  });

  return sponsor;
};
const get_my_sponsor_from_db = async (eventId: string, sponsorId: string) => {
  const sponsor = await sponsor_model.findOne({
    eventId: new Types.ObjectId(eventId),
    sponsorId: new Types.ObjectId(sponsorId),
  });
  console.log(eventId, sponsorId);
  if (!sponsor) {
    throw new AppError("Sponsor profile not found", httpStatus.NOT_FOUND);
  }

  return sponsor;
};
const update_my_sponsor_into_db = async (
  sponsorId: string,
  sponsorProfileId: string,
  payload: any,
) => {
  const sponsor = await sponsor_model.findOne({
    _id: sponsorProfileId,
    sponsorId: new Types.ObjectId(sponsorId),
  });

  if (!sponsor) {
    throw new AppError("Sponsor profile not found", httpStatus.NOT_FOUND);
  }

  const updatedSponsor = await sponsor_model.findByIdAndUpdate(
    sponsorProfileId,
    payload,
    { new: true },
  );

  return updatedSponsor;
};
const increment_sponsor_profile_view = async (sponsorProfileId: any) => {
  const sponsor = await sponsor_model.findByIdAndUpdate(
    new Types.ObjectId(sponsorProfileId),
    { $inc: { profileView: 1 } },
    { new: true },
  );

  if (!sponsor) {
    throw new AppError("Sponsor profile not found", httpStatus.NOT_FOUND);
  }

  return sponsor;
};
const get_sponsor_dashboard_from_db = async (
  eventId: string,
  sponsorId: string,
) => {
  const sponsor = await sponsor_model.findOne({
    eventId: new Types.ObjectId(eventId),
    sponsorId: new Types.ObjectId(sponsorId),
  });

  if (!sponsor) {
    throw new AppError("Sponsor profile not found", httpStatus.NOT_FOUND);
  }
  const eventAttendeesCount = await Event_Model.findById(
    new Types.ObjectId(eventId),
  )
    .select("participants")
    .lean();

  const totalAttendee = eventAttendeesCount?.participants?.length || 0;
  return {
    _id: sponsor._id,
    companyName: sponsor.companyName,
    description: sponsor.description,
    logoUrl: sponsor.logoUrl,
    status: sponsor.status,
    totalAttendee: totalAttendee,
    profileView: sponsor.profileView,
  };
};

export const sponsor_service = {
  create_new_sponsor_into_db,
  get_my_sponsor_from_db,
  update_my_sponsor_into_db,
  increment_sponsor_profile_view,
  get_sponsor_dashboard_from_db,
};
