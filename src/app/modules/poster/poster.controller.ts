import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import httpStatus from "http-status";
import { poster_service } from "./poster.service";

const create_new_poster = catchAsync(async (req, res) => {
  const result = await poster_service.create_new_poster_into_db();
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New poster created successfully!",
    data: result,
  });
});

export const poster_controller = { create_new_poster };
