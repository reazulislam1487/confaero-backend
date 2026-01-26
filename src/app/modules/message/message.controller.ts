import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import httpStatus from "http-status";
import { message_service } from "./message.service";
import { AppError } from "../../utils/app_error";

const send = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
  }

  const { receiverId, text } = req.body;
  const { eventId } = req.params;
  const userId = req.user.id;

  const result = await message_service.send_message(
    userId,
    eventId,
    receiverId,
    text,
  );

  manageResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Message sent",
    data: result,
  });
});

const conversations = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
  }
  const { eventId } = req.params;
  const { id: userId } = req.user;

  const result = await message_service.get_conversations(userId, eventId);

  manageResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Conversations fetched",
    data: result,
  });
});

const messages = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
  }

  const { conversationId } = req.params;
  const userId = req.user.id;

  const result = await message_service.get_messages(conversationId, userId);

  manageResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Messages fetched",
    data: result,
  });
});

const seen = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
  }

  const { conversationId } = req.params;
  const userId = req.user.id;

  await message_service.mark_seen(conversationId, userId);

  manageResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Messages marked as read",
  });
});

export const message_controller = {
  send,
  conversations,
  messages,
  seen,
};
