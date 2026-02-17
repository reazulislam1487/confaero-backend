import { Router } from "express";
import RequestValidator from "../../middlewares/request_validator";
import { event_live_controller } from "./eventLive.controller";
import { event_live_validations } from "./eventLive.validation";

const event_live_router = Router();

event_live_router.post(
  "/create",
  RequestValidator(event_live_validations.create),
  event_live_controller.create_new_event_live
);

export default event_live_router;
