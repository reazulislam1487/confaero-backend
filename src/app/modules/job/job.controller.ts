import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import httpStatus from "http-status";
import { job_service } from "./job.service";

const create_new_job = catchAsync(async (req, res) => {
  const result = await job_service.create_new_job_into_db(req.body, req.user);
  manageResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Job created successfully",
    data: result,
  });
});

const my_jobs = catchAsync(async (req, res) => {
  const result = await job_service.get_my_jobs(req.user, req.query);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My jobs fetched",
    data: result,
  });
});

const review_jobs = catchAsync(async (req, res) => {
  const result = await job_service.get_review_jobs(req.query);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All jobs fetched",
    data: result,
  });
});

const public_jobs = catchAsync(async (req, res) => {
  const result = await job_service.get_public_jobs(req.query.search as string);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Approved jobs fetched",
    data: result,
  });
});

const job_details = catchAsync(async (req, res) => {
  const result = await job_service.get_job_details(
    req.params.jobId as string,
    req.user,
  );
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Job details fetched",
    data: result,
  });
});

const update_status = catchAsync(async (req, res) => {
  const result = await job_service.update_job_status(
    req.params.jobId as string,
    req.body.status,
  );
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Job status updated",
    data: result,
  });
});

const update_job = catchAsync(async (req, res) => {
  const result = await job_service.update_job(
    req.params.jobId as string,
    req.user,
    req.body,
  );
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Job updated",
    data: result,
  });
});

const delete_job = catchAsync(async (req, res) => {
  const result = await job_service.delete_job(
    req.params.jobId as string,
    req.user,
  );
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Job deleted",
    data: result,
  });
});

export const job_controller = {
  create_new_job,
  my_jobs,
  review_jobs,
  public_jobs,
  job_details,
  update_status,
  update_job,
  delete_job,
};
