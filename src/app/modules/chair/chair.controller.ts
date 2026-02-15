import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import httpStatus from "http-status";
import { chair_service } from "./chair.service";

const create_new_chair = catchAsync(async (req, res) => {
  const result = await chair_service.create_new_chair_into_db();
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New chair created successfully!",
    data: result,
  });
});

export const chair_controller = { create_new_chair };

// this is test text
//hello
