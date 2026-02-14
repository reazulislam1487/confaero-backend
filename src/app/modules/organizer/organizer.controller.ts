import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import httpStatus from "http-status";
import { organizer_service } from "./organizer.service";
import { uploadToS3 } from "../../utils/s3";
import { AppError } from "../../utils/app_error";
import { Event_Model } from "../superAdmin/event.schema";

const get_my_events = catchAsync(async (req, res) => {
  const result = await organizer_service.get_my_events_from_db(req.user);

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Organizer events fetched",
    data: result,
  });
});

const update_my_event = catchAsync(async (req, res) => {
  const payload: any = { ...req.body };

  const files = req.files as {
    banner?: Express.Multer.File[];
    floorMapImage?: Express.Multer.File[]; // ✅ singular
  };

  /* ---------- Banner ---------- */
  if (files?.banner?.[0]) {
    payload.bannerImageUrl = await uploadToS3(files.banner[0], "events/banner");
  }

  /* ---------- Floor Map (ADD ONLY) ---------- */
  if (files?.floorMapImage?.[0]) {
    payload.__floorMapImageUrl = await uploadToS3(
      files.floorMapImage[0],
      "events/floormap",
    );
  }

  const result = await organizer_service.update_my_event_in_db(
    req.user,
    req.params.eventId,
    payload,
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event updated successfully",
    data: result,
  });
});

// get all floorMap
const get_event_floormaps = catchAsync(async (req, res) => {
  const event = await Event_Model.findById(req.params.eventId).select(
    "floorMaps",
  );

  if (!event) {
    throw new AppError("Event not found", httpStatus.NOT_FOUND);
  }

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Floor maps fetched successfully",
    data: event.floorMaps,
  });
});

const get_all_register = catchAsync(async (req, res) => {
  const result = await organizer_service.get_all_register_from_db(
    req.user,
    req.query,
  );
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Organizer events fetched",
    data: result,
  });
});

const remove_attendee = catchAsync(async (req, res) => {
  const { eventId, accountId } = req.params;

  const result = await organizer_service.remove_attendee_from_event(
    req.user,
    eventId,
    accountId,
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Attendee removed successfully",
    data: result,
  });
});

const get_attendee_details = catchAsync(async (req, res) => {
  const { eventId, accountId } = req.params;

  const result = await organizer_service.get_attendee_details_from_db(
    req.user,
    eventId,
    accountId,
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Attendee details fetched successfully",
    data: result,
  });
});

const delete_floor_map = catchAsync(async (req, res) => {
  const { eventId, floorMapId } = req.params;
  const user = req.user;

  const event = await Event_Model.findById(eventId);

  if (!event) {
    throw new AppError("Event not found", httpStatus.NOT_FOUND);
  }

  if (!event.organizerEmails.includes(user!.email)) {
    throw new AppError("Forbidden", httpStatus.FORBIDDEN);
  }

  const initialLength = event.floorMaps.length;

  event.floorMaps = event.floorMaps.filter(
    (floor) => floor._id.toString() !== floorMapId,
  );

  if (event.floorMaps.length === initialLength) {
    throw new AppError("Floor map not found", httpStatus.NOT_FOUND);
  }

  await event.save();

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Floor map deleted successfully",
  });
});


export const organizer_controller = {
  get_my_events,
  update_my_event,
  get_all_register,
  remove_attendee,
  get_attendee_details,
  get_event_floormaps,
  delete_floor_map,
};
