import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import httpStatus from "http-status";
import { qr_service } from "./qr.service";

const generate_qr = catchAsync(async (req, res) => {
  const { eventId } = req.params;
  const user = req.user;

  const result = qr_service.generate_qr_token(
    user?.id,
    user?.activeRole,
    eventId,
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "QR token generated successfully",
    data: result,
  });
});

const scan_qr = catchAsync(async (req, res) => {
  const { qrToken } = req.body;

  const payload = qr_service.scan_qr_token(qrToken, req.user);

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "QR verified successfully",
    data: payload,
  });
});

export const qr_controller = {
  generate_qr,
  scan_qr,
};
