import { Schema, model } from "mongoose";
import { T_Poster } from "./poster.interface";

const poster_schema = new Schema<T_Poster>(
  {
    eventId: { type: Schema.Types.ObjectId, required: true, index: true },
    authorId: { type: Schema.Types.ObjectId, required: true },

    title: { type: String, required: true, maxlength: 25 },
    abstract: { type: String, required: true, maxlength: 200 },
    banner: { type: String, required: true },

    tags: { type: [String], default: [] },

    presenters: {
      type: [
        {
          name: { type: String, required: true },
          role: { type: String },
        },
      ],
      default: [],
    },

    videoLink: { type: String },
    dueDate: { type: String },
    attachments: {
      type: [
        {
          url: { type: String, required: true },
          type: { type: String, enum: ["pdf", "image"], required: true },
          name: { type: String, required: true },
          size: { type: Number },

          reviewStatus: {
            type: String,
            enum: ["pending", "approved", "revised", "flagged", "rejected"],
            default: "pending",
          },
          // _id: String,
          reviewReason: String,

          reviewScore: {
            originality: { type: Number, min: 0, max: 10 },
            scientificRigor: { type: Number, min: 0, max: 10 },
            clarity: { type: Number, min: 0, max: 10 },
            visualDesign: { type: Number, min: 0, max: 10 },
            impact: { type: Number, min: 0, max: 10 },
            presentation: { type: Number, min: 0, max: 10 },

            // final reviewer decision (Yes / No)
            overall: { type: Boolean },
          },
        },
      ],
      default: [],
    },

    status: { type: String, default: "pending" },
  },
  { timestamps: true },
);

export const poster_model = model<T_Poster>("poster", poster_schema);
