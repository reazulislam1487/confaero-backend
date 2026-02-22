// appContent.controller.ts
import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import httpStatus from "http-status";
import { app_content_service } from "./appContent.service";

const create_or_update_app_content = catchAsync(async (req, res) => {
  const result = await app_content_service.create_or_update_app_content_into_db(
    req.body,
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "App content saved successfully!",
    data: result,
  });
});

const get_all_app_contents = catchAsync(async (_req, res) => {
  const result = await app_content_service.get_all_app_contents_from_db();

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "App contents retrieved successfully!",
    data: result,
  });
});

const get_single_app_content = catchAsync(async (req, res) => {
  const { type } = req.params;
  const result =
    await app_content_service.get_single_app_content_by_type_from_db(
      type as string,
    );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "App content retrieved successfully!",
    data: result,
  });
});

export const app_content_controller = {
  create_or_update_app_content,
  get_all_app_contents,
  get_single_app_content,
};
