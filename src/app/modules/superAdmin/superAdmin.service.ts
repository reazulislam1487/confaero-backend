import mongoose from "mongoose";
import httpStatus from "http-status";
import { Account_Model } from "../auth/auth.schema";
import { AppError } from "../../utils/app_error";
import { Organizer_Model } from "./superAdmin.schema";

type TCreateOrganizerPayload = {
  email: string;
  organizationName: string;
};

const create_new_organizer_into_db = async (
  payload: TCreateOrganizerPayload
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { email, organizationName } = payload;

    //  Find account
    const account = await Account_Model.findOne({ email: email }, null, {
      session,
    });

    if (!account) {
      throw new AppError("Account not found", httpStatus.NOT_FOUND);
    }

    //  Check already organizer
    if (account.role!.includes("ORGANIZER")) {
      throw new AppError(
        "User is already an organizer",
        httpStatus.BAD_REQUEST
      );
    }

    //  Add organizer role
    account.role!.push("ORGANIZER");
    account.activeRole = "ORGANIZER";
    await account.save({ session });

    //  Create organizer partial profile
    await Organizer_Model.create(
      [
        {
          accountId: account._id,
          organizationName,
          verifiedBySuperAdmin: true,
        },
      ],
      { session }
    );

    // Commit transaction
    await session.commitTransaction();

    return {
      message: "Organizer created successfully",
      email: account.email,
      role: account.role,
      activeRole: account.activeRole,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const super_admin_service = {
  create_new_organizer_into_db,
};
