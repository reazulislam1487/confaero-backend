import { Router } from "express";
import auth from "../../middlewares/auth";
import { organizer_controller } from "./organizer.controller";
import { upload } from "../../middlewares/upload";
import eventAccess from "../../middlewares/eventAccess.middleware";

const router = Router();

router.get("/events", auth("ORGANIZER","SUPER_ADMIN"), organizer_controller.get_my_events);

router.get(
  "/all-register/:eventId",

  auth("ORGANIZER","SUPER_ADMIN"),
  eventAccess(),
  organizer_controller.get_all_register,
);

router.patch(
  "/events/:eventId",
  auth("ORGANIZER","SUPER_ADMIN"),
  upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "floorMapImage", maxCount: 1 },
  ]),
  organizer_controller.update_my_event,
);
// get all floorMap
router.get(
  "/events/:eventId/floormaps",
  auth("ORGANIZER","SUPER_ADMIN"),
  organizer_controller.get_event_floormaps,
);

router.delete(
  "/events/:eventId/floormaps/:floorMapId",
  auth("ORGANIZER","SUPER_ADMIN"),
  organizer_controller.delete_floor_map,
);

// delete
router.delete(
  "/attendee/:eventId/:accountId",
  auth("ORGANIZER","SUPER_ADMIN"),
  eventAccess(),
  organizer_controller.remove_attendee,
);

router.get(
  "/attendee/:eventId/:accountId",
  auth("ORGANIZER","SUPER_ADMIN"),
  eventAccess(),
  organizer_controller.get_attendee_details,
);

export default router;
