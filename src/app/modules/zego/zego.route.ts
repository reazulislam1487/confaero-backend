import { Router } from "express";
import { zego_controller } from "./zego.controller";
import auth from "../../middlewares/auth";

const zego_router = Router();

zego_router.get(
  "/token",
  auth("SPEAKER", "ATTENDEE"), // token + eventId header validated here
  zego_controller.get_zego_token,
);

export default zego_router;
