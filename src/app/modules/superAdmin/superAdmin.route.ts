import { Router } from "express";
import RequestValidator from "../../middlewares/request_validator";
import { super_admin_controller } from "./superAdmin.controller";
import { super_admin_validations } from "./superAdmin.validation";
import auth from "../../middlewares/auth";

const super_admin_router = Router();

super_admin_router.post(
  "/create/organizer",
  auth("SUPER_ADMIN"),
  RequestValidator(super_admin_validations.create_organizer),
  super_admin_controller.create_new_organizer
);
super_admin_router.post(
  "/create/event",
  auth("SUPER_ADMIN"),
  RequestValidator(super_admin_validations.create_event),
  super_admin_controller.create_event_by_super_admin
);

export default super_admin_router;
