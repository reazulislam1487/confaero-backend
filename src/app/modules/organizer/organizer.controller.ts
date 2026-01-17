import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import httpStatus from "http-status";
import { organizer_service } from "./organizer.service";

const create_new_organizer = catchAsync(async (req, res) => {
  const result = await organizer_service.create_new_organizer_into_db();
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New organizer created successfully!",
    data: result,
  });
});

export const organizer_controller = { create_new_organizer };
