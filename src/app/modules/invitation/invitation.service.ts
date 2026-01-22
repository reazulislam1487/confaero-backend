import crypto from "crypto";
import { invitation_model } from "./invitation.schema";
import { Event_Model } from "../superAdmin/event.schema";
import { User_Model } from "../user/user.schema";
import { Types } from "mongoose";
import { Account_Model } from "../auth/auth.schema";
import sendMail from "../../utils/mail_sender";

const create_invitation = async (
  organizerId: any,
  eventId: any,
  payload: any,
) => {
  const alreadyInvited = await invitation_model.findOne({
    eventId,
    email: payload.email.toLowerCase(),
    status: "PENDING",
  });

  if (alreadyInvited) {
    throw new Error("User already invited");
  }

  return invitation_model.create({
    organizerId,
    eventId,
    email: payload.email,
    role: payload.role,
  });
};

const accept_invitation = async (
  invitationId: any,
  email: any,
  userId: any,
) => {
  const invitation = await invitation_model.findOne({
    _id: invitationId,
    email: email.toLowerCase(),
    status: "PENDING",
  });

  if (!invitation) {
    throw new Error("Invitation not found or already processed");
  }
  invitation.status = "ACCEPTED";
  await invitation.save();

  await Event_Model.updateOne(
    { _id: invitation.eventId },
    {
      $addToSet: {
        participants: {
          accountId: userId,
          role: invitation.role,
          sessionIndex: [],
        },
      },
    },
  );

  await Account_Model.findByIdAndUpdate(
    userId,
    {
      $addToSet: { role: invitation.role },
      activeRole: invitation.role,
    },
    { new: true },
  );

  // 4️⃣ Update account role
  // await Account_Model.findByIdAndUpdate(account._id, {
  //   $addToSet: { role: "SPEAKER" },
  //   activeRole: "SPEAKER",
  // });

  return invitation;
};

const reject_invitation = async (invitationId: any, email: any) => {
  const invitation = await invitation_model.findOne({
    _id: invitationId,
    email: email.toLowerCase(),
    status: "PENDING",
  });

  if (!invitation) {
    throw new Error("Invitation not found or already processed");
  }

  invitation.status = "REJECTED";
  await invitation.save();

  return invitation;
};

const get_my_invitations = async (email: any) => {
  return invitation_model
    .find({ email })
    .populate("eventId")
    .sort({ createdAt: -1 });
};

// get event invitations

const get_event_invitations = async (eventId: any, query: any) => {
  const { role, status, search, page = 1, limit = 10 } = query;

  const filter: any = {
    eventId: new Types.ObjectId(eventId),
  };

  if (role) filter.role = role;
  if (status) filter.status = status;

  if (search) {
    filter.email = { $regex: search, $options: "i" };
  }

  const currentPage = Math.max(Number(page), 1);
  const perPage = Math.max(Number(limit), 1);

  const skip = (currentPage - 1) * perPage;

  // 1️⃣ Invitations
  const invitations = await invitation_model
    .find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .lean();
  const total = await invitation_model.countDocuments(filter);

  // 2️⃣ Emails → Accounts
  const emails = invitations.map((i) => i.email);
  const accounts = await Account_Model.find(
    { email: { $in: emails } },
    { _id: 1, email: 1 },
  ).lean();

  const emailToAccountId = new Map(
    accounts.map((a) => [a.email, a._id.toString()]),
  );

  // 3️⃣ accountId → Users
  const accountIds = [...emailToAccountId.values()].map(
    (id) => new Types.ObjectId(id),
  );

  const users = await User_Model.find(
    { accountId: { $in: accountIds } },
    { name: 1, accountId: 1 },
  ).lean();

  const accountIdToName = new Map(
    users.map((u) => [u.accountId!.toString(), u.name]),
  );

  // 4️⃣ Attach name
  const data = invitations.map((inv) => {
    const accountId = emailToAccountId.get(inv.email);
    return {
      ...inv,
      name: accountId ? accountIdToName.get(accountId) || "—" : "—",
    };
  });

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
    },
    data,
  };
};

