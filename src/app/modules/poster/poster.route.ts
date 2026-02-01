import { Router } from "express";
import RequestValidator from "../../middlewares/request_validator";
import { poster_controller } from "./poster.controller";
import { poster_validations } from "./poster.validation";

const poster_router = Router();

poster_router.post(
  "/create",
  RequestValidator(poster_validations.create),
  poster_controller.create_new_poster
);

export default poster_router;
