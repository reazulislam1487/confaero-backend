import { NextFunction } from "express";
import { attendee_model } from "../modules/attendee/attendee.schema";
import httpStatus from "http-status";
import { Event_Model } from "../modules/superAdmin/event.schema";
import { invitation_model } from "../modules/invitation/invitation.schema";

const eventAccess = () => async (req: any, res: any, next: NextFunction) => {
  const { eventId } = req.params;

  const userId = req.user.id;
  const userEmail = req.user.email;

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  if (!eventId) {
    return res.status(400).json({
      success: false,
      message: "Event ID is required",
    });
  }

  //   extra
  const eventExists = await Event_Model.exists({ _id: eventId });
  if (!eventExists) {
    return res.status(404).json({
      success: false,
      message: "Event not found",
    });
  }

  const invitation = await invitation_model.findOne({
    email: userEmail.toLowerCase(),
    status: { $in: ["PENDING", "ACCEPTED"] },
  });

  if (req.user.activeRole == "ATTENDEE" && !invitation) {
    const registration = await attendee_model.findOne({
      account: userId,
      event: eventId,
      status: "VERIFIED",
    });
    if (!registration) {
      return res.status(httpStatus.FORBIDDEN).json({
        success: false,
        message: "You do not have access to this event",
      });
    }
    return next();
  }
  next();
};

export default eventAccess;

/*

Extra if needed

const requireEventAccess = (allowedRoles = []) => {
  return async (req, res, next) => {
    const userId = req.user.id;
    const { eventId } = req.params;

    const participant = await EventParticipant.findOne({
      userId,
      eventId,
    });

    if (!participant) {
      return res.status(403).json({
        message: "You are not part of this event",
      });
    }

    if (
      allowedRoles.length &&
      !allowedRoles.includes(participant.role)
    ) {
      return res.status(403).json({
        message: "Access denied for your role",
      });
    }

    req.eventRole = participant.role;
    next();
  };
};
*/
