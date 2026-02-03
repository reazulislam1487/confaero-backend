import { Router } from "express";
import auth from "../../middlewares/auth";
import { poster_assign_controller } from "./posterAssign.controller";
import eventAccess from "../../middlewares/eventAccess.middleware";

const poster_assign_router = Router();

poster_assign_router.post(
  "/create/:eventId",
  auth("ORGANIZER", "SUPER_ADMIN"),
  eventAccess(),
  poster_assign_controller.create_new_poster_assign,
);

poster_assign_router.get(
  "/unassigned/:eventId",
  auth("ORGANIZER", "SUPER_ADMIN"),
  eventAccess(),
  poster_assign_controller.get_unassigned_files,
);

poster_assign_router.get(
  "/assigned/:eventId",
  auth("ORGANIZER", "SUPER_ADMIN"),
  eventAccess(),
  poster_assign_controller.get_assigned_files,
);

poster_assign_router.get(
  "/reported/:eventId",
  auth("ORGANIZER", "SUPER_ADMIN"),
  eventAccess(),
  poster_assign_controller.get_reported_files,
);

poster_assign_router.post(
  "/review/:eventId",
  auth("ABSTRACT_REVIEWER"),
  eventAccess(),
  poster_assign_controller.submit_review,
);

poster_assign_router.post(
  "/reassign/:eventId",
  auth("ORGANIZER", "SUPER_ADMIN"),
  eventAccess(),
  poster_assign_controller.reassign_reviewer,
);

poster_assign_router.get(
  "/reviewer-stats/:eventId",
  auth("ORGANIZER", "SUPER_ADMIN"),
  eventAccess(),
  poster_assign_controller.get_reviewer_stats,
);
poster_assign_router.get(
  "/speakers/search/:eventId",
  auth("ORGANIZER", "SUPER_ADMIN"),
  eventAccess(),
  poster_assign_controller.search_speakers,
);
poster_assign_router.get(
  "/unassigned/search/:eventId",
  auth("ORGANIZER", "SUPER_ADMIN"),
  eventAccess(),
  poster_assign_controller.search_unassigned_files,
);
export default poster_assign_router;
