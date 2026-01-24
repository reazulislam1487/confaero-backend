import { Request } from "express";
import { uploadToS3 } from "../../utils/s3";
import { UserProfile_Model } from "./user.schema";
import { Account_Model } from "../auth/auth.schema";
import { Types } from "mongoose";

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

const get_or_from_db = async (req: Request) => {
  // 🔐 account (email only)
  const account = await Account_Model.findById(req.user!.id, {
    email: 1,
  }).lean();

  if (!account) {
    throw new Error("Account not found");
  }

  // 🔑 always use ObjectId
  const accountObjectId = new Types.ObjectId(account._id);

  // ✅ correct projection (schema-accurate)
  const profile = await UserProfile_Model.findOne(
    { accountId: accountObjectId },
    {
      name: 1,
      avatar: 1,
      "contact.phone": 1,
    },
  ).lean();

  return {
    name: profile?.name || null,
    phone: profile?.contact?.phone || null,
    email: account.email,
    avatar: profile?.avatar || null,
  };
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

const update_organizer_profile_into_db = async (req: Request) => {
  const account = await Account_Model.findById(req.user!.id);

  if (!account) {
    throw new Error("Account not found");
  }

  // avatar upload
  let avatarUrl: string | undefined;
  if (req.file) {
    avatarUrl = await uploadToS3(req.file, "avatars");
  }

  const accountObjectId = new Types.ObjectId(account._id);

  const profile = await UserProfile_Model.findOneAndUpdate(
    { accountId: accountObjectId },
    {
      $set: {
        ...(req.body.name && { name: req.body.name }),
        ...(req.body.phone && { "contact.phone": req.body.phone }),
        ...(avatarUrl && { avatar: avatarUrl }),
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  ).lean();

  return {
    name: profile?.name || null,
    phone: profile?.contact?.phone || null,
    avatar: profile?.avatar || null,
  };
};

export const user_services = {
  update_profile_into_db,
  delete_resume_from_db,
  get_my_profile_from_db,
  get_or_from_db,
  update_organizer_profile_into_db,
};
