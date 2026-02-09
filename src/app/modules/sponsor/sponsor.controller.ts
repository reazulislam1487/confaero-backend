import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import httpStatus from "http-status";
import { sponsor_service } from "./sponsor.service";

const create_new_sponsor = catchAsync(async (req, res) => {
  const result = await sponsor_service.create_new_sponsor_into_db();
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New sponsor created successfully!",
    data: result,
  });
});

export const sponsor_controller = { create_new_sponsor };
