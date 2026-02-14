import httpStatus from "http-status";
import { Account_Model } from "../auth/auth.schema";
import { AppError } from "../../utils/app_error";
import { Event_Model } from "../superAdmin/event.schema";
import { task_model } from "./volunteer.schema";

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
  return await task_model.create({
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

const get_my_tasks = async (volunteerId: any) => {
  const tasks = await task_model
    .find({ assignedVolunteer: volunteerId })
    .populate("createdBy", "email activeRole name")
    .sort({ createdAt: -1 });
  return tasks;
};

const complete_task = async (taskId: any, volunteerId: string) => {
  const task = await task_model.findOne({
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

const get_today_progress = async (volunteerId: any) => {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const tasks = await task_model.find({
    assignedVolunteer: new Object(volunteerId),
    date: today,
  });

  console.log(volunteerId, today, tasks);
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.status === "COMPLETED",
  ).length;

  const remainingTasks = totalTasks - completedTasks;

  const progress =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return {
    totalTasks,
    completedTasks,
    remainingTasks,
    progress,
  };
};
export const task_service = {
  create_task_and_assign,
  get_my_tasks,
  complete_task,
  get_today_progress,
};
