import { Router } from "express";
import auth from "../../middlewares/auth";
import { organizer_booth_controller } from "./organizerBooth.controller";
import eventAccess from "../../middlewares/eventAccess.middleware";

const organizer_booth_router = Router();

organizer_booth_router.get(
  "/events/:eventId/booths",
  auth(
    "SUPER_ADMIN",
    "ORGANIZER",
    "ATTENDEE",
    "SPEAKER",
    "EXHIBITOR",
    "STAFF",
    "SPONSOR",
    "VOLUNTEER",
    "ABSTRACT_REVIEWER",
    "TRACK_CHAIR",
  ),
  // eventAccess(),
  organizer_booth_controller.get_event_booths,
);

organizer_booth_router.get(
  "/booths/:boothId",
  auth(
    "SUPER_ADMIN",
    "ORGANIZER",
    "ATTENDEE",
    "SPEAKER",
    "EXHIBITOR",
    "STAFF",
    "SPONSOR",
    "VOLUNTEER",
    "ABSTRACT_REVIEWER",
    "TRACK_CHAIR",
  ),
  organizer_booth_controller.get_booth_details,
);

organizer_booth_router.patch(
  "/booths/:boothId/number",
  auth("ORGANIZER", "SUPER_ADMIN"),
  organizer_booth_controller.update_booth_number,
);

organizer_booth_router.patch(
  "/booths/:boothId/accept",
  auth("ORGANIZER", "SUPER_ADMIN"),
  organizer_booth_controller.accept_booth,
);

organizer_booth_router.patch(
  "/booths/:boothId/cancel",
  auth("ORGANIZER", "SUPER_ADMIN"),
  organizer_booth_controller.cancel_booth,
);

export default organizer_booth_router;
