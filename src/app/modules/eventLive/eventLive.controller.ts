import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import httpStatus from "http-status";
import { eventLive_service } from "./eventLive.service";

const start_live_session = catchAsync(async (req, res) => {
  const { sessionIndex } = req.body; // ✅ FIXED
  const user = req.user as any;
  const eventId = req.params.eventid as string; // ✅ FIXED

  const result = await eventLive_service.start_live_session({
    eventId,
    sessionIndex,
    user,
  });

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Joined live session successfully",
    data: result,
  });
});

//
const join_live_session = catchAsync(async (req, res) => {
  const { sessionIndex } = req.body; // ✅ FIXED
  const user = req.user as any;
  const eventId = req.params.eventid as string; // ✅ FIXED

  const result = await eventLive_service.join_live_session({
    eventId,
    sessionIndex,
    user,
  });

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Joined live session successfully",
    data: result,
  });
});

const end_live_session = catchAsync(async (req, res) => {
  const { sessionIndex } = req.body; // ✅ FIXED
  const user = req.user as any;
  const eventId = req.params.eventid as string; // ✅ FIXED

  const result = await eventLive_service.end_live_session({
    eventId,
    sessionIndex,
    user,
  });

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Live session ended successfully",
    data: result,
  });
});
// get speaker sessions
const get_speaker_sessions = catchAsync(async (req, res) => {
  const user = req.user as any;
  const eventId = req.params.eventid as string; // ✅ FIXED

  const result = await eventLive_service.get_event_live_sessions({
    eventId,
    userId: user.id,
  });

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Speaker sessions retrieved successfully",
    data: result,
  });
});

export const eventLive_controller = {
  join_live_session,
  start_live_session,
  end_live_session,
  get_speaker_sessions,
};
