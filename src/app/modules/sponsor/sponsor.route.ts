import { Router } from "express";
import { sponsor_controller } from "./sponsor.controller";
import auth from "../../middlewares/auth";

const sponsor_router = Router();

sponsor_router.post(
  "/create",
  auth("SPONSOR"),
  sponsor_controller.create_new_sponsor,
);

sponsor_router.get(
  "/get-my-sponsor/:eventId",
  auth("SPONSOR"),
  sponsor_controller.get_my_sponsor,
);
sponsor_router.patch(
  "/update/:sponsorId",
  auth("SPONSOR"),
  sponsor_controller.update_my_sponsor,
);

export default sponsor_router;
