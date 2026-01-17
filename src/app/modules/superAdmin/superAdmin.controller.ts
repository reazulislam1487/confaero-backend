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

const create_event_by_super_admin = catchAsync(async (req, res) => {
  const payload = req.body;

  const result = await super_admin_service.create_event_by_super_admin_into_db(
    payload
  );

  manageResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Event created and organizers assigned successfully",
    data: result,
  });
});
export const super_admin_controller = {
  create_new_organizer,
  create_event_by_super_admin,
};
