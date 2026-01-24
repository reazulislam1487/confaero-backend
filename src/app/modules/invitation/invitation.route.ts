import { Router } from "express";
import auth from "../../middlewares/auth";
import { invitation_controller } from "./invitation.controller";
import eventAccess from "../../middlewares/eventAccess.middleware";

const invitation_router = Router();

invitation_router.post(
  "/create/:eventId",
  auth("ORGANIZER", "SUPER_ADMIN"),
  eventAccess(),
  invitation_controller.create_new_invitation,
);

invitation_router.patch(
  "/:invitationId/accept/:eventId",
  auth(
    "ATTENDEE",
    "SPEAKER",
    "EXHIBITOR",
    "STAFF",
    "SPONSOR",
    "VOLUNTEER",
    "ABSTRACT_REVIEWER",
    "TRACK_CHAIR",
  ),
  eventAccess(),
  invitation_controller.accept_invitation,
);

invitation_router.patch(
  "/:invitationId/reject/:eventId",
  auth(
    "ATTENDEE",
    "SPEAKER",
    "EXHIBITOR",
    "STAFF",
    "SPONSOR",
    "VOLUNTEER",
    "ABSTRACT_REVIEWER",
    "TRACK_CHAIR",
  ),
  eventAccess(),
  invitation_controller.reject_invitation,
);

invitation_router.get(
  "/my-invitations/:eventId",
  auth(
    "ATTENDEE",
    "SPEAKER",
    "EXHIBITOR",
    "STAFF",
    "SPONSOR",
    "VOLUNTEER",
    "ABSTRACT_REVIEWER",
    "TRACK_CHAIR",
  ),
  eventAccess(),
  invitation_controller.get_my_invitations,
);
invitation_router.get(
  "/event/:eventId",
  auth("ORGANIZER", "SUPER_ADMIN"),
  eventAccess(),
  invitation_controller.get_event_invitations,
);

invitation_router.post(
  "/:invitationId/resend/:eventId",
  auth("ORGANIZER", "SUPER_ADMIN"),
  eventAccess(),
  invitation_controller.resend_invitation,
);

invitation_router.delete(
  "/:invitationId/:eventId",
  auth("ORGANIZER", "SUPER_ADMIN"),
  eventAccess(),
  invitation_controller.delete_invitation,
);
invitation_router.get(
  "/:eventId/sessions",
  auth("ORGANIZER", "SUPER_ADMIN"),
  eventAccess(),
  invitation_controller.get_event_sessions,
);

// 🔹 make speaker directly (NO invitation)
invitation_router.post(
  "/:eventId/make-speaker",
  auth("ORGANIZER", "SUPER_ADMIN"),
  eventAccess(),
  invitation_controller.make_speaker,
);
export default invitation_router;
