import { Router } from "express";
import RequestValidator from "../../middlewares/request_validator";
import { message_controller } from "./message.controller";
import { message_validations } from "./message.validation";
import auth from "../../middlewares/auth";
import eventAccess from "../../middlewares/eventAccess.middleware";

const router = Router();

router.post(
  "/send/:eventId",
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

  // RequestValidator(message_validations.send),
  message_controller.send,
);

router.get(
  "/conversations/:eventId",
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
  message_controller.conversations,
);

router.get(
  "/:conversationId/:eventId",
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

  RequestValidator(message_validations.getConversation),
  message_controller.messages,
);

router.patch(
  "/seen/:conversationId/:eventId",
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

  message_controller.seen,
);

export default router;
