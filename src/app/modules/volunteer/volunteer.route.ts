import { Router } from "express";
import auth from "../../middlewares/auth";
import { task_controller } from "./volunteer.controller";

const router = Router();

router.post(
  "/create",
  auth("SUPER_ADMIN", "ORGANIZER"),
  task_controller.create_task,
);

router.get(
  "/my-tasks",
  auth("SUPER_ADMIN", "ORGANIZER", "VOLUNTEER"),

  task_controller.my_tasks,
);
router.get(
  "/my-task/:taskId",
  auth("SUPER_ADMIN", "ORGANIZER", "VOLUNTEER"),
  task_controller.get_task_details,
);

router.patch(
  "/:taskId/complete",
  auth("VOLUNTEER"),
  task_controller.complete_task,
);
router.get(
  "/today-progress",
  auth("VOLUNTEER"),
  task_controller.today_progress,
);

router.get(
  "/:eventId/volunteer/search",
  auth("SUPER_ADMIN", "ORGANIZER"),
  task_controller.search_volunteer_by_email,
);
router.get(
  "/volunteers",
  auth("SUPER_ADMIN", "ORGANIZER"),
  task_controller.get_volunteer_dashboard,
);

router.get(
  "/:reportId",
  auth("SUPER_ADMIN", "ORGANIZER"),
  task_controller.view_single_report,
);
export default router;
