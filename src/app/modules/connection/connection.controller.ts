import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import httpStatus from "http-status";
import { connection_service } from "./connection.service";

const create_new_connection = catchAsync(async (req, res) => {
  const result = await connection_service.create_new_connection_into_db();
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New connection created successfully!",
    data: result,
  });
});

export const connection_controller = { create_new_connection };
