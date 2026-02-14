import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import httpStatus from "http-status";
import { task_service } from "./volunteer.service";

const create_task = catchAsync(async (req, res) => {
  const result = await task_service.create_task_and_assign(
    req.body,
    req.user?.id
  );

  manageResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Task created and assigned",
    data: result,
  });
});

const my_tasks = catchAsync(async (req, res) => {
  const result = await task_service.get_my_tasks(req.user?.id);

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My tasks fetched",
    data: result,
  });
});

const complete_task = catchAsync(async (req, res) => {
  const result = await task_service.complete_task(
    req.params.taskId,
    req.user?.id
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Task completed",
    data: result,
  });
});

export const task_controller = {
  create_task,
  my_tasks,
  complete_task,
};
