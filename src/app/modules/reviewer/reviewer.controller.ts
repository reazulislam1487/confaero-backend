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

export const reviewer_controller = {
  get_reviewer_dashboard,
  get_reviewer_authors,
  get_author_submissions,
  get_attachment_details,
};
