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
        sessionsCount: p.sessionsCount ?? 0,
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

export const event_attendee_service = { get_event_attendees_from_db };
