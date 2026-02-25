import { Router } from "express";
import auth from "../../middlewares/auth";
import { verify_email_controller } from "./verifyEmail.controller";
import { upload } from "../../middlewares/upload";

const verify_email_router = Router();

verify_email_router.post(
  "/events/:eventId/upload-csv",
  auth("ORGANIZER"),
  upload.single("file"),
  verify_email_controller.create_new_verify_email,
);
verify_email_router.get(
  "/events/:eventId",
  auth("ORGANIZER"),
  verify_email_controller.get_all_verify_emails,
);
verify_email_router.delete(
  "/events/:eventId/:verifyEmailId",
  auth("ORGANIZER"),
  verify_email_controller.delete_verify_email,
);
verify_email_router.post(
  "/events/:eventId/add-emails",
  auth("ORGANIZER"),
  verify_email_controller.add_verified_emails,
);
export default verify_email_router;
