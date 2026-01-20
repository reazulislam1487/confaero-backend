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

// see all invitations for an event (organizer)
// 🔹 View all invitations of an event
const get_event_invitations = catchAsync(async (req, res) => {
  const { eventId } = req.params;
  const query = req.query;

  const result = await invitation_service.get_event_invitations(eventId, query);

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event invitations fetched successfully",
    data: result,
  });
});

const resend_invitation = catchAsync(async (req, res) => {
  const result = await invitation_service.resend_invitation(
    req.params.invitationId,
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Invitation resent successfully",
    data: result,
  });
});

const delete_invitation = catchAsync(async (req, res) => {
  const result = await invitation_service.delete_invitation(
    req.params.invitationId,
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Invitation deleted and roles reverted",
    data: result,
  });
});

export const invitation_controller = {
  create_new_invitation,
  get_my_invitations,
  accept_invitation,
  reject_invitation,
  get_event_invitations,
  resend_invitation,
  delete_invitation,
};
