import { Schema, model } from "mongoose";
import { T_Chair } from "./chair.interface";

const chair_schema = new Schema<T_Chair>({});

export const chair_model = model("chair", chair_schema);
