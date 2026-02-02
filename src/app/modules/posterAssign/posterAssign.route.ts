import { Router } from "express";
import auth from "../../middlewares/auth";
import { poster_assign_controller } from "./posterAssign.controller";
import eventAccess from "../../middlewares/eventAccess.middleware";

const poster_assign_router = Router();

poster_assign_router.post(
  "/create/:eventId",
  auth("ORGANIZER", "SUPER_ADMIN"),
  eventAccess(),
  // RequestValidator(poster_assign_validations.create),
  poster_assign_controller.create_new_poster_assign,
);

export default poster_assign_router;
