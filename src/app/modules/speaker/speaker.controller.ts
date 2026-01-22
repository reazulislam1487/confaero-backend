import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import httpStatus from "http-status";
import { speaker_service } from "./speaker.service";



const get_event_speakers = catchAsync(async (req, res) => {
  const { eventId } = req.params;

  const result = await speaker_service.get_event_speakers_from_db(
    eventId,
    req.user?.id,
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event speakers fetched successfully",
    data: result,
  });
});

export const speaker_controller = {
  get_event_speakers,
};
