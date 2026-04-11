import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/app_error";
import { configs } from "../configs";
import { jwtHelpers, JwtPayloadType } from "../utils/JWT";
import { Account_Model } from "../modules/auth/auth.schema";

type Role =
  | "SUPER_ADMIN"
  | "ORGANIZER"
  | "ATTENDEE"
  | "SPEAKER"
  | "EXHIBITOR"
  | "STAFF"
  | "SPONSOR"
  | "VOLUNTEER"
  | "ABSTRACT_REVIEWER"
  | "TRACK_CHAIR";

const auth = (...roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError("Unauthorized", 401);
      }

      // 🔑 Extract token
      const token = authHeader.split(" ")[1];

      let verifiedUser;
      try {
        verifiedUser = jwtHelpers.verifyToken(
          token,
          configs.jwt.access_token as string,
        );
      } catch (error) {
        throw new AppError("Token expired or invalid", 401);
      }

      // Check user exists and account status
      const isUserExist = await Account_Model.findOne({
        email: verifiedUser?.email,
      }).lean();
      
      if (!isUserExist) {
        throw new AppError("Account not found", 404);
      }
      
      if (isUserExist?.accountStatus == "SUSPENDED") {
        throw new AppError("This account is suspended", 401);
      }
      
      if (isUserExist?.accountStatus == "INACTIVE") {
        throw new AppError("This account is inactive", 401);
      }
      
      if (isUserExist?.isDeleted) {
        throw new AppError("This account is deleted", 401);
      }

      // Check role authorization
      if (!roles.length || !roles.includes(verifiedUser.activeRole)) {
        throw new AppError("You are not authorized", 401);
      }

      req.user = verifiedUser as JwtPayloadType;
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
