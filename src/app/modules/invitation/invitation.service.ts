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
        },
      },
    },
  );

  // 6️ Ensure role is ARRAY (VERY IMPORTANT)
  // if (!Array.isArray(user.role)) {
  //   user.role = [];
  // }

  // // 7️ Prevent duplicate role
  // if (user.role.includes(invitation.role)) {
  //   throw new Error(`User is already a ${invitation.role}`);
  // }

  // // 8️ Update user roles
  // user.role.push(invitation.role);
  // user.activeRole = invitation.role;
  // added role
  await Account_Model.findByIdAndUpdate(
    userId,
    {
      $addToSet: { role: invitation.role },
      activeRole: invitation.role,
    },
    { new: true },
  );

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

  const skip = (Number(page) - 1) * Number(limit);

  // 1️⃣ Invitations
  const invitations = await invitation_model
    .find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .lean(); // 🔥 important

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
export const invitation_service = {
  create_invitation,
  accept_invitation,
  reject_invitation,
  get_my_invitations,
  get_event_invitations,
  resend_invitation,
  delete_invitation,
};
