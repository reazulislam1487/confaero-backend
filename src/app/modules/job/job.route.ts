import { Router } from "express";
import RequestValidator from "../../middlewares/request_validator";
import auth from "../../middlewares/auth";
import { job_controller } from "./job.controller";
import { job_validations } from "./job.validation";

const job_router = Router();

job_router.post(
  "/",
  auth("ORGANIZER", "SUPER_ADMIN", "EXHIBITOR", "STAFF"),
  RequestValidator(job_validations.create),
  job_controller.create_new_job
);

job_router.get("/my", auth(), RequestValidator(job_validations.list), job_controller.my_jobs);

job_router.get(
  "/review",
  auth("ORGANIZER", "SUPER_ADMIN"),
  RequestValidator(job_validations.list),
  job_controller.review_jobs
);

job_router.get("/", job_controller.public_jobs);

job_router.get("/:jobId", job_controller.job_details);

job_router.patch(
  "/:jobId/status",
  auth("ORGANIZER", "SUPER_ADMIN"),
  RequestValidator(job_validations.update_status),
  job_controller.update_status
);

job_router.patch("/:jobId", auth(), job_controller.update_job);
job_router.delete("/:jobId", auth(), job_controller.delete_job);

export default job_router;
