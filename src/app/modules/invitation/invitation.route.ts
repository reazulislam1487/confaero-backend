import { Router } from "express";
import RequestValidator from "../../middlewares/request_validator";
import auth from "../../middlewares/auth";
import { invitation_controller } from "./invitation.controller";
import { invitation_validations } from "./invitation.validation";

const invitation_router = Router();

invitation_router.post(
  "/create",
  auth("ORGANIZER"),
  RequestValidator(invitation_validations.create),
  invitation_controller.create_new_invitation
);

invitation_router.post(
  "/accept",
  auth(),
  RequestValidator(invitation_validations.accept),
  invitation_controller.accept_invitation
);

invitation_router.post(
  "/reject",
  auth(),
  RequestValidator(invitation_validations.reject),
  invitation_controller.reject_invitation
);

export default invitation_router;
