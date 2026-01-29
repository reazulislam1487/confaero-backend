import { Types } from "mongoose";
import { conversation_model } from "./conversation.model";
import { message_model } from "./message.schema";
import { AppError } from "../../utils/app_error";
import httpStatus from "http-status";
import { makeParticipantsKey } from "../../utils/participantsKey";

const getOrCreateConversation = async (
  eventId: Types.ObjectId,
  userA: Types.ObjectId,
  userB: Types.ObjectId,
) => {
  if (userA.toString() === userB.toString()) {
    throw new AppError("Cannot chat with yourself", httpStatus.BAD_REQUEST);
  }

  const participantsKey = makeParticipantsKey(userA, userB);

  const participants = [userA.toString(), userB.toString()]
    .sort()
    .map((id) => new Types.ObjectId(id));

  const conversation = await conversation_model.findOneAndUpdate(
    { eventId, participantsKey },
    {
      $setOnInsert: {
        eventId,
        participants,
        participantsKey,
        initiatedBy: userA,
        status: "pending",
      },
    },
    { upsert: true, new: true },
  );

  return conversation;
};

const send_message = async (
  userId: Types.ObjectId,
  eventId: any,
  receiverId: Types.ObjectId,
  text: string,
) => {
  const conversation = await getOrCreateConversation(
    eventId,
    userId,
    receiverId,
  );

  const message = await message_model.create({
    eventId,
    conversationId: conversation._id,
    senderId: userId,
    text,
    readBy: [userId],
  });

  conversation.lastMessage = text;
  conversation.lastMessageAt = new Date();

  if (
    conversation.status === "pending" &&
    conversation.initiatedBy &&
    conversation.initiatedBy.toString() !== userId.toString()
  ) {
    conversation.status = "active";
  }

  await conversation.save();

  /*  socket connected krar jnno
const io = getIO();

io.to(`event:${eventId}`).emit("message:new", message);
*/
  return message;
};

const get_conversations = async (
  userId: any,
  eventId: any,
  page = 1,
  limit = 10,
  search = "",
) => {
  const skip = (page - 1) * limit;
  const userObjectId = new Types.ObjectId(userId);

  const pipeline: any[] = [
    {
      $match: {
        eventId: new Types.ObjectId(eventId),
        participants: userObjectId,
      },
    },

    // other participant
    {
      $addFields: {
        otherParticipant: {
          $first: {
            $filter: {
              input: "$participants",
              as: "p",
              cond: { $ne: ["$$p", userObjectId] },
            },
          },
        },
      },
    },

    // lookup profile
    {
      $lookup: {
        from: "user_profiles", // ⚠️ ensure correct collection name
        localField: "otherParticipant",
        foreignField: "accountId",
        as: "participantProfile",
      },
    },

    { $unwind: "$participantProfile" },
  ];

  // 🔍 search by participant name
  if (search) {
    pipeline.push({
      $match: {
        "participantProfile.name": { $regex: search, $options: "i" },
      },
    });
  }

  // sort + pagination
  pipeline.push(
    { $sort: { lastMessageAt: -1 } },
    { $skip: skip },
    { $limit: limit },

    // ✅ ONLY REQUIRED FIELDS
    {
      $project: {
        lastMessage: 1,
        lastMessageAt: 1,
        participants: 1,
        status: 1,
        participantProfile: {
          accountId: "$participantProfile.accountId",
          name: "$participantProfile.name",
          avatar: "$participantProfile.avatar",
        },
      },
    },
  );

  const conversations = await conversation_model.aggregate(pipeline);

  // total count (meta)
  const countPipeline = pipeline.filter(
    (stage) =>
      !("$skip" in stage) && !("$limit" in stage) && !("$project" in stage),
  );
  countPipeline.push({ $count: "total" });

  const countResult = await conversation_model.aggregate(countPipeline);
  const total = countResult[0]?.total || 0;

  const results = await Promise.all(
    conversations.map(async (conv: any) => {
      const unreadCount = await message_model.countDocuments({
        conversationId: conv._id,
        readBy: { $ne: userObjectId },
      });

      return { ...conv, unreadCount };
    }),
  );

  return {
    data: results,
    meta: {
      page,
      limit,
      total,
    },
  };
};
// const get_conversations = async (userId: any, eventId: any) => {
//   const conversations = await conversation_model
//     .find({
//       eventId,
//       participants: userId,
//     })
//     .sort({ lastMessageAt: -1 })
//     .lean();

//   console.log(eventId, userId);

//   const results = await Promise.all(
//     conversations.map(async (conv) => {
//       const unreadCount = await message_model.countDocuments({
//         conversationId: conv._id,
//         readBy: { $ne: userId },
//       });

//       return { ...conv, unreadCount };
//     }),
//   );

//   return results;
// };

const get_messages = async (conversationId: any, userId: Types.ObjectId) => {
  return message_model.find({ conversationId }).sort({ createdAt: 1 });
};

const mark_seen = async (conversationId: any, userId: any) => {
  await message_model.updateMany(
    {
      conversationId,
      readBy: { $ne: userId },
    },
    { $addToSet: { readBy: userId } },
  );
};

export const message_service = {
  send_message,
  get_conversations,
  get_messages,
  mark_seen,
};
