import crypto from "crypto";
import { invitation_model } from "./invitation.schema";
import { Event_Model } from "../superAdmin/event.schema";
import { User_Model } from "../user/user.schema";
import { Types } from "mongoose";
import { Account_Model } from "../auth/auth.schema";

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
export const invitation_service = {
  create_invitation,
  accept_invitation,
  reject_invitation,
  get_my_invitations,
};
