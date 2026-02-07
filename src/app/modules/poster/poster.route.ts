import { Router } from "express";
import auth from "../../middlewares/auth";
import { poster_controller } from "./poster.controller";
import { upload } from "../../middlewares/upload";
import eventAccess from "../../middlewares/eventAccess.middleware";

const router = Router();

/* Single file (banner / pdf / image) */
router.post(
  "/upload-file",
  auth("ATTENDEE", "SPEAKER"),
  upload.single("file"),
  poster_controller.upload_single_file,
);

/* Multiple files (attachments) */
router.post(
  "/upload-files",
  auth("ATTENDEE", "SPEAKER"),
  upload.array("files", 10),
  poster_controller.upload_multiple_files,
);

/* Create poster */
router.post(
  "/create/:eventId",
  auth("ATTENDEE", "SPEAKER"),
  eventAccess(),
  // RequestValidator(poster_validations.create),
  poster_controller.create_new_poster,
);

router.get("/accepted", poster_controller.get_all_accepted_posters);
router.get(
  "/revised",
  auth("ATTENDEE", "SPEAKER"),
  poster_controller.get_revised_poster,
);
router.patch(
  "/author/attachments/:attachmentId",
  auth("ATTENDEE", "SPEAKER"),
  poster_controller.update_revised_attachment,
);

/* Public – Single Accepted Poster */
router.get("/accepted/:posterId", poster_controller.get_single_accepted_poster);

export default router;
