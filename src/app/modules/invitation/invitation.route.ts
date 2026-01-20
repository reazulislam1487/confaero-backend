import { Router } from "express";
import auth from "../../middlewares/auth";
import { invitation_controller } from "./invitation.controller";
import eventAccess from "../../middlewares/eventAccess.middleware";

const invitation_router = Router();

invitation_router.post(
  "/create/:eventId",
  auth("ORGANIZER"),
  eventAccess(),
  invitation_controller.create_new_invitation,
);

invitation_router.patch(
  "/:invitationId/accept/:eventId",
  auth("ATTENDEE"),
  eventAccess(),
  invitation_controller.accept_invitation,
);

invitation_router.patch(
  "/:invitationId/reject/:eventId",
  auth("ATTENDEE"),
  eventAccess(),
  invitation_controller.reject_invitation,
);

invitation_router.get(
  "/my-invitations/:eventId",
  auth("ATTENDEE"),
  eventAccess(),
  invitation_controller.get_my_invitations,
);
invitation_router.get(
  "/event/:eventId",
  auth("ORGANIZER"),
  eventAccess(),
  invitation_controller.get_event_invitations,
);

invitation_router.post(
  "/:invitationId/resend/:eventId",
  auth("ORGANIZER"),
  eventAccess(),
  invitation_controller.resend_invitation,
);

invitation_router.delete(
  "/:invitationId/:eventId",
  auth("ORGANIZER"),
  eventAccess(),
  invitation_controller.delete_invitation,
);

export default invitation_router;
