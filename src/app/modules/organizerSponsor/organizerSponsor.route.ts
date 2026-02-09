import { Router } from "express";
import RequestValidator from "../../middlewares/request_validator";
import { organizer_sponsor_controller } from "./organizerSponsor.controller";
import { organizer_sponsor_validations } from "./organizerSponsor.validation";

const organizer_sponsor_router = Router();

organizer_sponsor_router.post(
  "/create",
  RequestValidator(organizer_sponsor_validations.create),
  organizer_sponsor_controller.create_new_organizer_sponsor
);

export default organizer_sponsor_router;
