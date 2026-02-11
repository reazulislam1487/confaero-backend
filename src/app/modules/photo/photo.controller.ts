import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import httpStatus from "http-status";
import { photo_service } from "./photo.service";

const create_new_photo = catchAsync(async (req, res) => {
  const result = await photo_service.create_new_photo_into_db();
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New photo created successfully!",
    data: result,
  });
});

export const photo_controller = { create_new_photo };
