import { Schema, model } from "mongoose";
import { T_Note } from "./note.interface";

const note_schema = new Schema<T_Note>(
  {
    accountId: {
      type: Schema.Types.ObjectId,
      ref: "account",
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export const note_model = model<T_Note>("note", note_schema);
