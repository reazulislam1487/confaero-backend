import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import { user_services } from "./user.service";
import httpStatus from "http-status";

const update_profile = catchAsync(async (req, res) => {
  const result = await user_services.update_profile_into_db(req);

  manageResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile update successful.",
    data: result,
  });
});

const update_organizer_profile = catchAsync(async (req, res) => {
  const result = await user_services.update_organizer_profile_into_db(req);

  manageResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile updated successfully.",
    data: result,
  });
});

const delete_resume = catchAsync(async (req, res) => {
  const result = await user_services.delete_resume_from_db(req);

  manageResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Resume deleted successfully.",
    data: result,
  });
});
const get_my_profile = catchAsync(async (req, res) => {
  const result = await user_services.get_my_profile_from_db(req);

  manageResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile fetched successfully.",
    data: result,
  });
});

const get_or_profile = catchAsync(async (req, res) => {
  const result = await user_services.get_or_from_db(req);

  manageResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile fetched successfully.",
    data: result,
  });
});

export const user_controllers = {
  update_profile,
  delete_resume,
  get_my_profile,
  update_organizer_profile,
  get_or_profile,
};
