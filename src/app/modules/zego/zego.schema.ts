import { Schema, model } from "mongoose";
import { T_Zego } from "./zego.interface";

const zego_schema = new Schema<T_Zego>({});

export const zego_model = model("zego", zego_schema);
