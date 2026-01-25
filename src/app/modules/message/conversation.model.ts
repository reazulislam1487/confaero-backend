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
  lastMessage: {
    type: String,
    default: "",
  },
  lastMessageAt: {
    type: Date,
    default: Date.now,
  },
});

conversation_schema.index({ eventId: 1, participants: 1 }, { unique: true });

export const conversation_model = model("conversation", conversation_schema);
