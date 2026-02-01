import { Request, Response } from "express";
import httpStatus from "http-status";
import manageResponse from "../../utils/manage_response";
import catchAsync from "../../utils/catch_async";
import * as session_service from "./organizer.session.service";
import { AppError } from "../../utils/app_error";
import { csv } from "csvtojson";
import { uploadToS3 } from "../../utils/s3";

const get_sessions = catchAsync(async (req: Request, res: Response) => {
  const result = await session_service.get_sessions(
    req.user,
    String(req.params.eventId),
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sessions fetched successfully",
    data: result,
  });
});

const get_single_session = catchAsync(async (req: Request, res: Response) => {
  const result = await session_service.get_single_session(
    req.user,
    String(req.params.eventId),
    String(req.params.sessionId),
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Session fetched successfully",
    data: result,
  });
});

const add_session = catchAsync(async (req: Request, res: Response) => {
  let payload = req.body;
  // 🔹 ONLY image upload logic added
  if (req.file) {
    const imageUrl = await uploadToS3(req.file, "floor-maps");
    payload = {
      ...payload,
      floorMapLocation: imageUrl, // ⬅️ S3 URL save
    };
  }
  const result = await session_service.add_session(
    req.user,
    String(req.params.eventId),
    payload,
  );

  manageResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Session added successfully",
    data: result,
  });
});

const update_session = catchAsync(async (req: Request, res: Response) => {
  let payload = req.body;

  // 🔹 ONLY image upload logic added
  if (req.file) {
    const imageUrl = await uploadToS3(req.file, "floor-maps");
    payload = {
      ...payload,
      floorMapLocation: imageUrl, // ⬅️ overwrite only if file exists
    };
  }
  const result = await session_service.update_session(
    req.user,
    String(req.params.eventId),
    String(req.params.sessionId),
    payload,
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Session updated successfully",
    data: result,
  });
});

const delete_session = catchAsync(async (req: Request, res: Response) => {
  const result = await session_service.delete_session(
    req.user,
    String(req.params.eventId),
    String(req.params.sessionId),
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Session deleted successfully",
    data: result,
  });
});

const upload_sessions_csv = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError("CSV file is required", httpStatus.BAD_REQUEST);
  }

  // CSV → JSON
  let sessions: any[];
  try {
    sessions = await csv().fromString(req.file.buffer.toString());
  } catch (err) {
    throw new AppError("Invalid CSV format", httpStatus.BAD_REQUEST);
  }

  if (!sessions.length) {
    throw new AppError("CSV file is empty", httpStatus.BAD_REQUEST);
  }

  const result = await session_service.bulk_add_sessions(
    req.user,
    String(req.params.eventId),
    sessions,
  );

  manageResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Sessions uploaded successfully",
    data: result,
  });
});

// for agenda

const get_all_sessions = catchAsync(async (req: Request, res: Response) => {
  const result = await session_service.get_all_sessions(
    req.user,
    req.params.eventId,
    req.query,
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Agenda fetched successfully",
    data: result,
  });
});

const get_my_agenda = catchAsync(async (req: Request, res: Response) => {
  const result = await session_service.get_my_agenda(
    req.user,
    req.params.eventId,
    req.query,
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My agenda fetched successfully",
    data: result,
  });
});

const add_to_my_agenda = catchAsync(async (req: Request, res: Response) => {
  const result = await session_service.add_to_my_agenda(
    req.user,
    req.params.eventId,
    Number(req.params.sessionIndex),
  );

  manageResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Session bookmarked",
    data: result,
  });
});

const remove_from_my_agenda = catchAsync(
  async (req: Request, res: Response) => {
    const result = await session_service.remove_from_my_agenda(
      req.user,
      req.params.eventId,
      Number(req.params.sessionIndex),
    );

    manageResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Session removed from agenda",
      data: result,
    });
  },
);
const toggle_like_agenda_session = catchAsync(
  async (req: Request, res: Response) => {
    const result = await session_service.toggle_like_session(
      req.user,
      req.params.eventId,
      Number(req.params.sessionIndex),
    );

    manageResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: result.liked
        ? "Session liked successfully"
        : "Session unliked successfully",
      data: result,
    });
  },
);

const get_single_agenda_session = catchAsync(
  async (req: Request, res: Response) => {
    const result = await session_service.get_single_agenda_session(
      req.user,
      req.params.eventId,
      Number(req.params.sessionIndex),
    );

    manageResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Session details fetched successfully",
      data: result,
    });
  },
);
const get_speaker_profile = catchAsync(async (req: Request, res: Response) => {
  const { eventId, speakerId } = req.params;

  const result = await session_service.get_speaker_profile_from_db(
    req.user,
    eventId,
    speakerId,
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Speaker profile fetched successfully",
    data: result,
  });
});

export const organizer_session_controllers = {
  get_sessions,
  get_single_session,
  add_session,
  update_session,
  delete_session,
  upload_sessions_csv,
  get_all_sessions,
  get_my_agenda,
  add_to_my_agenda,
  remove_from_my_agenda,
  get_single_agenda_session,
  get_speaker_profile,
  toggle_like_agenda_session,
};
