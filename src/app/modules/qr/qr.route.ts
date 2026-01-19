import { Router } from "express";
// import RequestValidator from "../../middlewares/request_validator";
import { qr_controller } from "./qr.controller";
// import { qr_validations } from "./qr.validation";
import eventAccess from "../../middlewares/eventAccess.middleware";
import auth from "../../middlewares/auth";

const qr_router = Router();

qr_router.get(
  "/generate/:eventId",
  auth("ATTENDEE"),
  eventAccess(),
  // RequestValidator(qr_validations.generate),
  qr_controller.generate_qr,
);

qr_router.post(
  "/scan/:eventId",
  auth("ATTENDEE"),
  eventAccess(),
  // RequestValidator(qr_validations.scan),
  qr_controller.scan_qr,
);

export default qr_router;
