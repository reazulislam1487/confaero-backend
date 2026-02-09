import { Router } from "express";
import { sponsor_controller } from "./sponsor.controller";
import auth from "../../middlewares/auth";

const sponsor_router = Router();

sponsor_router.post(
  "/create",
  auth("SPONSOR"),
  sponsor_controller.create_new_sponsor,
);

sponsor_router.get(
  "/get-my-sponsor/:eventId",
  auth("SPONSOR"),
  sponsor_controller.get_my_sponsor,
);
sponsor_router.patch(
  "/update/:sponsorId",
  auth("SPONSOR"),
  sponsor_controller.update_my_sponsor,
);
sponsor_router.patch(
  "/view/:sponsorProfileId",
  auth(
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
  sponsor_controller.increment_profile_view,
);
sponsor_router.get(
  "/dashboard/:eventId",
  auth("SPONSOR"),
  sponsor_controller.get_sponsor_dashboard,
);

export default sponsor_router;
