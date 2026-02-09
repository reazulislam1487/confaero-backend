import { Types } from "mongoose";
import httpStatus from "http-status";
import { sponsor_model } from "../sponsor/sponsor.schema";
import { AppError } from "../../utils/app_error";

const get_all_sponsors_from_db = async (query: any) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 6;
  const skip = (page - 1) * limit;

  const filter: any = {
    eventId: new Types.ObjectId(query.eventId),
  };

  if (query.status) {
    filter.status = query.status;
  }

  const data = await sponsor_model
    .find(filter)
    .select("companyName description logoUrl status")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await sponsor_model.countDocuments(filter);

  return {
    data,
    meta: {
      total,
      page,
      limit,
    },
  };
};

const get_single_sponsor_from_db = async (sponsorProfileId: string) => {
  if (!Types.ObjectId.isValid(sponsorProfileId)) {
    throw new AppError("Invalid sponsor id", httpStatus.BAD_REQUEST);
  }

  const sponsor = await sponsor_model.findById(sponsorProfileId);

  if (!sponsor) {
    throw new AppError("Sponsor not found", httpStatus.NOT_FOUND);
  }

  return sponsor;
};

const approve_sponsor_into_db = async (sponsorProfileId: string) => {
  const sponsor = await sponsor_model.findByIdAndUpdate(
    sponsorProfileId,
    {
      status: "approved",
      isApproved: true,
    },
    { new: true },
  );

  if (!sponsor) {
    throw new AppError("Sponsor not found", httpStatus.NOT_FOUND);
  }

  return sponsor;
};

const reject_sponsor_into_db = async (sponsorProfileId: string) => {
  const sponsor = await sponsor_model.findByIdAndUpdate(
    sponsorProfileId,
    {
      status: "rejected",
      isApproved: false,
    },
    { new: true },
  );

  if (!sponsor) {
    throw new AppError("Sponsor not found", httpStatus.NOT_FOUND);
  }

  return sponsor;
};

export const organizer_sponsor_service = {
  get_all_sponsors_from_db,
  get_single_sponsor_from_db,
  approve_sponsor_into_db,
  reject_sponsor_into_db,
};
