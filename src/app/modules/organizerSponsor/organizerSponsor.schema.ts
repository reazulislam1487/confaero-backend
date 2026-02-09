import { Schema, model } from "mongoose";
import { T_OrganizerSponsor } from "./organizerSponsor.interface";

const organizer_sponsor_schema = new Schema<T_OrganizerSponsor>({});

export const organizer_sponsor_model = model("organizer_sponsor", organizer_sponsor_schema);
