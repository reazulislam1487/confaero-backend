import { Schema, model } from "mongoose";
import { T_OrganizerBooth } from "./organizerBooth.interface";

const organizer_booth_schema = new Schema<T_OrganizerBooth>({});

export const organizer_booth_model = model("organizer_booth", organizer_booth_schema);
