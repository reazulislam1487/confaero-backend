import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import httpStatus from "http-status";
import { reviewer_service } from "./reviewer.service";

const get_reviewer_dashboard = catchAsync(async (req, res) => {
  const reviewerId = req.user!.id;

  const result =
    await reviewer_service.get_reviewer_dashboard_from_db(reviewerId);

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reviewer dashboard data fetched successfully!",
    data: result,
  });
});

const get_assigned_abstracts = catchAsync(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const result = await reviewer_service.get_assigned_abstracts_from_db(
    req.user!.id,
    page,
    limit,
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Assigned abstracts fetched successfully",
    data: result,
  });
});

const get_assigned_abstract_details = catchAsync(async (req, res) => {
  const { attachmentId } = req.params;

  const result = await reviewer_service.get_assigned_abstract_details_from_db(
    req.user!.id,
    attachmentId,
  );

  if (!result) {
    return manageResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Abstract not found or not assigned to you",
    });
  }

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Abstract details fetched successfully",
    data: result,
  });
});

export const reviewer_controller = {
  get_reviewer_dashboard,
  get_assigned_abstracts,
  get_assigned_abstract_details,
};
