import { Types } from "mongoose";
import { connection_model } from "../connection/connection.schema";
import { UserProfile_Model } from "../user/user.schema";
import { Event_Model } from "../superAdmin/event.schema";

type AttendeeProfile = {
  accountId: Types.ObjectId;
  name?: string;
  avatar?: string;
  affiliations?: {
    company?: string;
    isCurrent?: boolean;
  }[];
};
type Affiliation = {
  company?: string;
  position?: string;
  isCurrent?: boolean;
};

type UserProfileLean = {
  name?: string;
  avatar?: string;
  affiliations?: Affiliation[];
  contact?: {
    email?: string;
    phone?: string;
  };
  location?: {
    address?: string;
  };
};
type EventParticipant = {
  accountId: Types.ObjectId;
  role: string;
  sessionIndex?: number[];
};
const get_event_attendees_from_db = async (
  eventId: Types.ObjectId,
  viewerId: Types.ObjectId,
  filters: {
    search?: string;
    role?: string;
    bookmarked?: boolean;
  },
) => {
  /* 1️⃣ Load event participants */
  const event = await Event_Model.findById(eventId, { participants: 1 }).lean();

  if (!event) throw new Error("Event not found");

  let participants = event.participants || [];
  //   console.log(participants);

  /* 2️⃣ Role filter */
  if (filters.role && filters.role !== "all") {
    participants = participants.filter((p: any) => p.role === filters.role);
  }

  const accountIds = participants.map((p: any) => p.accountId);

  /* 3️⃣ Load profiles */
  const profileQuery: any = {
    accountId: { $in: accountIds },
  };

  if (filters.search) {
    profileQuery.$or = [
      { name: { $regex: filters.search, $options: "i" } },
      { "affiliations.company": { $regex: filters.search, $options: "i" } },
    ];
  }

  const profiles = (await UserProfile_Model.find(profileQuery, {
    accountId: 1,
    name: 1,
    avatar: 1,
    affiliations: 1,
  }).lean()) as AttendeeProfile[];

  const profileMap = new Map(profiles.map((p) => [p.accountId.toString(), p]));

  /* 4️⃣ Bookmark info */
  const bookmarks = await connection_model
    .find(
      {
        ownerAccountId: viewerId,
        connectedAccountId: { $in: accountIds },
        status: "accepted",
        isBookmarked: true,
        "events.eventId": eventId,
      },
      { connectedAccountId: 1 },
    )
    .lean();

  const bookmarkedSet = new Set(
    bookmarks.map((b: any) => b.connectedAccountId.toString()),
  );

  /* 5️⃣ Final mapping */
  const attendees = participants
    .map((p: any) => {
      const profile = profileMap.get(p.accountId.toString());
      if (!profile) return null;

      const currentAffiliation =
        profile.affiliations?.find((a) => a.isCurrent) ??
        profile.affiliations?.[0];

      const isBookmarked = bookmarkedSet.has(p.accountId.toString());

      if (filters.bookmarked && !isBookmarked) return null;
      return {
        accountId: p.accountId,
        name: profile.name ?? "",
        avatar: profile.avatar ?? null,
        company: currentAffiliation?.company ?? "",
        role: p.role,
        sessionsCount: p.sessionIndex.length ?? 0,
        isBookmarked,
      };
    })
    .filter(Boolean);

  /* 6️⃣ Summary counts */
  return {
    total: attendees.length,
    bookmarked: attendees.filter((a: any) => a.isBookmarked).length,
    attendees,
  };
};
const get_event_attendee_detail_from_db = async (
  eventId: Types.ObjectId,
  attendeeAccountId: Types.ObjectId,
  viewerAccountId: Types.ObjectId,
) => {
  /* 1️⃣ Validate attendee belongs to event */
  const event = (await Event_Model.findOne(
    {
      _id: eventId,
      "participants.accountId": attendeeAccountId,
    },
    { participants: 1 },
  ).lean()) as {
    participants: EventParticipant[];
  } | null;
  if (!event) {
    throw new Error("Attendee not part of this event");
  }

  const participant = event.participants.find(
    (p: any) => p.accountId.toString() === attendeeAccountId.toString(),
  );
  console.log(participant);
  /* 2️⃣ Profile load (same as connectionDetails) */
  const profile = (await UserProfile_Model.findOne(
    { accountId: attendeeAccountId },
    {
      name: 1,
      avatar: 1,
      affiliations: 1,
      contact: 1,
      location: 1,
    },
  ).lean()) as UserProfileLean | null;

  /* 3️⃣ Bookmark status (optional connection) */
  const connection = await connection_model
    .findOne(
      {
        ownerAccountId: viewerAccountId,
        connectedAccountId: attendeeAccountId,
        status: "accepted",
        "events.eventId": eventId,
      },
      { isBookmarked: 1 },
    )
    .lean();

  /* 4️⃣ Permissions */
  const canMessage = true; // same event → socket allowed
  const canEmail = Boolean(profile?.contact?.email);

  /* 5️⃣ Affiliation resolve */
  const currentAffiliation =
    profile?.affiliations?.find((a) => a.isCurrent) ??
    profile?.affiliations?.[0];

  /* 6️⃣ SAME RESPONSE SHAPE */
  return {
    id: attendeeAccountId, // frontend expects id
    accountId: attendeeAccountId,

    name: profile?.name ?? "",
    avatar: profile?.avatar ?? null,
    company: currentAffiliation?.company ?? "",

    role: participant?.role ?? "",
    sessionsCount: participant?.sessionIndex!.length ?? 0,
    isBookmarked: connection?.isBookmarked ?? false,

    contact: {
      email: profile?.contact?.email ?? null,
      phone: profile?.contact?.phone ?? null,
      location: profile?.location?.address ?? null,
    },

    actions: {
      canMessage,
      canEmail,
    },
  };
};

export const event_attendee_service = {
  get_event_attendees_from_db,
  get_event_attendee_detail_from_db,
};
