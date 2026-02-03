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
reviewer_router.get(
  "/assignments/abstracts/:eventId",
  auth("ABSTRACT_REVIEWER"),
  eventAccess(),
  // RequestValidator(reviewer_validations.get_assigned_abstracts),
  reviewer_controller.get_assigned_abstracts,
);
reviewer_router.get(
  "/assignments/abstracts/attachment/:attachmentId",
  auth("ABSTRACT_REVIEWER"),
  reviewer_controller.get_assigned_abstract_details,
);
export default reviewer_router;
