import { Router } from "express";
import RequestValidator from "../../middlewares/request_validator";
import { photo_controller } from "./photo.controller";
import { photo_validations } from "./photo.validation";

const photo_router = Router();

photo_router.post(
  "/create",
  RequestValidator(photo_validations.create),
  photo_controller.create_new_photo
);

export default photo_router;
