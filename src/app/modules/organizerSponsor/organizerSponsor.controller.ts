import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import httpStatus from "http-status";
import { organizer_sponsor_service } from "./organizerSponsor.service";

const create_new_organizer_sponsor = catchAsync(async (req, res) => {
  const result = await organizer_sponsor_service.create_new_organizer_sponsor_into_db();
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New organizer_sponsor created successfully!",
    data: result,
  });
});

export const organizer_sponsor_controller = { create_new_organizer_sponsor };
