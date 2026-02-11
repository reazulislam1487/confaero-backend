import { Router } from "express";
import RequestValidator from "../../middlewares/request_validator";
import { chair_controller } from "./chair.controller";
import { chair_validations } from "./chair.validation";

const chair_router = Router();

chair_router.post(
  "/create",
  RequestValidator(chair_validations.create),
  chair_controller.create_new_chair
);

export default chair_router;
