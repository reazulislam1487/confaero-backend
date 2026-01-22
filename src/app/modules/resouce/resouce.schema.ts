import { Schema, model } from "mongoose";
import { T_Resouce } from "./resouce.interface";

const resouce_schema = new Schema<T_Resouce>({});

export const resouce_model = model("resouce", resouce_schema);
