import { Schema, model } from "mongoose";
import { T_Poster } from "./poster.interface";

const poster_schema = new Schema<T_Poster>({});

export const poster_model = model("poster", poster_schema);
