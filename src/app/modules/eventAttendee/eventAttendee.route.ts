import { Router } from "express";
import { event_attendee_controller } from "./eventAttendee.controller";
import auth from "../../middlewares/auth";
import eventAccess from "../../middlewares/eventAccess.middleware";

const event_attendee_router = Router();

event_attendee_router.get(
  "/events/:eventId/attendees",
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
  event_attendee_controller.getEventAttendees,
);

event_attendee_router.get(
  "/events/:eventId/attendees/:accountId",
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
  event_attendee_controller.getEventAttendeeDetail,
);
export default event_attendee_router;
