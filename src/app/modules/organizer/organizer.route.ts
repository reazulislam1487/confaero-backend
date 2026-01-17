import { Router } from "express";
import RequestValidator from "../../middlewares/request_validator";
import { organizer_controller } from "./organizer.controller";
import { organizer_validations } from "./organizer.validation";

const organizer_router = Router();

organizer_router.post(
  "/create",
  RequestValidator(organizer_validations.create),
  organizer_controller.create_new_organizer
);

export default organizer_router;
