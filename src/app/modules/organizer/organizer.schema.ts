import { Schema, model } from "mongoose";
import { T_Organizer } from "./organizer.interface";

const organizer_schema = new Schema<T_Organizer>({});

export const organizer_model = model("organizer", organizer_schema);
