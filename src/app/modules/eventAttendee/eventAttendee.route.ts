import { Router } from "express";
import RequestValidator from "../../middlewares/request_validator";
import { event_attendee_controller } from "./eventAttendee.controller";
import { event_attendee_validations } from "./eventAttendee.validation";

const event_attendee_router = Router();

event_attendee_router.post(
  "/create",
  RequestValidator(event_attendee_validations.create),
  event_attendee_controller.create_new_event_attendee
);

export default event_attendee_router;
