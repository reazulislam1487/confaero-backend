import { Router } from "express";
import RequestValidator from "../../middlewares/request_validator";
import { speaker_controller } from "./speaker.controller";
import { speaker_validations } from "./speaker.validation";
import eventAccess from "../../middlewares/eventAccess.middleware";
import auth from "../../middlewares/auth";

const speaker_router = Router();

// get speakers of an event (dashboard → speakers)
speaker_router.get(
  "/event/:eventId",
  auth("ATTENDEE"),
  eventAccess(),
  // RequestValidator(speaker_validations.get_event_speakers),
  speaker_controller.get_event_speakers,
);

speaker_router.get(
  "/event/:eventId/:speakerAccountId",
  auth("ATTENDEE"),
  eventAccess(),
  speaker_controller.get_event_speaker_details,
);

export default speaker_router;
