import { Router } from "express";
import RequestValidator from "../../middlewares/request_validator";
import { sponsor_controller } from "./sponsor.controller";
import { sponsor_validations } from "./sponsor.validation";

const sponsor_router = Router();

sponsor_router.post(
  "/create",
  RequestValidator(sponsor_validations.create),
  sponsor_controller.create_new_sponsor,
);
sponsor_router.patch(
  "/update/:sponsorId",
  sponsor_controller.update_my_sponsor,
);

export default sponsor_router;
