import { NextFunction, Request, Response, Router } from "express";
import { user_controllers } from "./user.controller";
import auth from "../../middlewares/auth";
import { user_validations } from "./user.validation";
import { upload } from "../../middlewares/upload";

const { update_organizer_profile } = user_validations;

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

userRoute.patch(
  "/update-profile/organizer",
  auth("ORGANIZER", "SUPER_ADMIN"),
  upload.single("image"),
  (req: Request, res: Response, next: NextFunction) => {
    let body = req.body;
    if (req.body.data) {
      body = JSON.parse(req.body.data);
    }

    req.body = user_validations.update_organizer_profile.parse(body);
    next();
  },
  user_controllers.update_organizer_profile,
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
userRoute.get(
  "/my-profile/organizer",
  auth("ORGANIZER", "SUPER_ADMIN"),
  user_controllers.get_or_profile,
);

export default userRoute;
