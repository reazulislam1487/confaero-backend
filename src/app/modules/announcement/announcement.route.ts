import { Router } from "express";
import RequestValidator from "../../middlewares/request_validator";
import { announcement_controller } from "./announcement.controller";
import { announcement_validations } from "./announcement.validation";
import auth from "../../middlewares/auth";
import eventAccess from "../../middlewares/eventAccess.middleware";
import { upload } from "../../middlewares/upload";

const announcement_router = Router();

/* Organizer */
announcement_router.post(
  "/:eventId",
  auth("ORGANIZER"),
  eventAccess(),
  // RequestValidator(announcement_validations.create),
  upload.single("file"),
  announcement_controller.create_new_announcement,
);

announcement_router.patch(
  "/:id/:eventId",
  auth("ORGANIZER"),
  eventAccess(),
  // RequestValidator(announcement_validations.update),
  upload.single("file"),
  announcement_controller.update_announcement,
);
announcement_router.get(
  "/get-all/:eventId",
  auth("ORGANIZER"),
  eventAccess(),
  announcement_controller.get_all_announcement,
);

announcement_router.delete(
  "/:id/:eventId",
  auth("ORGANIZER"),
  eventAccess(),
  announcement_controller.delete_announcement,
);

/* App users */
announcement_router.get(
  "/event/:eventId",
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
  announcement_controller.get_event_announcements,
);

announcement_router.get(
  "/:id/:eventId",
  auth(
    "ATTENDEE",
    "ORGANIZER",
    "SPEAKER",
    "EXHIBITOR",
    "STAFF",
    "SPONSOR",
    "VOLUNTEER",
    "ABSTRACT_REVIEWER",
    "TRACK_CHAIR",
  ),
  eventAccess(),
  announcement_controller.get_single_announcement,
);

export default announcement_router;
