import { Types } from "mongoose";
import { Event_Model } from "../superAdmin/event.schema";
import { conversation_model } from "../message/conversation.model";
import { message_model } from "../message/message.schema";
import { AppError } from "../../utils/app_error";
import { UserProfile_Model } from "../user/user.schema";
import httpStatus from "http-status";
import { organizer_notification_model } from "./messageOrganizer.schema";

/**
 * CHAT STATS
 */
const get_chat_stats = async (organizerId: any, eventId: any) => {
  const eventObjectId = new Types.ObjectId(eventId);
  const organizerObjectId = new Types.ObjectId(organizerId);

  const event =
    await Event_Model.findById(eventObjectId).select("participants");

  const totalMember = event?.participants?.length || 0;

  const conversations = await conversation_model.find(
    {
      eventId: eventObjectId,
      participants: organizerObjectId,
    },
    { _id: 1 },
  );

  const conversationIds = conversations.map((c) => c._id);

  // 2️⃣ Only those conversation-er unread message count koro
  const unreadMessages = await message_model.countDocuments({
    eventId: eventObjectId,
    conversationId: { $in: conversationIds },
    readBy: { $ne: organizerObjectId },
  });

  return {
    totalMember,
    unreadMessages,
    activeMember: 0, // socket will update this
  };
};

/**
 * CONVERSATIONS (LEFT PANEL)
 */
const get_conversations = async (
  organizerId: any,
  eventId: any,
  search = "",
) => {
  const organizerObjectId = new Types.ObjectId(organizerId);
  const eventObjectId = new Types.ObjectId(eventId);

  const pipeline: any[] = [
    {
      $match: {
        eventId: eventObjectId,
        participants: organizerObjectId,
      },
    },
    {
      $addFields: {
        otherParticipant: {
          $first: {
            $filter: {
              input: "$participants",
              as: "p",
              cond: { $ne: ["$$p", organizerObjectId] },
            },
          },
        },
      },
    },
    {
      $lookup: {
        from: "user_profiles",
        localField: "otherParticipant",
        foreignField: "accountId",
        as: "profile",
      },
    },
    { $unwind: "$profile" },
  ];

  if (search) {
    pipeline.push({
      $match: {
        "profile.name": { $regex: search, $options: "i" },
      },
    });
  }

  pipeline.push(
    { $sort: { lastMessageAt: -1 } },
    {
      $project: {
        lastMessage: 1,
        lastMessageAt: 1,
        status: 1,
        profile: {
          accountId: "$profile.accountId",
          name: "$profile.name",
          avatar: "$profile.avatar",
          lastSeen: "$profile.lastSeen",
        },
      },
    },
  );

  const conversations = await conversation_model.aggregate(pipeline);

  const results = await Promise.all(
    conversations.map(async (conv: any) => {
      const unreadCount = await message_model.countDocuments({
        conversationId: conv._id,
        readBy: { $ne: organizerObjectId },
      });

      return { ...conv, unreadCount };
    }),
  );

  return results;
};

/**
 * MESSAGES
 */
const get_messages = async (conversationId: any) => {
  return message_model
    .find({ conversationId: new Types.ObjectId(conversationId) })
    .sort({ createdAt: 1 })
    .lean();
};

export const mark_seen = async (conversationId: any, viewerId: any) => {
  return message_model.updateMany(
    {
      conversationId: new Types.ObjectId(conversationId),

      // ❌ নিজের পাঠানো message বাদ
      senderId: { $ne: new Types.ObjectId(viewerId) },

      // ❌ যেগুলো আগে থেকেই seen, সেগুলো বাদ
      readBy: { $ne: new Types.ObjectId(viewerId) },
    },
    {
      // ✅ viewer কে seen list এ add করা (duplicate হবে না)
      $addToSet: { readBy: new Types.ObjectId(viewerId) },
    },
  );
};

/**
 * NOTIFICATIONS
 */

const get_notifications = async (
  organizerAccountId: any,
  eventId: any,
  page = 1,
  limit = 10,
) => {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(50, Math.max(1, limit)); // max 50
  const skip = (safePage - 1) * safeLimit;

  const filter = {
    eventId,
  };

  const [data, total] = await Promise.all([
    organizer_notification_model
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .select("title message type refId isRead createdAt")
      .lean(),

    organizer_notification_model.countDocuments(filter),
  ]);

  return {
    data,
    meta: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
};

const mark_notification_read = async (id: any, organizerId: any) => {
  return organizer_notification_model.findOneAndUpdate(
    {
      _id: new Types.ObjectId(id),
      receiverId: new Types.ObjectId(organizerId),
    },
    { isRead: true },
    { new: true },
  );
};
const get_user_presence = async (accountId: any, eventId: any) => {
  const userObjectId = new Types.ObjectId(accountId);
  const eventObjectId = new Types.ObjectId(eventId);

  // 1️⃣ Load profile
  const profile = await UserProfile_Model.findOne(
    { accountId: userObjectId },
    {
      name: 1,
      avatar: 1,
      lastSeen: 1,
    },
  ).lean();

  if (!profile) {
    throw new AppError("User profile not found", httpStatus.NOT_FOUND);
  }

  // 2️⃣ Resolve role from event
  const event = await Event_Model.findOne(
    {
      _id: eventObjectId,
      participants: {
        $elemMatch: {
          accountId: userObjectId,
        },
      },
    },
    {
      "participants.$": 1,
    },
  ).lean();

  if (!event || !event.participants?.length) {
    throw new AppError("User not part of this event", httpStatus.FORBIDDEN);
  }

  const role = (event as any).participants[0].role;

  // 3️⃣ Final response (UI READY)
  return {
    accountId: profile.accountId,
    name: profile.name ?? "",
    avatar: profile.avatar ?? null,
    role,
    lastSeen: profile.lastSeen ?? null,
  };
};

export const message_organizer_service = {
  get_chat_stats,
  get_conversations,
  get_messages,
  mark_seen,
  get_notifications,
  mark_notification_read,
  get_user_presence,
};
