import { Schema, model } from "mongoose";
import { T_Volunteer } from "./volunteer.interface";

const volunteer_schema = new Schema<T_Volunteer>({});

export const volunteer_model = model("volunteer", volunteer_schema);
