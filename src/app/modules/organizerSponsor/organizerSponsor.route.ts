import { Router } from "express";
import { organizer_sponsor_controller } from "./organizerSponsor.controller";
import auth from "../../middlewares/auth";

const organizer_sponsor_router = Router();

organizer_sponsor_router.get(
  "/all-sponsors/:eventId",
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
  organizer_sponsor_controller.get_all_sponsors,
);

organizer_sponsor_router.get(
  "/sponsor/:sponsorId",
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
  organizer_sponsor_controller.get_single_sponsor,
);

organizer_sponsor_router.patch(
  "/:sponsorId/approve",
  auth("ORGANIZER", "SUPER_ADMIN"),
  organizer_sponsor_controller.approve_sponsor,
);

organizer_sponsor_router.patch(
  "/:sponsorId/reject",
  auth("ORGANIZER", "SUPER_ADMIN"),
  organizer_sponsor_controller.reject_sponsor,
);

export default organizer_sponsor_router;
