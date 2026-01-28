import { Types } from "mongoose";
import { connection_model } from "./connection.schema";
import { UserProfile_Model } from "../user/user.schema";

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

  //   if (senderId.equals(receiverId)) {
  //
  //   }

  if (senderId.toString() === receiverId.toString()) {
    throw new Error("You cannot send connection request to yourself");
  }
  // if (senderId === receiverId) {
  //   throw new Error("You cannot send connection request to yourself");
  // }
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

const get_incoming_requests_from_db = async (accountId: Types.ObjectId) => {
  const requests = await connection_model
    .find(
      {
        connectedAccountId: accountId,
        status: "pending",
      },
      {
        ownerAccountId: 1,
        isBookmarked: 1,
        events: 1,
      },
    )
    .populate({
      path: "ownerAccountId",
      select: "_id activeRole",
    })
    .lean();

  if (!requests || requests.length === 0) return [];

  /**
   * 2️⃣ Collect sender accountIds
   */
  const senderAccountIds = requests
    .map((r) => r.ownerAccountId?._id)
    .filter(Boolean);

  /**
   * 3️⃣ Fetch minimal profile data
   */
  const profiles = await UserProfile_Model.find(
    { accountId: { $in: senderAccountIds } },
    {
      accountId: 1,
      name: 1,
      avatar: 1,
      affiliations: 1,
    },
  ).lean();

  /**
   * 4️⃣ Create lookup map
   */
  const profileMap = new Map(
    profiles.map((profile: any) => [profile.accountId.toString(), profile]),
  );

  /**
   * 5️⃣ Shape final DTO (UI-ready)
   */
  return requests.map((req) => {
    const ownerAccount = req.ownerAccountId as {
      _id: Types.ObjectId;
      activeRole?: string;
    };

    const profile = profileMap.get(ownerAccount._id.toString());

    const eventInfo = Array.isArray(req.events) ? req.events[0] : null;

    const currentAffiliation =
      profile?.affiliations?.find((a: any) => a.isCurrent) ??
      profile?.affiliations?.[0];

    return {
      id: req._id,
      accountId: ownerAccount._id,
      name: profile?.name ?? "",
      avatar: profile?.avatar ?? null,
      company: currentAffiliation?.company ?? "",
      role: ownerAccount.activeRole ?? "",
      sessionsCount: eventInfo?.sessionsCount ?? 0,
      isBookmarked: req.isBookmarked ?? false,
    };
  });
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

  request.status = "accepted";
  request.lastConnectedAt = new Date();
  await request.save();

  await connection_model.create({
    ownerAccountId: receiverId,
    connectedAccountId: request.ownerAccountId,
    status: "accepted",
    events: request.events,
    lastConnectedAt: new Date(),
  });

  return request;
};

const get_all_connections_from_db = async (
  accountId: Types.ObjectId,
  filter?: string,
) => {
  const query: any = {
    ownerAccountId: accountId,
    status: "accepted",
  };

  if (filter === "favorite") query.isBookmarked = true;
  if (filter && filter !== "all" && filter !== "favorite") {
    query["events.role"] = filter;
  }

  const connections = await connection_model
    .find(query, {
      connectedAccountId: 1,
      events: 1,
      isBookmarked: 1,
    })
    .populate({
      path: "connectedAccountId",
      select: "_id activeRole",
    })
    .lean();

  if (!connections.length) return [];

  const accountIds = connections.map((c) => (c.connectedAccountId as any)._id);

  const profiles = await UserProfile_Model.find(
    { accountId: { $in: accountIds } },
    { accountId: 1, name: 1, avatar: 1, affiliations: 1 },
  ).lean();

  const profileMap = new Map(
    profiles.map((p: any) => [p.accountId.toString(), p]),
  );

  return connections.map((conn) => {
    const acc = conn.connectedAccountId as {
      _id: Types.ObjectId;
      activeRole?: string;
    };

    const profile = profileMap.get(acc._id.toString());
    const eventInfo = conn.events?.[0];

    const currentAffiliation =
      profile?.affiliations?.find((a: any) => a.isCurrent) ??
      profile?.affiliations?.[0];

    return {
      id: conn._id,
      accountId: acc._id,
      name: profile?.name ?? "",
      avatar: profile?.avatar ?? null,
      company: currentAffiliation?.company ?? "",
      role: eventInfo?.role ?? acc.activeRole ?? "",
      sessionsCount: eventInfo?.sessionsCount ?? 0,
      isBookmarked: conn.isBookmarked ?? false,
    };
  });
};

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
