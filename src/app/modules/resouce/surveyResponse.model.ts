import { Schema, model } from "mongoose";

const surveyResponseSchema = new Schema(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "event",
      required: true,
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "account",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    helpful: {
      type: Boolean,
      required: true,
    },

    suggestion: {
      type: String,
      trim: true,
      minlength: 80,
    },
  },
  { timestamps: true },
);

// 🔒 one feedback per user per event
surveyResponseSchema.index({ eventId: 1, userId: 1 }, { unique: true });

export const SurveyResponse_Model = model(
  "survey_response",
  surveyResponseSchema,
);
