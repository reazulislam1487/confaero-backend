import { Types } from "mongoose";

export type T_QNA = {
  eventId: Types.ObjectId;
  question: string;
  answer: string;
  createdBy: Types.ObjectId;
  isActive: boolean;
};

export type T_PollOption = {
  text: string;
  voteCount: number;
};

export type T_Poll = {
  eventId: Types.ObjectId;
  question: string;
  options: T_PollOption[];
  createdBy: Types.ObjectId;
  isActive: boolean;
};

export type T_PollResponse = {
  pollId: Types.ObjectId;
  userId: Types.ObjectId;
  selectedOptionIndex: number;
};

export type T_SurveyQuestion = {
  label: string;
  type: "rating" | "yes_no" | "text";
  required: boolean;
};

export type T_Survey = {
  eventId: Types.ObjectId;
  title: string;
  questions: T_SurveyQuestion[];
  createdBy: Types.ObjectId;
  isActive: boolean;
};

export type T_SurveyResponse = {
  surveyId: Types.ObjectId;
  userId: Types.ObjectId;
  answers: any[];
};
