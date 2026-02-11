import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import httpStatus from "http-status";
import { volunteer_service } from "./volunteer.service";

const create_new_volunteer = catchAsync(async (req, res) => {
  const result = await volunteer_service.create_new_volunteer_into_db();
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New volunteer created successfully!",
    data: result,
  });
});

export const volunteer_controller = { create_new_volunteer };
