import { Router } from "express";
import RequestValidator from "../../middlewares/request_validator";
import { report_controller } from "./report.controller";
import { report_validations } from "./report.validation";

const report_router = Router();

report_router.post(
  "/create",
  RequestValidator(report_validations.create),
  report_controller.create_new_report
);

export default report_router;
