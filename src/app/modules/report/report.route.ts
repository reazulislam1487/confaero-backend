import { Router } from "express";
import auth from "../../middlewares/auth";
import { report_controller } from "./report.controller";

const router = Router();

router.post(
  "/report",
  auth("VOLUNTEER"),
  report_controller.report_task_issue
);

export default router;
