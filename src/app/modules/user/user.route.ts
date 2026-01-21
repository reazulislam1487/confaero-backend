import { NextFunction, Request, Response, Router } from "express";
import { user_controllers } from "./user.controller";
import auth from "../../middlewares/auth";
import { user_validations } from "./user.validation";
import { upload } from "../../middlewares/upload";

const userRoute = Router();

userRoute.patch(
  "/update-profile",
  auth(
    "ORGANIZER",
    "ATTENDEE",
    "SPEAKER",
    "EXHIBITOR",
    "STAFF",
    "SPONSOR",
    "VOLUNTEER",
    "ABSTRACT_REVIEWER",
    "TRACK_CHAIR",
  ),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = user_validations.update_user.parse(JSON.parse(req.body.data));
    user_controllers.update_profile(req, res, next);
  },
);

userRoute.delete(
  "/delete-resume",
  auth(
    "ORGANIZER",
    "ATTENDEE",
    "SPEAKER",
    "EXHIBITOR",
    "STAFF",
    "SPONSOR",
    "VOLUNTEER",
    "ABSTRACT_REVIEWER",
    "TRACK_CHAIR",
  ),
  user_controllers.delete_resume,
);
userRoute.get(
  "/my-profile",
  auth(
    "ORGANIZER",
    "ATTENDEE",
    "SPEAKER",
    "EXHIBITOR",
    "STAFF",
    "SPONSOR",
    "VOLUNTEER",
    "ABSTRACT_REVIEWER",
    "TRACK_CHAIR",
  ),
  user_controllers.get_my_profile,
);
export default userRoute;
