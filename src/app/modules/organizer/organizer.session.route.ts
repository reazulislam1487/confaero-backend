import { Router } from "express";
import auth from "../../middlewares/auth";
import { upload } from "../../middlewares/upload";
import { organizer_session_controllers } from "./organizer.session.controller";

const router = Router();

router.get(
  "/events/:eventId/sessions",
  auth("ORGANIZER"),
  organizer_session_controllers.get_sessions,
);

router.get(
  "/events/:eventId/sessions/:sessionId",
  auth("ORGANIZER"),
  organizer_session_controllers.get_single_session,
);

router.post(
  "/events/:eventId/sessions",
  auth("ORGANIZER"),
  upload.single("floorMap"),
  organizer_session_controllers.add_session,
);

router.patch(
  "/events/:eventId/sessions/:sessionId",
  auth("ORGANIZER"),
  upload.single("floorMap"),
  organizer_session_controllers.update_session,
);

router.delete(
  "/events/:eventId/sessions/:sessionId",
  auth("ORGANIZER"),
  organizer_session_controllers.delete_session,
);

router.post(
  "/events/:eventId/sessions/upload-csv",
  auth("ORGANIZER"),
  upload.single("file"),
  organizer_session_controllers.upload_sessions_csv,
);

export default router;
