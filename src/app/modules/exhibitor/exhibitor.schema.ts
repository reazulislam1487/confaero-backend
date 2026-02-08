import { Schema, model } from "mongoose";
import { T_Exhibitor } from "./exhibitor.interface";

const exhibitor_schema = new Schema<T_Exhibitor>({});

export const exhibitor_model = model("exhibitor", exhibitor_schema);
