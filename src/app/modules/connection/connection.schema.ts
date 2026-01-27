import { Schema, model } from "mongoose";
import { T_Connection } from "./connection.interface";

const connection_event_schema = new Schema(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    sessionsCount: {
      type: Number,
      default: 0,
    },
  },
  { _id: false },
);

const connection_schema = new Schema<T_Connection>(
  {
    ownerAccountId: {
      type: Schema.Types.ObjectId,
      ref: "account",
      required: true,
      index: true,
    },

    connectedAccountId: {
      type: Schema.Types.ObjectId,
      ref: "account",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },

    isBookmarked: {
      type: Boolean,
      default: false,
    },

    events: {
      type: [connection_event_schema],
      default: [],
    },

    lastConnectedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// prevent duplicate connection requests
connection_schema.index(
  { ownerAccountId: 1, connectedAccountId: 1 },
  { unique: true },
);

export const connection_model = model<T_Connection>(
  "connection",
  connection_schema,
);
