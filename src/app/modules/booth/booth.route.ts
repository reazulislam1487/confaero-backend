import { Router } from "express";
import RequestValidator from "../../middlewares/request_validator";
import { booth_controller } from "./booth.controller";
import { booth_validations } from "./booth.validation";
import auth from "../../middlewares/auth";

const booth_router = Router();

booth_router.post(
  "/create",
  auth("EXHIBITOR", "STAFF"),
  RequestValidator(booth_validations.create),
  booth_controller.create_new_booth,
);

booth_router.get(
  "/me",
  auth("EXHIBITOR", "STAFF"),
  booth_controller.get_my_booth,
);

booth_router.patch(
  "/me",
  auth("EXHIBITOR", "STAFF"),
  // RequestValidator(booth_validations.update),
  booth_controller.update_my_booth,
);

export default booth_router;
