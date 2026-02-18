import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import httpStatus from "http-status";
import { zego_service } from "./zego.service";

const get_zego_token = catchAsync(async (req, res) => {
  const { sessionId } = req.query;

  const result = zego_service.get_zego_token({
    userId: req.user?.id,
    role: req.user?.activeRole, // speaker | attendee
    sessionId: sessionId as string,
  });

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Zego token generated successfully",
    data: result,
  });
});

export const zego_controller = {
  get_zego_token,
};
