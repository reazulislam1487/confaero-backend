import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import httpStatus from "http-status";
import { profile_service } from "./profile.service";

const create_new_profile = catchAsync(async (req, res) => {
  const result = await profile_service.create_new_profile_into_db();
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New profile created successfully!",
    data: result,
  });
});

export const profile_controller = { create_new_profile };
