import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import httpStatus from "http-status";
import { reviewer_service } from "./reviewer.service";

const get_reviewer_dashboard = catchAsync(async (req, res) => {
  const data = await reviewer_service.get_reviewer_dashboard_from_db(
    req.user!.id,
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reviewer dashboard fetched",
    data,
  });
});

const get_reviewer_authors = catchAsync(async (req, res) => {
  const type = req.query.type as "pdf" | "image" | undefined;

  const data = await reviewer_service.get_reviewer_authors_from_db(
    req.user!.id,
    type,
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Authors fetched",
    data,
  });
});

const get_author_submissions = catchAsync(async (req, res) => {
  const type = req.query.type as "pdf" | "image" | undefined;

  const data = await reviewer_service.get_author_submissions_from_db(
    req.user!.id,
    req.params.authorId,
    type,
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Author submissions fetched",
    data,
  });
});

const get_attachment_details = catchAsync(async (req, res) => {
  const data = await reviewer_service.get_attachment_details_from_db(
    req.user!.id,
    req.params.attachmentId,
  );

  if (!data) {
    return manageResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Attachment not found",
    });
  }

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Attachment details fetched",
    data,
  });
});
// 4 actions
const approve_attachment = catchAsync(async (req, res) => {
  const result = await reviewer_service.approve_attachment_from_db(
    req.user!.id,
    req.params.attachmentId,
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Attachment approved successfully",
    data: result,
  });
});

const reject_attachment = catchAsync(async (req, res) => {
  const { reason } = req.body;
  const result = await reviewer_service.reject_attachment_from_db(
    req.user!.id,
    req.params.attachmentId,
    reason,
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Attachment rejected successfully",
    data: result,
  });
});

const revise_attachment = catchAsync(async (req, res) => {
  const { reason } = req.body;

  const result = await reviewer_service.revise_attachment_from_db(
    req.user!.id,
    req.params.attachmentId,
    reason,
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Attachment marked for revision",
    data: result,
  });
});

const flag_attachment_for_admin = catchAsync(async (req, res) => {
  const { reason } = req.body;

  const result = await reviewer_service.flag_attachment_for_admin_from_db(
    req.user!.id,
    req.params.attachmentId,
    reason,
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Attachment flagged for admin",
    data: result,
  });
});
export const reviewer_controller = {
  get_reviewer_dashboard,
  get_reviewer_authors,
  get_author_submissions,
  get_attachment_details,
  flag_attachment_for_admin,
  revise_attachment,
  reject_attachment,
  approve_attachment,
};
