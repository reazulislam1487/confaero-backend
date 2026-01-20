import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import httpStatus from "http-status";
import { invitation_service } from "./invitation.service";

// create new invitation controller
const create_new_invitation = catchAsync(async (req, res) => {
  const result = await invitation_service.create_invitation(
    req.user?.id,
    req.params?.eventId,
    req.body,
  );

  manageResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Invitation sent successfully",
    data: result,
  });
});
// accept invitation controller
const accept_invitation = catchAsync(async (req, res) => {
  const result = await invitation_service.accept_invitation(
    req.params.invitationId,
    req.user?.email,
    req.user?.id,
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Invitation accepted",
    data: result,
  });
});

// reject invitation controller can be added similarly
const reject_invitation = catchAsync(async (req, res) => {
  const result = await invitation_service.reject_invitation(
    req.params.invitationId,
    req.user?.email,
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Invitation rejected",
    data: result,
  });
});

// get my invitations controller
const get_my_invitations = catchAsync(async (req, res) => {
  const result = await invitation_service.get_my_invitations(req.user?.email);

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My invitations fetched",
    data: result,
  });
});

export const invitation_controller = {
  create_new_invitation,
  get_my_invitations,
  accept_invitation,
  reject_invitation,
};
