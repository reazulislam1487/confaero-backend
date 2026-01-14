import { Schema, model } from "mongoose";
import { T_Profile } from "./profile.interface";

const profile_schema = new Schema<T_Profile>({});

export const profile_model = model("profile", profile_schema);
