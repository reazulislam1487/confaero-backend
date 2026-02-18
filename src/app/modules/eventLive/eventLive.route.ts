import { Router } from "express";
import auth from "../../middlewares/auth";
import { eventLive_controller } from "./eventLive.controller";

const router = Router();

router.post(
  "/start/:eventid",
  auth("SPEAKER", "ATTENDEE"),
  eventLive_controller.start_live_session,
);

//
router.post(
  "/join/:eventid",
  auth("SPEAKER", "ATTENDEE"),
  eventLive_controller.join_live_session,
);
router.post(
  "/join/:eventid",
  auth("SPEAKER", "ATTENDEE"),
  eventLive_controller.join_live_session,
);
router.post(
  "/end/:eventid",
  auth("SPEAKER", "ATTENDEE"),
  eventLive_controller.end_live_session,
);
export default router;
