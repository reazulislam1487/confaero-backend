import { Router } from "express";
import {
  create_qna,
  update_qna,
  delete_qna,
  create_poll,
  submit_poll,
  create_survey,
  submit_survey,
  get_event_resources,
} from "./resouce.controller";
import auth from "../../middlewares/auth";
import eventAccess from "../../middlewares/eventAccess.middleware";

const router = Router();

/* ========= ORGANIZER ========= */

router.post("/qna/:eventId", auth("ORGANIZER"), eventAccess(), create_qna);

router.patch("/qna/:id/:eventId", auth("ORGANIZER"), eventAccess(), update_qna);

router.delete(
  "/qna/:id/:eventId",
  auth("ORGANIZER"),
  eventAccess(),
  delete_qna,
);

router.post("/poll/:eventId", auth("ORGANIZER"), eventAccess(), create_poll);

router.post(
  "/survey/:eventId",
  auth("ORGANIZER"),
  eventAccess(),
  create_survey,
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

/* ========= SHARED ========= */

router.get(
  "/event/:eventId",
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
  get_event_resources,
);

export default router;
