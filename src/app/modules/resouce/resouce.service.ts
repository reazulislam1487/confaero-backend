import { QNA_Model } from "./qna.model";
import { Poll_Model } from "./poll.model";
import { PollResponse_Model } from "./pollResponse.model";
import { SurveyResponse_Model } from "./surveyResponse.model";
import { Types } from "mongoose";

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

/* ===================== UPDATE ===================== */
const updatePoll = (pollId: any, eventId: any, payload: any) => {
  return Poll_Model.findOneAndUpdate({ _id: pollId, eventId }, payload, {
    new: true,
  });
};

/* ===================== DELETE ===================== */
const deletePoll = async (pollId: any, eventId: any) => {
  await Poll_Model.findOneAndDelete({ _id: pollId, eventId });
  await PollResponse_Model.deleteMany({ pollId });
};

/* ===================== VIEW VOTES ===================== */
const getPollVotes = async (pollId: any, eventId: any) => {
  const poll = await Poll_Model.findOne({
    _id: pollId,
    eventId,
  }).lean();

  if (!poll) return null;

  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.voteCount, 0);

  const options = poll.options.map((opt) => ({
    text: opt.text,
    votes: opt.voteCount,
    percentage:
      totalVotes === 0 ? 0 : Math.round((opt.voteCount / totalVotes) * 100),
  }));

  return {
    pollId,
    question: poll.question,
    totalVotes,
    options,
  };
};

/* ===================== SURVEY ===================== */

const submitSurvey = async (eventId: any, userId: any, payload: any) => {
  return SurveyResponse_Model.create({
    eventId,
    userId,
    rating: payload.rating,
    helpful: payload.helpful,
    suggestion: payload.suggestion,
  });
};

/* ================= ANALYTICS ================= */

const getSurveyAnalytics = async (eventId: any, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const eventObjectId = new Types.ObjectId(eventId);

  const submissions = await SurveyResponse_Model.find({
    eventId: eventObjectId,
  })
    .populate("userId", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const totalResponses = await SurveyResponse_Model.countDocuments({
    eventId: eventObjectId,
  });

  const avgAgg = await SurveyResponse_Model.aggregate([
    { $match: { eventId: eventObjectId } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  const positiveCount = await SurveyResponse_Model.countDocuments({
    eventId: eventObjectId,
    helpful: true,
  });

  return {
    summary: {
      totalResponses,
      averageRating:
        avgAgg.length > 0 ? Number(avgAgg[0].avgRating.toFixed(1)) : 0,
      positiveFeedback:
        totalResponses === 0
          ? 0
          : Math.round((positiveCount / totalResponses) * 100),
    },
    submissions,
    meta: {
      page,
      limit,
      total: totalResponses,
    },
  };
};

/* ===================== FETCH ===================== */

const getQnas = async (eventId: any) => {
  const qna = await QNA_Model.find({ eventId, isActive: true });

  return qna;
};

const getPolls = async (eventId: any) => {
  const polls = await Poll_Model.find({ eventId, isActive: true });

  return polls;
};

export const resouce_service = {
  createQna,
  updateQna,
  deleteQna,
  createPoll,
  submitPoll,
  submitSurvey,
  getSurveyAnalytics,
  getPolls,
  getQnas,
  updatePoll,
  deletePoll,
  getPollVotes,
};
