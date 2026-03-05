import { Router } from "express";
import {
  create_qna,
  update_qna,
  delete_qna,
  create_poll,
  submit_poll,
  submit_survey,
  get_survey_analytics,
  get_event_poll,
  get_event_qna,
  delete_poll,
  update_poll,
  view_poll_votes,
} from "./resouce.controller";
import auth from "../../middlewares/auth";
import eventAccess from "../../middlewares/eventAccess.middleware";
import RequestValidator from "../../middlewares/request_validator";
import { submitSurveySchema } from "./resouce.validation";

const router = Router();

/* ========= ORGANIZER ========= */

router.post(
  "/qna/:eventId",
  auth("ORGANIZER", "SUPER_ADMIN"),
  eventAccess(),
  create_qna,
);

router.patch(
  "/qna/:id/:eventId",
  auth("ORGANIZER", "SUPER_ADMIN"),
  eventAccess(),
  update_qna,
);

router.delete(
  "/qna/:id/:eventId",
  auth("ORGANIZER", "SUPER_ADMIN"),
  eventAccess(),
  delete_qna,
);

router.post(
  "/poll/:eventId",
  auth("ORGANIZER", "SUPER_ADMIN"),
  eventAccess(),
  create_poll,
);

/* ===== USER SUBMIT ===== */
router.post(
  "/survey/:eventId/submit",
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
  RequestValidator(submitSurveySchema),
  submit_survey,
);

/* ===== ORGANIZER VIEW ===== */
router.get(
  "/survey/:eventId/analytics",
  auth("ORGANIZER", "SUPER_ADMIN"),
  eventAccess(),
  get_survey_analytics,
);
/* ========= ATTENDEE / VOLUNTEER / SPEAKER ========= */

router.post(
  "/poll/:pollId/:eventId/submit",
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
  submit_poll,
);

router.post(
  "/survey/:eventId/submit",
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
  submit_survey,
);

// UPDATE poll
router.patch(
  "/poll/:pollId/:eventId",
  auth("ORGANIZER", "SUPER_ADMIN"),
  eventAccess(),
  update_poll,
);

// DELETE poll
router.delete(
  "/poll/:pollId/:eventId",
  auth("ORGANIZER", "SUPER_ADMIN"),
  eventAccess(),
  delete_poll,
);

// VIEW poll votes / analytics
router.get(
  "/poll/:pollId/:eventId/votes",
  auth("ORGANIZER", "SUPER_ADMIN"),
  eventAccess(),
  view_poll_votes,
);

/* ========= SHARED ========= */

router.get(
  "/event/qna/:eventId",
  auth(
    "ATTENDEE",
    "ORGANIZER",
    "SUPER_ADMIN",
    "SPEAKER",
    "EXHIBITOR",
    "STAFF",
    "SPONSOR",
    "VOLUNTEER",
    "ABSTRACT_REVIEWER",
    "TRACK_CHAIR",
  ),
  eventAccess(),
  get_event_qna,
);

router.get(
  "/event/poll/:eventId",
  auth(
    "ORGANIZER",
    "SUPER_ADMIN",
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
  get_event_poll,
);

export default router;
