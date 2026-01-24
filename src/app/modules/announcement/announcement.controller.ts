import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import httpStatus from "http-status";
import { announcement_service } from "./announcement.service";
import { Types } from "mongoose";
import { uploadToS3 } from "../../utils/s3";

const create_new_announcement = catchAsync(async (req: any, res) => {
  const { eventId } = req.params;

  let image: string | undefined;

  if (req.file) {
    image = await uploadToS3(req.file, `events/${eventId}/announcements`);
  }

  const result = await announcement_service.create_new_announcement_into_db({
    eventId: new Types.ObjectId(eventId),
    title: req.body.title,
    description: req.body.description,
    image,
    createdBy: req.user.id,
  });

  manageResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Announcement created successfully",
    data: result,
  });
});

const get_event_announcements = catchAsync(async (req, res) => {
  const { eventId } = req.params;

  const result =
    await announcement_service.get_event_announcements_from_db(eventId);

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Announcements fetched successfully",
    data: result,
  });
});

const get_single_announcement = catchAsync(async (req, res) => {
  const { id, eventId } = req.params;

  const result = await announcement_service.get_single_announcement_from_db(
    id,
    eventId,
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Announcement details fetched",
    data: result,
  });
});

const update_announcement = catchAsync(async (req: any, res) => {
  const { id, eventId } = req.params;

  let image = req.body.image;

  if (req.file) {
    image = await uploadToS3(req.file, `events/${eventId}/announcements`);
  }

  const result = await announcement_service.update_announcement_into_db(
    id,
    eventId,
    {
      title: req.body.title,
      description: req.body.description,
      image,
    },
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Announcement updated successfully",
    data: result,
  });
});

const delete_announcement = catchAsync(async (req, res) => {
  const { id, eventId } = req.params;

  await announcement_service.delete_announcement_from_db(id, eventId);

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Announcement deleted successfully",
  });
});

const get_all_announcement = catchAsync(async (req, res) => {
  const { eventId } = req.params;
  const organizerId = req.user!.id;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  /*
  limit =10
  const page = 2
  skip = 2-1 = 1 *10 
  show = 10

  */

  const result = await announcement_service.get_all_event_announcements_from_db(
    eventId,
    organizerId,
    { page, limit, skip },
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Announcements fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});

export const announcement_controller = {
  create_new_announcement,
  get_event_announcements,
  get_single_announcement,
  update_announcement,
  delete_announcement,
  get_all_announcement,
};
