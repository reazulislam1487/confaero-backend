import { Router } from "express";
import RequestValidator from "../../middlewares/request_validator";
import { reviewer_controller } from "./reviewer.controller";
import { reviewer_validations } from "./reviewer.validation";

const reviewer_router = Router();

reviewer_router.post(
  "/create",
  RequestValidator(reviewer_validations.create),
  reviewer_controller.create_new_reviewer
);

export default reviewer_router;
