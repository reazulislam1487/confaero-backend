import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import httpStatus from "http-status";
import { poster_assign_service } from "./posterAssign.service";

const create_new_poster_assign = catchAsync(async (req, res) => {
  const assignedBy = req.user!.id;

  const { eventId } = req.params;

  const result = await poster_assign_service.create_new_poster_assign_into_db({
    ...req.body,
    eventId,
    assignedBy,
  });

  manageResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Poster assigned to reviewer successfully",
    data: result,
  });
});
const get_unassigned_files = catchAsync(async (req, res) => {
  const { eventId } = req.params;

  const data = await poster_assign_service.get_unassigned_files(eventId);

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Unassigned files fetched successfully",
    data,
  });
});

const get_assigned_files = catchAsync(async (req, res) => {
  const { eventId } = req.params;

  const data = await poster_assign_service.get_assigned_files(eventId);

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Assigned files fetched successfully",
    data,
  });
});

const get_reported_files = catchAsync(async (req, res) => {
  const { eventId } = req.params;

  const data = await poster_assign_service.get_reported_files(eventId);

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reported files fetched successfully",
    data,
  });
});

const submit_review = catchAsync(async (req, res) => {
  const reviewerId = req.user!.id;
  const { eventId } = req.params;

  await poster_assign_service.submit_review({
    ...req.body,
    reviewerId,
    eventId,
  });

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review submitted successfully",
  });
});

const reassign_reviewer = catchAsync(async (req, res) => {
  const assignedBy = req.user!.id;
  const { eventId } = req.params;

  const result = await poster_assign_service.reassign_reviewer({
    ...req.body,
    eventId,
    assignedBy,
  });

  manageResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Reviewer reassigned successfully",
    data: result,
  });
});

const get_reviewer_stats = catchAsync(async (req, res) => {
  const { eventId } = req.params;

  const data = await poster_assign_service.get_reviewer_stats(eventId);

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reviewer stats fetched successfully",
    data,
  });
});

export const poster_assign_controller = {
  create_new_poster_assign,
  get_unassigned_files,
  get_assigned_files,
  get_reported_files,
  submit_review,
  reassign_reviewer,
  get_reviewer_stats,
};
