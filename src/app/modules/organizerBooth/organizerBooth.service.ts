import httpStatus from "http-status";
import { Event_Model } from "../superAdmin/event.schema";
import { AppError } from "../../utils/app_error";
import { booth_model } from "../booth/booth.schema";

const check_event_access = async (eventId: string, organizerId: string) => {
  const event = await Event_Model.findOne({
    _id: eventId,
    organizers: organizerId,
  });

  console.log(eventId, organizerId);
  if (!event) {
    throw new AppError("Event access denied", httpStatus.FORBIDDEN);
  }
};

const get_event_booths_into_db = async (
  eventId: string,
  organizerId: string,
  isAccepted?: string,
) => {
  await check_event_access(eventId, organizerId);

  const filter: any = { eventId };
  if (isAccepted !== undefined) {
    filter.isAccepted = isAccepted === "true";
  }

  return booth_model.find(filter).sort({ createdAt: -1 });
};

const get_booth_details_into_db = async (
  boothId: string,
  organizerId: string,
) => {
  const booth = await booth_model.findById(boothId);
  if (!booth) {
    throw new AppError("Booth not found", httpStatus.NOT_FOUND);
  }

  await check_event_access(booth.eventId.toString(), organizerId);
  return booth;
};

const update_booth_number_into_db = async (
  boothId: string,
  boothNumber: string,
  organizerId: string,
) => {
  const booth = await booth_model.findById(boothId);
  if (!booth) {
    throw new AppError("Booth not found", httpStatus.NOT_FOUND);
  }

  await check_event_access(booth.eventId.toString(), organizerId);

  booth.boothNumber = boothNumber;
  await booth.save();

  return booth;
};

const accept_booth_into_db = async (boothId: string, organizerId: string) => {
  const booth = await booth_model.findById(boothId);
  if (!booth) {
    throw new AppError("Booth not found", httpStatus.NOT_FOUND);
  }

  await check_event_access(booth.eventId.toString(), organizerId);

  booth.isAccepted = true;
  booth.status = "active";
  await booth.save();

  return booth;
};

const cancel_booth_into_db = async (boothId: string, organizerId: string) => {
  const booth = await booth_model.findById(boothId);
  if (!booth) {
    throw new AppError("Booth not found", httpStatus.NOT_FOUND);
  }

  await check_event_access(booth.eventId.toString(), organizerId);

  booth.status = "inactive";
  await booth.save();

  return booth;
};

export const organizer_booth_service = {
  get_event_booths_into_db,
  get_booth_details_into_db,
  update_booth_number_into_db,
  accept_booth_into_db,
  cancel_booth_into_db,
};
