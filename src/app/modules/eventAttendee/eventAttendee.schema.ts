import { Schema, model } from "mongoose";
import { T_EventAttendee } from "./eventAttendee.interface";

const event_attendee_schema = new Schema<T_EventAttendee>({});

export const event_attendee_model = model("event_attendee", event_attendee_schema);
