import { Schema, model } from "mongoose";
import { T_Reviewer } from "./reviewer.interface";

const reviewer_schema = new Schema<T_Reviewer>({});

export const reviewer_model = model("reviewer", reviewer_schema);
