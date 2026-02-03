import { Router } from "express";
import { reviewer_controller } from "./reviewer.controller";
import auth from "../../middlewares/auth";
import eventAccess from "../../middlewares/eventAccess.middleware";

const reviewer_router = Router();

reviewer_router.get(
  "/dashboard/:eventId",
  auth("ABSTRACT_REVIEWER"),
  eventAccess(),
  reviewer_controller.get_reviewer_dashboard,
);

export default reviewer_router;
