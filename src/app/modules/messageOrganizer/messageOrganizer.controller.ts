import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import httpStatus from "http-status";
import { message_organizer_service } from "./messageOrganizer.service";
import { AppError } from "../../utils/app_error";

/**
 * GET ORGANIZER CHAT STATS
 */
const stats = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
  }

  const { eventId } = req.params;
  const organizerId = req.user.id;

  const result = await message_organizer_service.get_chat_stats(
    organizerId,
    eventId,
  );

  manageResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Organizer chat stats fetched",
    data: result,
  });
});

/**
 * GET ORGANIZER CONVERSATIONS
 */
const conversations = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
  }

  const { eventId } = req.params;
  const { search = "" } = req.query;
  const organizerId = req.user.id;

  const result = await message_organizer_service.get_conversations(
    organizerId,
    eventId,
    String(search),
  );

  manageResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Organizer conversations fetched",
    data: result,
  });
});

/**
 * GET MESSAGES
 */
const messages = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
  }

  const { conversationId } = req.params;

  const result =
    await message_organizer_service.get_messages(conversationId);

  manageResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Messages fetched",
    data: result,
  });
});

/**
 * MARK SEEN
 */
const seen = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
  }

  const { conversationId } = req.params;
  const organizerId = req.user.id;

  await message_organizer_service.mark_seen(conversationId, organizerId);

  manageResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Messages marked as read",
  });
});

/**
 * GET ORGANIZER NOTIFICATIONS
 */
const notifications = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
  }

  const { eventId } = req.params;
  const organizerId = req.user.id;

  const result = await message_organizer_service.get_notifications(
    organizerId,
    eventId,
  );

  manageResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Notifications fetched",
    data: result,
  });
});

/**
 * MARK NOTIFICATION READ
 */
const mark_notification_read = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
  }

  const { id } = req.params;
  const organizerId = req.user.id;

  const result =
    await message_organizer_service.mark_notification_read(id, organizerId);

  manageResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Notification marked as read",
    data: result,
  });
});

export const message_organizer_controller = {
  stats,
  conversations,
  messages,
  seen,
  notifications,
  mark_notification_read,
};
