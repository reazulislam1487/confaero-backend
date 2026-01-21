import { Request } from "express";
import { uploadToS3 } from "../../utils/s3";
import { UserProfile_Model } from "./user.schema";
import { Account_Model } from "../auth/auth.schema";

const update_profile_into_db = async (req: Request) => {
  const account = await Account_Model.findOne({
    email: req.user!.email,
  }).lean();

  if (!account) {
    throw new Error("Account not found");
  }

  const files = req.files as {
    image?: Express.Multer.File[];
    resume?: Express.Multer.File[];
  };

  if (files?.image?.[0]) {
    const avatarUrl = await uploadToS3(files.image[0], "avatars");
    req.body.avatar = avatarUrl;
  }

  const existingProfile = await UserProfile_Model.findOne({
    accountId: account._id,
  }).lean();

  if (!existingProfile?.resume && files?.resume?.[0]) {
    const resumeUrl = await uploadToS3(files.resume[0], "resumes");
    req.body.resume = {
      url: resumeUrl,
      updatedAt: new Date(),
    };
  }
  return UserProfile_Model.findOneAndUpdate(
    { accountId: account._id },
    { $set: req.body },
    { new: true, upsert: true },
  );
};

const delete_resume_from_db = async (req: Request) => {
  const account = await Account_Model.findOne({
    email: req.user!.email,
  }).lean();

  if (!account) {
    throw new Error("Account not found");
  }

  return UserProfile_Model.findOneAndUpdate(
    { accountId: account._id },
    {
      $unset: { resume: "" },
    },
    { new: true },
  );
};

const get_my_profile_from_db = async (req: Request) => {
  const account = await Account_Model.findOne({
    email: req.user!.email,
  }).lean();

  if (!account) {
    throw new Error("Account not found");
  }

  return UserProfile_Model.findOne({
    accountId: account._id,
  });
};
export const user_services = {
  update_profile_into_db,
  delete_resume_from_db,
  get_my_profile_from_db,
};
