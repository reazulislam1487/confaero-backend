import { NextFunction } from "express";
import { attendee_model } from "../modules/attendee/attendee.schema";
import httpStatus from "http-status";
import { Event_Model } from "../modules/superAdmin/event.schema";

const eventAccess = () => async (req: any, res: any, next: NextFunction) => {
  const { eventId } = req.params;
  const userId = req.user.id;
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

  if (req.user.role !== "ATTENDEE") {
    return next();
  }
  // const registration = await attendee_model.findOne({
  //   user: userId,
  //   event: eventId,
  //   status: "VERIFIED",
  // });
  // if (!registration) {
  //   return res.status(httpStatus.FORBIDDEN).json({
  //     success: false,
  //     message: "You do not have access to this event",
  //   });
  // }

  next();
};

export default eventAccess;
