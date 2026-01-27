import { Schema, model } from "mongoose";
import { T_Conversation } from "./message.interface";

const conversation_schema = new Schema<T_Conversation>({
  eventId: {
    type: Schema.Types.ObjectId,
    ref: "event",
    required: true,
    index: true,
  },
  participants: {
    type: [Schema.Types.ObjectId],
    ref: "account",
    required: true,
  },
  initiatedBy: {
    type: Schema.Types.ObjectId,
    ref: "account", // user A
  },
  status: {
    type: String,
    enum: ["pending", "active"],
    default: "pending",
  },
  participantsKey: { type: String, required: true },
  lastMessage: {
    type: String,
    default: "",
  },
  lastMessageAt: {
    type: Date,
    default: Date.now,
  },
});

conversation_schema.index({ eventId: 1, participantsKey: 1 }, { unique: true });

export const conversation_model = model("conversation", conversation_schema);
