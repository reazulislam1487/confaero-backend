import { Router } from "express";
import auth from "../../middlewares/auth";
import { organizer_controller } from "./organizer.controller";
import { upload } from "../../middlewares/upload";

const router = Router();

router.get("/events", auth("ORGANIZER"), organizer_controller.get_my_events);

router.patch(
  "/events/:eventId",
  auth("ORGANIZER"),
  upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "floorMapImages", maxCount: 10 },
  ]),
  organizer_controller.update_my_event,
);

export default router;
