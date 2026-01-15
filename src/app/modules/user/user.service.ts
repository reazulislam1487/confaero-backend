import { Request } from "express";
import uploadCloud from "../../utils/cloudinary";
import { UserProfile_Model } from "./user.schema";
import { Account_Model } from "../auth/auth.schema";

const update_profile_into_db = async (req: Request) => {
  const account = await Account_Model.findOne({
    email: req.user!.email,
  }).lean();

  if (!account) {
    throw new Error("Account not found");
  }

  if (req.file) {
    const uploaded = await uploadCloud(req.file);
    req.body.avatar = uploaded!.secure_url;
  }

  return UserProfile_Model.findOneAndUpdate(
    { accountId: account._id },
    { $set: req.body },
    { new: true, upsert: true }
  );
};

export const user_services = {
  update_profile_into_db,
};
