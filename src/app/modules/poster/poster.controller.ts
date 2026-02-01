import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import httpStatus from "http-status";
import { uploadToS3 } from "../../utils/s3";
import { poster_service } from "./poster.service";

/* =========================
   SINGLE FILE UPLOAD
   ========================= */
const upload_single_file = catchAsync(async (req, res) => {
  const file = req.file;

  if (!file) {
    throw new Error("File is required");
  }

  const folder = req.query.folder?.toString() || "uploads";
  const url = await uploadToS3(file, folder);

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "File uploaded successfully",
    data: { url },
  });
});

/* =========================
   MULTIPLE FILE UPLOAD
   ========================= */
const upload_multiple_files = catchAsync(async (req, res) => {
  const files = req.files as Express.Multer.File[];

  console.log(files);

  if (!files || files.length === 0) {
    throw new Error("Files are required");
  }

  const folder = req.query.folder?.toString() || "uploads";
  const uploadedFiles = await Promise.all(
    files.map(async (file) => {
      const fileType: "pdf" | "image" =
        file.mimetype === "application/pdf" ? "pdf" : "image";

      return {
        url: await uploadToS3(file, folder),
        type: fileType,
        name: file.originalname,
        size: file.size,
      };
    }),
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Files uploaded successfully",
    data: uploadedFiles,
  });
});

/* =========================
   CREATE POSTER
   ========================= */
const create_new_poster = catchAsync(async (req, res) => {
  const authorId = req.user!.id;
  const { eventId } = req.params;

  const result = await poster_service.create_new_poster_into_db({
    ...req.body,
    eventId,
    authorId,
  });

  manageResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "New poster created successfully!",
    data: result,
  });
});

export const poster_controller = {
  upload_single_file,
  upload_multiple_files,
  create_new_poster,
};
