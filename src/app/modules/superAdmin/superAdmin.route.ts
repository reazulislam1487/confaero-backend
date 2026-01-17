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

super_admin_router.get(
  "/organizers",
  auth("SUPER_ADMIN"),
  super_admin_controller.get_all_organizers
);

super_admin_router.get(
  "/organizers/:id",
  auth("SUPER_ADMIN"),
  super_admin_controller.get_specific_organizer
);

super_admin_router.post(
  "/create/event",
  auth("SUPER_ADMIN"),
  RequestValidator(super_admin_validations.create_event),
  super_admin_controller.create_event_by_super_admin
);

super_admin_router.get(
  "/organizers/:id/events",
  auth("SUPER_ADMIN"),
  super_admin_controller.get_all_events_of_organizer
);

super_admin_router.get(
  "/events",
  auth("SUPER_ADMIN"),
  super_admin_controller.get_all_events
);

super_admin_router.get(
  "/organizers/:organizerId/events/:eventId",
  auth("SUPER_ADMIN"),
  super_admin_controller.get_specific_event_of_organizer
);

super_admin_router.get(
  "/users",
  auth("SUPER_ADMIN"),
  super_admin_controller.get_all_users
);

super_admin_router.get(
  "/users/:userId",
  auth("SUPER_ADMIN"),
  super_admin_controller.get_user_details
);
super_admin_router.delete(
  "/users/suspend",
  auth("SUPER_ADMIN"),
  super_admin_controller.suspend_user
);
super_admin_router.get(
  "/singleEvent/:eventId/overview",
  auth("SUPER_ADMIN", "ORGANIZER"),
  super_admin_controller.get_event_overview
);
super_admin_router.get(
  "/dashboard/overview",
  auth("SUPER_ADMIN"),
  super_admin_controller.get_dashboard_overview
);

export default super_admin_router;
