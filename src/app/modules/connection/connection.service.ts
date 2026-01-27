import { Types } from "mongoose";
import { connection_model } from "./connection.schema";

type SendRequestPayload = {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  eventId: any;
  role: string;
  sessionsCount?: number;
};

/**
 * SEND CONNECTION REQUEST
 */
const send_connection_request_into_db = async (payload: SendRequestPayload) => {
  const { senderId, receiverId, eventId, role, sessionsCount = 0 } = payload;

  if (senderId.equals(receiverId)) {
    throw new Error("You cannot send connection request to yourself");
  }

  const exists = await connection_model.findOne({
    ownerAccountId: senderId,
    connectedAccountId: receiverId,
  });

  if (exists) {
    throw new Error("Connection request already exists");
  }

  return connection_model.create({
    ownerAccountId: senderId,
    connectedAccountId: receiverId,
    status: "pending",
    events: [{ eventId, role, sessionsCount }],
  });
};

/**
 * GET INCOMING REQUESTS
 */
const get_incoming_requests_from_db = async (accountId: Types.ObjectId) => {
  return connection_model
    .find({
      connectedAccountId: accountId,
      status: "pending",
    })
    .populate({
      path: "ownerAccountId",
      populate: { path: "profile" },
    })
    .sort({ createdAt: -1 });
};

/**
 * ACCEPT REQUEST
 */
const accept_connection_request_into_db = async (
  requestId: Types.ObjectId,
  receiverId: Types.ObjectId,
) => {
  const request = await connection_model.findOne({
    _id: requestId,
    connectedAccountId: receiverId,
    status: "pending",
  });

  if (!request) {
    throw new Error("Connection request not found");
  }

  // update original request
  request.status = "accepted";
  request.lastConnectedAt = new Date();
  await request.save();

  // create reverse connection
  await connection_model.create({
    ownerAccountId: receiverId,
    connectedAccountId: request.ownerAccountId,
    status: "accepted",
    events: request.events,
    lastConnectedAt: new Date(),
  });

  return request;
};

/**
 * GET ACCEPTED CONNECTION LIST
 */
const get_all_connections_from_db = async (
  accountId: Types.ObjectId,
  filter?: string,
) => {
  const query: any = {
    ownerAccountId: accountId,
    status: "accepted",
  };

  if (filter === "favorite") {
    query.isBookmarked = true;
  }

  if (filter && filter !== "all" && filter !== "favorite") {
    query["events.role"] = filter;
  }

  return connection_model
    .find(query)
    .populate({
      path: "connectedAccountId",
      populate: { path: "profile" },
    })
    .sort({ lastConnectedAt: -1 });
};

/**
 * TOGGLE BOOKMARK
 */
const toggle_bookmark_into_db = async (
  accountId: Types.ObjectId,
  connectionId: Types.ObjectId,
) => {
  const connection = await connection_model.findOne({
    _id: connectionId,
    ownerAccountId: accountId,
    status: "accepted",
  });

  if (!connection) {
    throw new Error("Connection not found");
  }

  connection.isBookmarked = !connection.isBookmarked;
  await connection.save();

  return connection;
};

export const connection_service = {
  send_connection_request_into_db,
  get_incoming_requests_from_db,
  accept_connection_request_into_db,
  get_all_connections_from_db,
  toggle_bookmark_into_db,
};
