import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import httpStatus from "http-status";
import { reviewer_service } from "./reviewer.service";

const create_new_reviewer = catchAsync(async (req, res) => {
  const result = await reviewer_service.create_new_reviewer_into_db();
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New reviewer created successfully!",
    data: result,
  });
});

export const reviewer_controller = { create_new_reviewer };
