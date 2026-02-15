import { job_model } from "./job.schema";

const create_new_job_into_db = async (
  payload: Record<string, any>,
  user: any,
) => {
  const isAutoApproved = ["ORGANIZER", "SUPER_ADMIN"].includes(user.activeRole);

  return job_model.create({
    ...payload,
    status: isAutoApproved ? "APPROVED" : "PENDING",
    postedBy: user.id,
    posterRole: user.activeRole,
  });
};
const get_my_jobs = async (user: any, query: any) => {
  const { page = 1, limit = 10, search, status } = query;

  const filter: any = { postedBy: user.id };

  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    job_model.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    job_model.countDocuments(filter),
  ]);

  return { data, meta: { page, limit, total } };
};

const get_review_jobs = async (query: any) => {
  const { page = 1, limit = 10, search, status } = query;

  const filter: any = {};

  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    job_model.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    job_model.countDocuments(filter),
  ]);

  return { data, meta: { page, limit, total } };
};

const get_public_jobs = async (search?: string) => {
  const filter: any = { status: "APPROVED" };

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
    ];
  }

  return job_model.find(filter).sort({ createdAt: -1 });
};

const get_job_details = async (jobId: string, user?: any) => {
  const job = await job_model.findById(jobId);
  if (!job) throw new Error("Job not found");

  if (!user || user.role === "APP_USER") {
    if (job.status !== "APPROVED") {
      throw new Error("Access denied");
    }
  }

  return job;
};

const update_job_status = async (jobId: string, status: string) => {
  return job_model.findOneAndUpdate(
    { _id: jobId, status: "PENDING" },
    { status },
    { new: true },
  );
};

const update_job = async (jobId: string, user: any, payload: any) => {
  return job_model.findOneAndUpdate(
    { _id: jobId, postedBy: user.id },
    payload,
    { new: true },
  );
};

const delete_job = async (jobId: string, user: any) => {
  return job_model.findOneAndDelete({
    _id: jobId,
    postedBy: user.id,
  });
};

export const job_service = {
  create_new_job_into_db,
  get_my_jobs,
  get_review_jobs,
  get_public_jobs,
  get_job_details,
  update_job_status,
  update_job,
  delete_job,
};
