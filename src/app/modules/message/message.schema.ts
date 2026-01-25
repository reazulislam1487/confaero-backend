import { Schema, model } from "mongoose";
import { T_Message } from "./message.interface";

const message_schema = new Schema<T_Message>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "event",
      required: true,
      index: true,
    },
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "conversation",
      required: true,
      index: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "account",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "account",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

message_schema.index({ conversationId: 1, createdAt: 1 });

export const message_model = model("message", message_schema);
