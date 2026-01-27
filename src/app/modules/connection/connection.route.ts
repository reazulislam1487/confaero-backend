import { Router } from "express";
import RequestValidator from "../../middlewares/request_validator";
import { connection_controller } from "./connection.controller";
import { connection_validations } from "./connection.validation";

const connection_router = Router();

connection_router.post(
  "/create",
  RequestValidator(connection_validations.create),
  connection_controller.create_new_connection
);

export default connection_router;
