import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import httpStatus from "http-status";
import { event_live_service } from "./eventLive.service";

const create_new_event_live = catchAsync(async (req, res) => {
  const result = await event_live_service.create_new_event_live_into_db();
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New event_live created successfully!",
    data: result,
  });
});

export const event_live_controller = { create_new_event_live };
