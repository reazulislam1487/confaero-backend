import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import httpStatus from "http-status";
import { report_service } from "./report.service";

const create_new_report = catchAsync(async (req, res) => {
  const result = await report_service.create_new_report_into_db();
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New report created successfully!",
    data: result,
  });
});

export const report_controller = { create_new_report };
