import { Router } from "express";
import auth from "../../middlewares/auth";
import eventAccess from "../../middlewares/eventAccess.middleware";
import { reviewer_controller } from "./reviewer.controller";

const reviewer_router = Router();

reviewer_router.get(
  "/dashboard/:eventId",
  auth("ABSTRACT_REVIEWER"),
  eventAccess(),
  reviewer_controller.get_reviewer_dashboard,
);

reviewer_router.get(
  "/authors/:eventId",
  auth("ABSTRACT_REVIEWER"),
  eventAccess(),
  reviewer_controller.get_reviewer_authors,
);

reviewer_router.get(
  "/authors/:authorId/submissions",
  auth("ABSTRACT_REVIEWER"),
  reviewer_controller.get_author_submissions,
);

reviewer_router.get(
  "/attachments/:attachmentId",
  auth("ABSTRACT_REVIEWER"),
  reviewer_controller.get_attachment_details,
);

export default reviewer_router;
