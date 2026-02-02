import { Schema, model } from "mongoose";
import { T_PosterAssign } from "./posterAssign.interface";

const poster_assign_schema = new Schema<T_PosterAssign>(
  {
    eventId: { type: Schema.Types.ObjectId, required: true, index: true },
    posterId: { type: Schema.Types.ObjectId, required: true, index: true },
    attachmentId: { type: Schema.Types.ObjectId, required: true },
    dueDate: { type: Date },
    reviewerId: { type: Schema.Types.ObjectId, required: true },
    assignedBy: { type: Schema.Types.ObjectId, required: true },
    status: {
      type: String,
      enum: ["assigned", "under_review", "reviewed", "reassigned"],
      default: "assigned",
    },
  },
  { timestamps: true },
);

poster_assign_schema.index(
  { posterId: 1, attachmentId: 1, reviewerId: 1 },
  { unique: true },
);

export const poster_assign_model = model<T_PosterAssign>(
  "poster_assign",
  poster_assign_schema,
);
