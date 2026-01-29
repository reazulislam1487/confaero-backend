import { Router } from "express";
import auth from "../../middlewares/auth";
import eventAccess from "../../middlewares/eventAccess.middleware";
import { message_organizer_controller } from "./messageOrganizer.controller";

const router = Router();

/**
 * ORGANIZER CHAT STATS
 * Total | Active | Unread
 */
router.get(
  "/stats/:eventId",
  auth("ORGANIZER"),
  eventAccess(),
  message_organizer_controller.stats,
);

/**
 * ORGANIZER CONVERSATIONS (LEFT PANEL)
 */
router.get(
  "/conversations/:eventId",
  auth("ORGANIZER"),
  eventAccess(),
  message_organizer_controller.conversations,
);

/**
 * ORGANIZER MESSAGES (MIDDLE PANEL)
 */
router.get(
  "/messages/:conversationId/:eventId",
  auth("ORGANIZER"),
  eventAccess(),
  message_organizer_controller.messages,
);

/**
 * MARK MESSAGES AS SEEN
 */
router.patch(
  "/seen/:conversationId/:eventId",
  auth("ORGANIZER"),
  eventAccess(),
  message_organizer_controller.seen,
);

/**
 * ORGANIZER NOTIFICATIONS
 */
router.get(
  "/notifications/:eventId",
  auth("ORGANIZER"),
  eventAccess(),
  message_organizer_controller.notifications,
);

/**
 * MARK NOTIFICATION READ
 */
router.patch(
  "/notifications/:id/:eventId",
  auth("ORGANIZER"),
  eventAccess(),
  message_organizer_controller.mark_notification_read,
);
router.get(
  "/presence/:userId/:eventId",
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
  message_organizer_controller.get_user_presence,
);
export default router;
