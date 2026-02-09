import { Schema, model } from "mongoose";
import { T_Sponsor } from "./sponsor.interface";

const sponsor_schema = new Schema<T_Sponsor>({});

export const sponsor_model = model("sponsor", sponsor_schema);
