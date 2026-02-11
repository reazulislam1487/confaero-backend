import { Schema, model } from "mongoose";
import { T_Photo } from "./photo.interface";

const photo_schema = new Schema<T_Photo>({});

export const photo_model = model("photo", photo_schema);
