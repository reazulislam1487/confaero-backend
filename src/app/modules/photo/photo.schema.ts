import { Schema, model } from "mongoose";
import { T_Photo } from "./photo.interface";

const photo_schema = new Schema<T_Photo>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      index: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "account",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const photo_model = model<T_Photo>("photo", photo_schema);
