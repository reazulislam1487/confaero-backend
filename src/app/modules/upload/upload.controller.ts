import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import httpStatus from "http-status";
import { AppError } from "../../utils/app_error";
import { uploadToS3 } from "../../utils/s3";

export const upload_chat_attachment = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new AppError("File not found", httpStatus.BAD_REQUEST);
  }

  const url = await uploadToS3(req.file, "chat-attachments");

  manageResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Attachment uploaded",
    data: {
      url,
      name: req.file.originalname,
      size: req.file.size,
      mimeType: req.file.mimetype,
    },
  });
});
