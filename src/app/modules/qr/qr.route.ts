import { Router } from "express";
// import RequestValidator from "../../middlewares/request_validator";
import { qr_controller } from "./qr.controller";
// import { qr_validations } from "./qr.validation";
import eventAccess from "../../middlewares/eventAccess.middleware";
import auth from "../../middlewares/auth";

const qr_router = Router();

qr_router.get(
  "/generate/:eventId",
  auth(
    "ORGANIZER",
    "ATTENDEE",
    "SPEAKER",
    "EXHIBITOR",
    "STAFF",
    "SPONSOR",
    "VOLUNTEER",
    "ABSTRACT_REVIEWER",
    "TRACK_CHAIR",
  ),
  eventAccess(),
  // RequestValidator(qr_validations.generate),
  qr_controller.generate_qr,
);

qr_router.post(
  "/scan/:eventId",
  auth(
    "ORGANIZER",
    "ATTENDEE",
    "SPEAKER",
    "EXHIBITOR",
    "STAFF",
    "SPONSOR",
    "VOLUNTEER",
    "ABSTRACT_REVIEWER",
    "TRACK_CHAIR",
  ),
  eventAccess(),
  // RequestValidator(qr_validations.scan),
  qr_controller.scan_qr_controller,
);
// volunteer

qr_router.get(
  "/volunteer/:eventId",
  auth("VOLUNTEER"),
  // eventAccess(),
  // RequestValidator(qr_validations.scan),
  qr_controller.get_volunteer_checkin_history,
);

// 🔹 Get all leads (All / Hot / Follow-up)
qr_router.get(
  "/exhibitor/:eventId/leads",
  auth("EXHIBITOR", "STAFF"),
  eventAccess(),
  qr_controller.get_exhibitor_leads,
);

// 🔹 Update lead note
qr_router.patch(
  "/exhibitor/leads/:leadId/note",
  auth("EXHIBITOR", "STAFF"),
  qr_controller.update_lead_note,
);

// 🔹 Update lead tags
qr_router.patch(
  "/exhibitor/leads/:leadId/tags",
  auth("EXHIBITOR", "STAFF"),
  qr_controller.update_lead_tags,
);

/**
 * =========================
 * STAFF ROUTES (READ ONLY)
 * =========================
 */

// 🔹 Event-wide check-in overview
// qr_router.get(
//   "/staff/:eventId/checkin-overview",
//   auth("STAFF"),
//   eventAccess(),
//   qr_controller.get_event_checkin_overview,
// );

export default qr_router;
