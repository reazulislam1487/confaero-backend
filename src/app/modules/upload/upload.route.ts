import { Router } from "express";
import auth from "../../middlewares/auth";
import { upload_chat_attachment } from "./upload.controller";
import { upload } from "../../middlewares/upload";

const router = Router();

router.post(
  "/chat-attachment",
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
  upload.single("file"),
  upload_chat_attachment,
);

export default router;
