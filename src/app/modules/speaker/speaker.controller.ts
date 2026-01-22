import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import httpStatus from "http-status";
import { speaker_service } from "./speaker.service";

const get_event_speakers = catchAsync(async (req, res) => {
  const { eventId } = req.params;

  const result = await speaker_service.get_event_speakers_from_db(
    eventId,
    req.query,
    req.user?.id,
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event speakers fetched successfully",
    data: result,
  });
});
const get_event_speaker_details = catchAsync(async (req, res) => {
  const { eventId, speakerAccountId } = req.params;

  const result = await speaker_service.get_event_speaker_details_from_db(
    eventId,
    speakerAccountId,
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Speaker details fetched successfully",
    data: result,
  });
});
export const speaker_controller = {
  get_event_speakers,
  get_event_speaker_details,
};
