import catchAsync from "../../utils/catch_async";
import httpStatus from "http-status";
import { resouce_service } from "./resouce.service";
import manageResponse from "../../utils/manage_response";

/* ===================== QNA ===================== */

export const create_qna = catchAsync(async (req, res) => {
  const { eventId } = req.params;

  const result = await resouce_service.createQna({
    eventId,
    question: req.body.question,
    answer: req.body.answer,
    createdBy: req.user!.id,
  });

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "QNA created successfully",
    data: result,
  });
});

export const update_qna = catchAsync(async (req, res) => {
  const result = await resouce_service.updateQna(req.params.id, req.body);

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "QNA updated successfully",
    data: result,
  });
});

export const delete_qna = catchAsync(async (req, res) => {
  await resouce_service.deleteQna(req.params.id);

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "QNA deleted successfully",
  });
});

/* ===================== POLL ===================== */

export const create_poll = catchAsync(async (req, res) => {
  const { eventId } = req.params;

  const result = await resouce_service.createPoll({
    eventId,
    question: req.body.question,
    options: req.body.options,
    createdBy: req.user!.id,
  });

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Poll created successfully",
    data: result,
  });
});

export const submit_poll = catchAsync(async (req, res) => {
  await resouce_service.submitPoll(
    req.params.pollId,
    req.user!.id,
    req.body.selectedOptionIndex,
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Poll submitted successfully",
  });
});
/* ===================== UPDATE POLL ===================== */
export const update_poll = catchAsync(async (req, res) => {
  const { pollId, eventId } = req.params;

  const result = await resouce_service.updatePoll(pollId, eventId, req.body);

  if (!result) {
    return manageResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Poll not found for this event",
    });
  }

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Poll updated successfully",
    data: result,
  });
});

/* ===================== DELETE POLL ===================== */
export const delete_poll = catchAsync(async (req, res) => {
  const { pollId, eventId } = req.params;

  await resouce_service.deletePoll(pollId, eventId);

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Poll deleted successfully",
  });
});

/* ===================== VIEW POLL VOTES ===================== */
export const view_poll_votes = catchAsync(async (req, res) => {
  const { pollId, eventId } = req.params;

  const result = await resouce_service.getPollVotes(pollId, eventId);

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Poll votes fetched successfully",
    data: result,
  });
});

/* ===================== SURVEY ===================== */

export const submit_survey = catchAsync(async (req, res) => {
  const { eventId } = req.params;

  const result = await resouce_service.submitSurvey(
    eventId,
    req.user!.id,
    req.body,
  );

  manageResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Feedback submitted successfully",
    data: result,
  });
});

/* ================= ORGANIZER VIEW ================= */

export const get_survey_analytics = catchAsync(async (req, res) => {
  const { eventId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const result = await resouce_service.getSurveyAnalytics(
    eventId,
    Number(page),
    Number(limit),
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Survey analytics fetched successfully",
    data: result,
  });
});

/* ===================== EVENT RESOURCES ===================== */

export const get_event_resources = catchAsync(async (req, res) => {
  const { eventId } = req.params;

  const result = await resouce_service.getQnas(eventId);

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "qna fetched successfully",
    data: result,
  });
});
export const get_event_qna = catchAsync(async (req, res) => {
  const { eventId } = req.params;

  const result = await resouce_service.getQnas(eventId);

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "qna fetched successfully",
    data: result,
  });
});
export const get_event_poll = catchAsync(async (req, res) => {
  const { eventId } = req.params;

  const result = await resouce_service.getPolls(eventId);

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "qna fetched successfully",
    data: result,
  });
});
