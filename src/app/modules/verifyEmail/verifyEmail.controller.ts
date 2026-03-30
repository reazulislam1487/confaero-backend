import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import httpStatus from "http-status";
import { verify_email_service } from "./verifyEmail.service";

const create_new_verify_email = catchAsync(async (req, res) => {
  const eventId = req.params.eventId || req.headers["eventid"] || req.body.eventId;
  const result = await verify_email_service.create_new_verify_email_into_db(
    req.user,
    eventId,
    req.file as Express.Multer.File,
  );

  manageResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Verified attendee emails uploaded successfully",
    data: result,
  });
});
const get_all_verify_emails = catchAsync(async (req, res) => {
  const eventId = req.params.eventId || req.headers["eventid"];
  const result = await verify_email_service.get_all_verify_emails_from_db(
    req.user,
    eventId,
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Verified attendee emails fetched successfully",
    data: result,
  });
});
const delete_verify_email = catchAsync(async (req, res) => {
  const eventId = req.params.eventId || req.headers["eventid"];
  const result = await verify_email_service.delete_verify_email_from_db(
    req.user,
    eventId,
    req.params.verifyEmailId,
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Verified attendee email deleted successfully",
    data: result,
  });
});

const add_verified_emails = catchAsync(async (req, res) => {
  const eventId = req.params.eventId || req.headers["eventid"] || req.body.eventId;
  const result = await verify_email_service.add_verified_emails_into_db(
    req.user,
    eventId,
    req.body.emails,
  );

  manageResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Verified attendee emails added successfully",
    data: result,
  });
});

export const verify_email_controller = {
  create_new_verify_email,
  get_all_verify_emails,
  delete_verify_email,
  add_verified_emails,
};
