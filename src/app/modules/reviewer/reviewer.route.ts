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
reviewer_router.patch(
  "/attachments/:attachmentId/approve",
  auth("ORGANIZER", "SUPER_ADMIN", "ABSTRACT_REVIEWER"),
  // eventAccess(),
  reviewer_controller.approve_attachment,
);

reviewer_router.patch(
  "/attachments/:attachmentId/reject",
  auth("ORGANIZER", "SUPER_ADMIN", "ABSTRACT_REVIEWER"),
  // eventAccess(),
  reviewer_controller.reject_attachment,
);

reviewer_router.patch(
  "/attachments/:attachmentId/revise",
  auth("ORGANIZER", "SUPER_ADMIN", "ABSTRACT_REVIEWER"),
  // eventAccess(),
  reviewer_controller.revise_attachment,
);

reviewer_router.patch(
  "/attachments/:attachmentId/flag-admin",
  auth("ORGANIZER", "SUPER_ADMIN", "ABSTRACT_REVIEWER"),
  // eventAccess(),
  reviewer_controller.flag_attachment_for_admin,
);
reviewer_router.post(
  "/attachments/:attachmentId/image-review",
  auth("ORGANIZER", "SUPER_ADMIN", "ABSTRACT_REVIEWER"),
  reviewer_controller.review_image_attachment,
);
export default reviewer_router;
