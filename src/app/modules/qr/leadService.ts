import { ObjectId } from "mongodb";
import { UserProfile_Model } from "../user/user.schema";
import { Lead } from "./qr.schema";



export const get_exhibitor_leads_service = async ({
  eventId,
  exhibitorId,
  filter = "all",
  search = "",
}: {
  eventId: any;
  exhibitorId: any;
  filter?: "all" | "hot" | "followup";
  search?: string;
}) => {
  const query: any = {
    eventId,
    exhibitorId,
  };

  const normalizedFilter = filter.toLowerCase();

  if (normalizedFilter === "hot") {
    query.tags = { $in: ["hot"] };
  }

  if (normalizedFilter === "followup") {
    query.tags = { $in: ["follow-up"] };
  }
  const leads = await Lead.find(query)
    .sort({ createdAt: -1 })
    .populate("attendeeId", "email");

  // 1️⃣ collect all attendeeIds
  const attendeeIds = leads.map((lead: any) => lead.attendeeId?._id);

  // 2️⃣ fetch all related profiles at once
  const userProfiles = await UserProfile_Model.find({
    accountId: { $in: attendeeIds },
  });

  // 3️⃣ create map for fast lookup
  const profileMap = new Map(
    userProfiles.map((profile: any) => [profile.accountId.toString(), profile]),
  );

  // 4️⃣ build formatted list
  const formattedLeads = leads.map((lead: any) => {
    const profile = profileMap.get(lead.attendeeId._id.toString());
    const affiliation = profile?.affiliations?.[0];

    return {
      leadId: lead._id,
      attendeeId: lead.attendeeId._id,
      email: lead.attendeeId.email,
      name: profile?.name || "Unknown",
      avatar: profile?.avatar || null,
      designation: affiliation?.position || "Unknown",
      company: affiliation?.company || "Unknown",
      tags: lead.tags,
      note: lead.note,
      createdAt: lead.createdAt,
    };
  });

  // 🔍 SEARCH (name, email, company)
  const normalizedSearch = search.trim().toLowerCase();

  const filteredLeads = normalizedSearch
    ? formattedLeads.filter((lead) =>
        [lead.name, lead.email, lead.company]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch),
      )
    : formattedLeads;

  return {
    total: filteredLeads.length,
    leads: filteredLeads,
  };
};
export const update_lead_note_service = async ({
  leadId,
  exhibitorId,
  note,
}: {
  leadId: any;
  exhibitorId: string;
  note: string;
}) => {
  const cleanedNote = note?.trim() || null;

  const lead = await Lead.findOneAndUpdate(
    { _id: leadId, exhibitorId },
    { note: cleanedNote },
    { new: true },
  );

  if (!lead) {
    throw new Error("Lead not found");
  }

  return {
    leadId: lead._id,
    note: lead.note,
  };
};
export const update_lead_tags_service = async ({
  leadId,
  exhibitorId,
  tags,
}: {
  leadId: any;
  exhibitorId: any;
  tags: string[];
}) => {
  const lead = await Lead.findOneAndUpdate(
    { _id: leadId, exhibitorId },
    { tags },
    { new: true },
  );

  if (!lead) {
    throw new Error("Lead not found");
  }

  return {
    leadId: lead._id,
    tags: lead.tags,
  };
};
