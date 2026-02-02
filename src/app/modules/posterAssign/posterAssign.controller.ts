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

export const poster_assign_controller = {
  create_new_poster_assign,
};
