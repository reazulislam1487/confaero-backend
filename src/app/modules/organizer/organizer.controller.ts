import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import httpStatus from "http-status";
import { organizer_service } from "./organizer.service";
import { uploadToS3 } from "../../utils/s3";
import { AppError } from "../../utils/app_error";

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
    floorMapImages?: Express.Multer.File[];
  };

  //  Banner image
  if (files?.banner?.[0]) {
    const bannerUrl = await uploadToS3(files.banner[0], "events/banner");
    payload.bannerImageUrl = bannerUrl;
  }

  //  Floor map multiple images
  if (files?.floorMapImages?.length) {
    const urls = await Promise.all(
      files.floorMapImages.map((file) => uploadToS3(file, "events/floormap")),
    );

    payload.floorMapImageUrl = urls;
  }

  if (req.body.agenda) {
    try {
      payload.__session = JSON.parse(req.body.agenda);

      //  THIS LINE WAS MISSING
      delete payload.agenda;
    } catch {
      throw new AppError("Invalid agenda JSON", httpStatus.BAD_REQUEST);
    }
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

const get_all_register = catchAsync(async (req, res) => {
  const result = await organizer_service.get_all_register_from_db(req.user);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Organizer events fetched",
    data: result,
  });
});
export const organizer_controller = {
  get_my_events,
  update_my_event,
  get_all_register,
};
