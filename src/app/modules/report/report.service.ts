import { task_model } from "../volunteer/volunteer.schema";
import { task_report_model } from "./report.schema";

const report_issue = async (payload: any, volunteerId: string) => {
  const report = await task_report_model.create({
    ...payload,
    volunteerId,
  });

  await task_model.findByIdAndUpdate(payload.taskId, {
    status: "REPORTED",
  });

  return report;
};

export const report_service = { report_issue };
