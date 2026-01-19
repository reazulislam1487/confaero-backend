import { Router } from "express";
import { attendee_controller } from "./attendee.controller";
import auth from "../../middlewares/auth";
import eventAccess from "../../middlewares/eventAccess.middleware";

const attendee_router = Router();

attendee_router.get(
  "/events",
  auth("ATTENDEE"),
  attendee_controller.get_all_upcoming_events,
);

attendee_router.post(
  "/events/:eventId/register",
  auth("ATTENDEE"),
  attendee_controller.register_event,
);

attendee_router.get(
  "/my-events/:eventId",
  auth("ATTENDEE"),
  eventAccess(),

  attendee_controller.get_my_events,
);
attendee_router.get(
  "/events/:eventId",
  auth("ATTENDEE"),
  eventAccess(),
  attendee_controller.get_single_event,
);

attendee_router.get(
  "/events/:eventId/sessions",
  auth("ATTENDEE"),
  eventAccess(),
  attendee_controller.get_event_sessions,
);

attendee_router.get(
  "/events/:eventId/home",
  auth("ATTENDEE"),
  eventAccess(),
  attendee_controller.get_event_home,
);

attendee_router.get(
  "/events/:eventId/qr-token",
  auth("ATTENDEE"),
  eventAccess(),
  attendee_controller.generate_qr_token,
);

export default attendee_router;
