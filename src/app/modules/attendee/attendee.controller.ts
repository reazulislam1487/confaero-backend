import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import httpStatus from "http-status";
import { attendee_service } from "./attendee.service";

const get_all_upcoming_events = catchAsync(async (req, res) => {
  const result = await attendee_service.get_all_upcoming_events_from_db();
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Upcoming events fetched successfully",
    data: result,
  });
});

const register_event = catchAsync(async (req, res) => {
  const result = await attendee_service.register_attendee_into_event(
    req.user?.id,
    req.params.eventId,
  );
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event registered successfully",
    data: result,
  });
});

const get_my_events = catchAsync(async (req, res) => {
  const result = await attendee_service.get_my_registered_events_from_db(
    req.user?.id,
  );
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My events fetched successfully",
    data: result,
  });
});
//

const get_single_event = catchAsync(async (req, res) => {
  const { eventId } = req.params;

  const result = await attendee_service.get_single_event_from_db(
    eventId as unknown as any,
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event fetched successfully",
    data: result,
  });
});

/**
 * Get sessions of an event
 */
const get_event_sessions = catchAsync(async (req, res) => {
  const { eventId } = req.params;

  const result = await attendee_service.get_event_sessions_from_db(
    eventId as unknown as any,
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event sessions fetched successfully",
    data: result,
  });
});

const get_event_home = catchAsync(async (req, res) => {
  const { eventId } = req.params;

  const result = await attendee_service.get_event_home_from_db(eventId);

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event home data fetched successfully",
    data: result,
  });
});
const generate_qr_token = catchAsync(async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user?.id;

  const result = await attendee_service.generate_qr_token_from_db(
    userId,
    eventId,
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "QR token generated successfully",
    data: result,
  });
});

export const attendee_controller = {
  get_all_upcoming_events,
  register_event,
  get_my_events,
  get_single_event,
  get_event_sessions,
  get_event_home,
  generate_qr_token,
};
