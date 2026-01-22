import { QNA_Model } from "./qna.model";
import { Poll_Model } from "./poll.model";
import { PollResponse_Model } from "./pollResponse.model";
import { Survey_Model } from "./survey.model";
import { SurveyResponse_Model } from "./surveyResponse.model";

/* ===================== QNA ===================== */

const createQna = (payload: any) => QNA_Model.create(payload);

const updateQna = (id: any, payload: any) =>
  QNA_Model.findByIdAndUpdate(id, payload, { new: true });

const deleteQna = (id: any) => QNA_Model.findByIdAndDelete(id);

/* ===================== POLL ===================== */

const createPoll = (payload: any) => Poll_Model.create(payload);

const submitPoll = async (pollId: any, userId: any, index: number) => {
  await PollResponse_Model.create({
    pollId,
    userId,
    selectedOptionIndex: index,
  });

  await Poll_Model.findByIdAndUpdate(pollId, {
    $inc: { [`options.${index}.voteCount`]: 1 },
  });
};

/* ===================== SURVEY ===================== */

const createSurvey = (payload: any) => Survey_Model.create(payload);

const submitSurvey = (payload: any) => SurveyResponse_Model.create(payload);

/* ===================== FETCH ===================== */

const getEventResources = async (eventId: any) => {
  const qna = await QNA_Model.find({ eventId, isActive: true });
  const polls = await Poll_Model.find({ eventId, isActive: true });
  const surveys = await Survey_Model.find({ eventId, isActive: true });

  return { qna, polls, surveys };
};

export const resouce_service = {
  createQna,
  updateQna,
  deleteQna,
  createPoll,
  submitPoll,
  createSurvey,
  submitSurvey,
  getEventResources,
};
