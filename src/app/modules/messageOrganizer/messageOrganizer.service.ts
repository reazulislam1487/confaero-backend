import { Types } from "mongoose";
import { Event_Model } from "../superAdmin/event.schema";
import { conversation_model } from "../message/conversation.model";
import { message_model } from "../message/message.schema";
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

  const unreadMessages = await message_model.countDocuments({
    eventId: eventObjectId,
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

/**
 * MARK SEEN
 */
const mark_seen = async (conversationId: any, organizerId: any) => {
  await message_model.updateMany(
    {
      conversationId: new Types.ObjectId(conversationId),
      readBy: { $ne: new Types.ObjectId(organizerId) },
    },
    { $addToSet: { readBy: organizerId } },
  );
};

/**
 * NOTIFICATIONS
 */
const get_notifications = async (organizerId: any, eventId: any) => {
  return organizer_notification_model
    .find({
      receiverId: new Types.ObjectId(organizerId),
      eventId: new Types.ObjectId(eventId),
    })
    .sort({ createdAt: -1 })
    .lean();
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

export const message_organizer_service = {
  get_chat_stats,
  get_conversations,
  get_messages,
  mark_seen,
  get_notifications,
  mark_notification_read,
};
