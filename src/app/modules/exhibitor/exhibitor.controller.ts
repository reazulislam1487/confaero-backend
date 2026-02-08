import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import httpStatus from "http-status";
import { exhibitor_service } from "./exhibitor.service";

const create_new_exhibitor = catchAsync(async (req, res) => {
  const result = await exhibitor_service.create_new_exhibitor_into_db();
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New exhibitor created successfully!",
    data: result,
  });
});

export const exhibitor_controller = { create_new_exhibitor };
