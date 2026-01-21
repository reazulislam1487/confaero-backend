import { Router } from "express";
import RequestValidator from "../../middlewares/request_validator";
import { note_controller } from "./note.controller";
import { note_validations } from "./note.validation";
import auth from "../../middlewares/auth";

const note_router = Router();

note_router.post(
  "/create",
  auth(
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
  RequestValidator(note_validations.create),
  note_controller.create_new_note,
);
note_router.get(
  "/notes",
  auth(
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
  note_controller.get_notes,
);

export default note_router;
