import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import httpStatus from "http-status";
import { event_attendee_service } from "./eventAttendee.service";

const getEventAttendees = catchAsync(async (req, res) => {
  const { eventId } = req.params;
  const { search, role, bookmarked } = req.query;

  const result = await event_attendee_service.get_event_attendees_from_db(
    eventId as any,
    req.user!.id,
    {
      search: search as string,
      role: role as string,
      bookmarked: bookmarked === "true",
    },
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event attendees retrieved",
    data: result,
  });
});

export const event_attendee_controller = { getEventAttendees };
