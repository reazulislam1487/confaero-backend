import { Router } from "express";
import auth from "../../middlewares/auth";
import { upload } from "../../middlewares/upload";
import { organizer_session_controllers } from "./organizer.session.controller";
import eventAccess from "../../middlewares/eventAccess.middleware";

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

//for agenda
router.get(
  "/events/:eventId/agenda",
  auth(
    "ATTENDEE",
    "SPEAKER",
    "EXHIBITOR",
    "STAFF",
    "SPONSOR",
    "VOLUNTEER",
    "ABSTRACT_REVIEWER",
    "TRACK_CHAIR",
  ),
  eventAccess(),
  organizer_session_controllers.get_all_sessions,
);

router.get(
  "/events/:eventId/my-agenda",
  auth(
    "ATTENDEE",
    "SPEAKER",
    "EXHIBITOR",
    "STAFF",
    "SPONSOR",
    "VOLUNTEER",
    "ABSTRACT_REVIEWER",
    "TRACK_CHAIR",
  ),
  eventAccess(),
  organizer_session_controllers.get_my_agenda,
);

router.post(
  "/events/:eventId/my-agenda/:sessionIndex",
  auth(
    "ATTENDEE",
    "SPEAKER",
    "EXHIBITOR",
    "STAFF",
    "SPONSOR",
    "VOLUNTEER",
    "ABSTRACT_REVIEWER",
    "TRACK_CHAIR",
  ),
  eventAccess(),
  organizer_session_controllers.add_to_my_agenda,
);

router.delete(
  "/events/:eventId/my-agenda/:sessionIndex",
  auth(
    "ATTENDEE",
    "SPEAKER",
    "EXHIBITOR",
    "STAFF",
    "SPONSOR",
    "VOLUNTEER",
    "ABSTRACT_REVIEWER",
    "TRACK_CHAIR",
  ),
  eventAccess(),
  organizer_session_controllers.remove_from_my_agenda,
);
router.get(
  "/events/:eventId/agenda/:sessionIndex",
  auth(
    "ATTENDEE",
    "SPEAKER",
    "EXHIBITOR",
    "STAFF",
    "SPONSOR",
    "VOLUNTEER",
    "ABSTRACT_REVIEWER",
    "TRACK_CHAIR",
  ),
  eventAccess(),
  organizer_session_controllers.get_single_agenda_session,
);

router.get(
  "/events/:eventId/speakers/:speakerId",
  auth(
    "ATTENDEE",
    "SPEAKER",
    "EXHIBITOR",
    "STAFF",
    "SPONSOR",
    "VOLUNTEER",
    "ABSTRACT_REVIEWER",
    "TRACK_CHAIR",
  ),
  eventAccess(),
  organizer_session_controllers.get_speaker_profile,
);
router.patch(
  "/agenda/:eventId/:sessionIndex/toggle-like",
  auth(
    "ATTENDEE",
    "SPEAKER",
    "EXHIBITOR",
    "STAFF",
    "SPONSOR",
    "VOLUNTEER",
    "ABSTRACT_REVIEWER",
    "TRACK_CHAIR",
  ),
  eventAccess(),
  organizer_session_controllers.toggle_like_agenda_session,
);

// added track_chair access to above routes for testing, can be removed later if not needed
router.post(
  "/events/:eventId/agenda/:sessionIndex/speakers/:speakerId",
  auth("ORGANIZER", "SUPER_ADMIN", "TRACK_CHAIR"),
  eventAccess(),
  organizer_session_controllers.assign_speaker_to_session,
);

router.delete(
  "/events/:eventId/agenda/:sessionIndex/speakers/:speakerId",
  auth("ORGANIZER", "SUPER_ADMIN", "TRACK_CHAIR"),
  eventAccess(),
  organizer_session_controllers.remove_speaker_from_session,
);

router.get(
  "/event/:eventId/speakers/search",
  auth("ORGANIZER", "SUPER_ADMIN", "TRACK_CHAIR"),
  eventAccess(),
  organizer_session_controllers.search_speaker_by_email,
);

export default router;
