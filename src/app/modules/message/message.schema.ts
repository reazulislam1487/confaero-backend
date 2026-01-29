import { Schema, model } from "mongoose";
import { T_Message } from "./message.interface";
export interface T_Attachment {
  url: string;
  name: string;
  size: number; // bytes
  mimeType: string; // image/png, application/pdf etc
}

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
    text: {
      type: String,
      required: true,
      trim: true,
    },
    readBy: {
      type: [Schema.Types.ObjectId],
      ref: "account",
      default: [],
    },
    attachments: {
      type: [
        {
          url: { type: String, required: true },
          name: { type: String, required: true },
          size: { type: Number, required: true },
          mimeType: { type: String, required: true },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

message_schema.index({ conversationId: 1, createdAt: 1 });

export const message_model = model("message", message_schema);
