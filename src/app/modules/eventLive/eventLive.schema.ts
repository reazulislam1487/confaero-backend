import { Schema, model } from "mongoose";
import { T_EventLive } from "./eventLive.interface";

const event_live_schema = new Schema<T_EventLive>({});

export const event_live_model = model("event_live", event_live_schema);
