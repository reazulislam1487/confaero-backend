import { Lead } from "./qr.schema";

export const get_exhibitor_leads_service = async ({
  eventId,
  exhibitorId,
  filter = "all",
}: {
  eventId: any;
  exhibitorId: any;
  filter?: "all" | "hot" | "followup";
}) => {
  const query: any = {
    eventId,
    exhibitorId,
  };

  if (filter === "hot") {
    query.tags = "HOT";
  }

  if (filter === "followup") {
    query.tags = "FOLLOW_UP";
  }

  const leads = await Lead.find(query)
    .sort({ createdAt: -1 })
    .populate("attendeeId", "name avatar designation company");

  return {
    total: leads.length,
    leads: leads.map((lead: any) => ({
      leadId: lead._id,
      attendeeId: lead.attendeeId._id,
      name: lead.attendeeId.name,
      avatar: lead.attendeeId.avatar,
      designation: lead.attendeeId.designation,
      company: lead.attendeeId.company,
      tags: lead.tags,
      note: lead.note,
      createdAt: lead.createdAt,
    })),
  };
};
export const update_lead_note_service = async ({
  leadId,
  exhibitorId,
  note,
}: {
  leadId: any;
  exhibitorId: any;
  note: string;
}) => {
  const lead = await Lead.findOneAndUpdate(
    { _id: leadId, exhibitorId },
    { note },
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
