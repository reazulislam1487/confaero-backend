import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import httpStatus from "http-status";
import { super_admin_service } from "./superAdmin.service";

const create_new_organizer = catchAsync(async (req, res) => {
  const data = req?.body;
  const result = await super_admin_service.create_new_organizer_into_db(data);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New organizer created successfully!",
    data: result,
  });
});

export const super_admin_controller = { create_new_organizer };
