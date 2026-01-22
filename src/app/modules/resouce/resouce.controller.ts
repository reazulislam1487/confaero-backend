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

/* ===================== SURVEY ===================== */

export const create_survey = catchAsync(async (req, res) => {
  const { eventId } = req.params;

  const result = await resouce_service.createSurvey({
    eventId,
    title: req.body.title,
    questions: req.body.questions,
    createdBy: req.user!.id,
  });

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Survey created successfully",
    data: result,
  });
});

export const submit_survey = catchAsync(async (req, res) => {
  const result = await resouce_service.submitSurvey({
    surveyId: req.body.surveyId,
    userId: req.user!.id,
    answers: req.body.answers,
  });

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Survey submitted successfully",
    data: result,
  });
});

/* ===================== EVENT RESOURCES ===================== */

export const get_event_resources = catchAsync(async (req, res) => {
  const { eventId } = req.params;

  const result = await resouce_service.getEventResources(eventId);

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event resources fetched successfully",
    data: result,
  });
});
