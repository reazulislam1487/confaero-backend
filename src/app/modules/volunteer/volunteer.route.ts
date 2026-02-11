import { Router } from "express";
import RequestValidator from "../../middlewares/request_validator";
import { volunteer_controller } from "./volunteer.controller";
import { volunteer_validations } from "./volunteer.validation";

const volunteer_router = Router();

volunteer_router.post(
  "/create",
  RequestValidator(volunteer_validations.create),
  volunteer_controller.create_new_volunteer
);

export default volunteer_router;
