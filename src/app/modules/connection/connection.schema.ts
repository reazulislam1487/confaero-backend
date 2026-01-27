import { Schema, model } from "mongoose";
import { T_Connection } from "./connection.interface";

const connection_schema = new Schema<T_Connection>({});

export const connection_model = model("connection", connection_schema);
