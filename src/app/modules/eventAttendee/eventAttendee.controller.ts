import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import httpStatus from "http-status";
import { event_attendee_service } from "./eventAttendee.service";

const create_new_event_attendee = catchAsync(async (req, res) => {
  const result = await event_attendee_service.create_new_event_attendee_into_db();
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New event_attendee created successfully!",
    data: result,
  });
});

export const event_attendee_controller = { create_new_event_attendee };
