import { Schema, model } from "mongoose";
import { T_Report } from "./report.interface";

const report_schema = new Schema<T_Report>({});

export const report_model = model("report", report_schema);
