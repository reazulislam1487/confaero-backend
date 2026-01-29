import { Schema, model } from "mongoose";
import { T_Upload } from "./upload.interface";

const upload_schema = new Schema<T_Upload>({});

export const upload_model = model("upload", upload_schema);
