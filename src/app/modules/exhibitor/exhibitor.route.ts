import { Router } from "express";
import RequestValidator from "../../middlewares/request_validator";
import { exhibitor_controller } from "./exhibitor.controller";
import { exhibitor_validations } from "./exhibitor.validation";

const exhibitor_router = Router();

exhibitor_router.post(
  "/create",
  RequestValidator(exhibitor_validations.create),
  exhibitor_controller.create_new_exhibitor
);

export default exhibitor_router;
