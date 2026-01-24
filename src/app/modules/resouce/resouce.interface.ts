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

export type T_SurveyQuestionType = "rating" | "yes_no" | "text";

export type T_SurveyQuestion = {
  label: string;
  type: T_SurveyQuestionType;
  required: boolean;
  order: number;
};

export type T_Survey = {
  eventId: Types.ObjectId;
  title: string;
  description?: string;
  questions: T_SurveyQuestion[];
  createdBy: Types.ObjectId;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type T_SurveyResponse = {
  eventId: Types.ObjectId;
  userId: Types.ObjectId;

  rating: number; // 1–5
  helpful: boolean; // yes / no
  suggestion?: string; // optional (min 80 chars if provided)

  createdAt?: Date;
  updatedAt?: Date;
};
