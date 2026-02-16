import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import httpStatus from "http-status";
import { qr_service, scan_qr_token } from "./qr.service";
import {
  create_instant_connection_from_scan,
  exhibitor_lead_service,
  volunteer_checkin_service,
} from "./utilites";

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

// const scan_qr = catchAsync(async (req, res) => {
//   const { qrToken } = req.body;

//   const payload = qr_service.scan_qr_token(qrToken, req.user);

//   manageResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "QR verified successfully",
//     data: payload,
//   });
// });
export const scan_qr_controller = catchAsync(async (req, res) => {
  const { qrToken } = req.body;
  const scanner = req.user; // from auth middleware
  const { eventId } = req.params;

  const result = scan_qr_token(qrToken, { ...scanner, eventId } as any);

  let data: any;

  switch (result.action) {
    case "CHECK_IN":
      data = await volunteer_checkin_service(result);
      break;

    case "CONNECTION":
      data = await create_instant_connection_from_scan({
        scannerId: result.scannerId,
        scannedUserId: result.scannedUserId,
        eventId: result.eventId,
        role: "ATTENDEE",
      });
      break;

    case "LEAD":
      data = await exhibitor_lead_service(result);
      break;

    default:
      throw new Error("Invalid scan action");
  }

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "QR scanned successfully",
    data,
  });
});
export const qr_controller = {
  generate_qr,
  scan_qr_controller,
};
