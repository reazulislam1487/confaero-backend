import httpStatus from "http-status";
import { Account_Model } from "../auth/auth.schema";
import { AppError } from "../../utils/app_error";
import { Event_Model } from "../superAdmin/event.schema";
import { task_report_model } from "./report.schema";

const create_task_and_assign = async (payload: any, creatorId: string) => {
  const {
    eventId,
    volunteerEmail,
    title,
    date,
    time,
    location,
    instruction,
    referenceImage,
  } = payload;

  // 1️⃣ find volunteer account
  const account = await Account_Model.findOne({ email: volunteerEmail });
  if (!account) {
    throw new AppError("Volunteer not found", httpStatus.NOT_FOUND);
  }

  // 2️⃣ check event + participant role
  const event = await Event_Model.findById(eventId);
  if (!event) {
    throw new AppError("Event not found", httpStatus.NOT_FOUND);
  }

  const isVolunteer = event.participants.some(
    (p: any) =>
      p.accountId.toString() === account._id.toString() &&
      p.role === "VOLUNTEER",
  );

  if (!isVolunteer) {
    throw new AppError(
      "This user is not a volunteer of this event",
      httpStatus.BAD_REQUEST,
    );
  }

  // 3️⃣ create task
  return await task_report_model.create({
    eventId,
    title,
    date,
    time,
    location,
    instruction,
    referenceImage,
    assignedVolunteer: account._id,
    createdBy: creatorId,
  });
};

const get_my_tasks = async (volunteerId: string) => {
  return await task_report_model.find({ assignedVolunteer: volunteerId });
};

const complete_task = async (taskId: any, volunteerId: string) => {
  const task = await task_report_model.findOne({
    _id: taskId,
    assignedVolunteer: volunteerId,
  });

  if (!task) {
    throw new AppError("Task not found", httpStatus.NOT_FOUND);
  }

  task.status = "COMPLETED" as any;
  await task.save();
  return task;
};

export const task_service = {
  create_task_and_assign,
  get_my_tasks,
  complete_task,
};
