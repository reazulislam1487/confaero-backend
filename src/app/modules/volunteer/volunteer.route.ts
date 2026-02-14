import { Router } from "express";
import auth from "../../middlewares/auth";
import RequestValidator from "../../middlewares/request_validator";
import { task_controller } from "./volunteer.controller";

const router = Router();

router.post(
  "/create",
  auth("SUPER_ADMIN", "ORGANIZER"),
  task_controller.create_task,
);

router.get(
  "/my-tasks",
  auth("SUPER_ADMIN", "ORGANIZER"),

  task_controller.my_tasks,
);

router.patch(
  "/:taskId/complete",
  auth("SUPER_ADMIN", "ORGANIZER"),
  task_controller.complete_task,
);

export default router;
