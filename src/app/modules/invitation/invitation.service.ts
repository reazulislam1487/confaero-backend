import crypto from "crypto";
import { invitation_model } from "./invitation.schema";
import { Event_Model } from "../superAdmin/event.schema";

const create_new_invitation_into_db = async (
  organizerId: any,
  payload: any,
) => {
  const token = crypto.randomUUID();

  const invitation = await invitation_model.create({
    organizerId,
    eventId: payload.eventId,
    email: payload.email,
    role: payload.role,
    token,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
  });

  return invitation;
};

const accept_invitation_into_db = async (token: any, userId: any) => {
  const invitation = await invitation_model.findOne({
    token,
    status: "PENDING",
  });

  invitation!.status = "ACCEPTED";
  await invitation!.save();

  await Event_Model.updateOne(
    { _id: invitation!.eventId },
    {
      $addToSet: {
        participants: {
          userId,
          role: invitation!.role,
        },
      },
    },
  );

  return invitation;
};

const reject_invitation_into_db = async (token: any) => {
  const invitation = await invitation_model.findOne({
    token,
    status: "PENDING",
  });

  invitation!.status = "REJECTED";
  await invitation!.save();

  return invitation;
};

export const invitation_service = {
  create_new_invitation_into_db,
  accept_invitation_into_db,
  reject_invitation_into_db,
};