const resend_invitation = async (invitationId: any) => {
  const invitation = await invitation_model.findById(invitationId);

  if (!invitation) {
    throw new Error("Invitation not found");
  }

  if (invitation.status === "ACCEPTED") {
    throw new Error("Cannot resend an accepted invitation");
  }

  // await sendMail({
  //   to: invitation.email,
  //   subject: "Event Invitation Reminder",
  //   textBody: "You have been invited to an event",
  //   htmlBody: `
  //     <p>You are invited as <b>${invitation.role}</b></p>
  //     <p>Please login to your dashboard to accept or reject.</p>
  //   `,
  // });

  invitation.status = "PENDING";
  await invitation.save();

  return invitation;
};

const delete_invitation = async (invitationId: any) => {
  const invitation = await invitation_model.findById(invitationId);

  if (!invitation) {
    throw new Error("Invitation not found");
  }

  const account = await Account_Model.findOne({
    email: invitation.email,
  });

  await Event_Model.updateOne(
    { _id: invitation.eventId },
    {
      $pull: {
        participants: {
          role: invitation.role,
        },
      },
    },
  );

  if (account) {
    const updatedRoles = (account.role || []).filter(
      (r: string) => r !== invitation.role,
    );

    account.role = updatedRoles;

    account.activeRole = updatedRoles.length > 0 ? updatedRoles[0] : "ATTENDEE";

    await account.save();
  }

  await invitation_model.findByIdAndDelete(invitationId);

  return {
    invitationId,
    removedRole: invitation.role,
  };
};

// 🔹 GET sessions for dropdown
const get_event_sessions = async (eventId: any) => {
  const event = (await Event_Model.findById(eventId, {
    "agenda.sessions": 1,
  }).lean()) as any;

  if (!event) {
    throw new Error("Event not found");
  }

  return event.agenda?.sessions?.map((session: any, index: any) => ({
    index, // 🔥 dropdown value
    title: session.title,
    date: session.date,
    time: session.time,
    floorMapLocation: session.floorMapLocation,
  }));
};

// 🔹 MAKE SPEAKER (NO invitation)
const make_speaker = async (
  organizerId: any,
  eventId: any,
  email: string,
  sessionIndex: number,
) => {
  const normalizedEmail = email.toLowerCase();

  const alreadyInvited = await invitation_model.findOne({
    eventId,
    email,
    status: "ACCEPTED",
  });

  if (alreadyInvited) {
    throw new Error("User already invited");
  }

  // 1️⃣ Find account
  const account = await Account_Model.findOne({
    email: normalizedEmail,
  });

  if (!account) {
    throw new Error("Account not found with this email");
  }

  // 2️⃣ Get event & validate sessionIndex
  const event = await Event_Model.findById(eventId);
  if (!event) {
    throw new Error("Event not found");
  }

  const agenda = event.agenda as any;
  if (sessionIndex < 0 || sessionIndex >= agenda.sessions.length) {
    throw new Error("Invalid session selected");
  }

  // 3️⃣ Add speaker to event
  await Event_Model.updateOne(
    { _id: new Types.ObjectId(eventId) },
    {
      $addToSet: {
        participants: {
          accountId: account._id,
          role: "SPEAKER",
          sessionIndex,
        },
      },
    },
  );

  // 4️⃣ Update account role
  await Account_Model.findByIdAndUpdate(account._id, {
    $addToSet: { role: "SPEAKER" },
    activeRole: "SPEAKER",
  });

  await invitation_model.create({
    organizerId,
    eventId,
    email,
    role: "SPEAKER",
    status: "ACCEPTED",
  });

  return {
    email: account.email,
    role: "SPEAKER",
    session: (event.agenda as any)!.sessions[sessionIndex],
  };
};

export const invitation_service = {
  create_invitation,
  accept_invitation,
  reject_invitation,
  get_my_invitations,
  get_event_invitations,
  resend_invitation,
  delete_invitation,
  get_event_sessions,
  make_speaker,
};
