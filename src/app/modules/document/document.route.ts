import { Router } from "express";
import RequestValidator from "../../middlewares/request_validator";
import { document_controller } from "./document.controller";
import { document_validations } from "./document.validation";
import auth from "../../middlewares/auth";

const router = Router();

/* Speaker */
router.post(
  "/:eventId",
  auth("ORGANIZER", "SUPER_ADMIN", "SPEAKER"),
  RequestValidator(document_validations.create),
  document_controller.create_new_document,
);

router.get(
  "/:eventId/my",
  auth("ORGANIZER", "SUPER_ADMIN", "SPEAKER"),
  document_controller.get_my_documents,
);

router.delete(
  "/my/:documentId",
  auth("ORGANIZER", "SUPER_ADMIN", "SPEAKER"),
  document_controller.delete_my_document,
);

/* Organizer / Super Admin */

router.get(
  "/:eventId/pending",
  auth("ORGANIZER", "SUPER_ADMIN"),
  document_controller.get_pending_documents,
);

router.get(
  "/:eventId",
  auth("ORGANIZER", "SUPER_ADMIN"),
  document_controller.get_all_documents,
);
router.get(
  "/:eventId/details/:documentId",
  auth(
    "SUPER_ADMIN",
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
  document_controller.get_details,
);
router.patch(
  "/status/:documentId",
  auth("ORGANIZER", "SUPER_ADMIN"),
  document_controller.update_document_status,
);
router.get("/:eventId/all", document_controller.get_all_documents_for_view);
export default router;
