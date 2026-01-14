import { Router } from "express";
import RequestValidator from "../../middlewares/request_validator";
import { profile_controller } from "./profile.controller";
import { profile_validations } from "./profile.validation";

const profile_router = Router();

profile_router.post(
  "/create",
  RequestValidator(profile_validations.create),
  profile_controller.create_new_profile
);

export default profile_router;
