import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import httpStatus from "http-status";
import { invitation_service } from "./invitation.service";

const create_new_invitation = catchAsync(async (req, res) => {
  const result = await invitation_service.create_new_invitation_into_db(
    req.user?.id,
    req.body,
  );

  manageResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Invitation sent successfully",
    data: result,
  });
});

const accept_invitation = catchAsync(async (req, res) => {
  const result = await invitation_service.accept_invitation_into_db(
    req.body.token,
    req.user?.id,
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Invitation accepted",
    data: result,
  });
});

const reject_invitation = catchAsync(async (req, res) => {
  const result = await invitation_service.reject_invitation_into_db(
    req.body.token,
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Invitation rejected",
    data: result,
  });
});

export const invitation_controller = {
  create_new_invitation,
  accept_invitation,
  reject_invitation,
};
