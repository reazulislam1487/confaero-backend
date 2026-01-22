import { Schema, model } from "mongoose";
import { T_SurveyResponse } from "./resouce.interface";

const surveyResponseSchema = new Schema<T_SurveyResponse>(
  {
    surveyId: { type: Schema.Types.ObjectId, ref: "survey", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "account", required: true },
    answers: [Schema.Types.Mixed],
  },
  { timestamps: true },
);

surveyResponseSchema.index({ surveyId: 1, userId: 1 }, { unique: true });

export const SurveyResponse_Model = model(
  "survey_response",
  surveyResponseSchema,
);
