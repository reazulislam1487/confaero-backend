import { AppError } from "../../utils/app_error";
import {
  TAccount,
  TChangePasswordPayload,
  TLoginPayload,
  TRegisterPayload,
} from "./auth.interface";
import { Account_Model } from "./auth.schema";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import { TUser } from "../user/user.interface";
import { User_Model, UserProfile_Model } from "../user/user.schema";
import mongoose from "mongoose";
import { jwtHelpers, JwtPayloadType } from "../../utils/JWT";
import { configs } from "../../configs";
import { JwtPayload, Secret } from "jsonwebtoken";
import sendMail from "../../utils/mail_sender";
import { isAccountExist } from "../../utils/isAccountExist";
// register user
const register_user_into_db = async (payload: TRegisterPayload) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 1. validation (later section)
    if (
      !payload?.email ||
      !payload?.password ||
      !payload?.confirmPassword ||
      !payload?.name
    ) {
      throw new AppError("All fields are required", httpStatus.BAD_REQUEST);
    }

    // 2. check existing account
    const isExistAccount = await Account_Model.findOne(
      { email: payload.email },
      null,
      { session },
    );

    if (isExistAccount) {
      throw new AppError("Account already exist!!", httpStatus.BAD_REQUEST);
    }

    if (payload.password !== payload.confirmPassword) {
      throw new AppError(
        "New password and confirm password do not match",
        httpStatus.BAD_REQUEST,
      );
    }

    // 3. hash password
    const hashPassword = await bcrypt.hash(payload.password, 10);

    // 4. create account
    const accountPayload: TAccount = {
      email: payload.email,
      password: hashPassword,
      lastPasswordChange: new Date(),
    };

    const newAccount = await Account_Model.create([accountPayload], {
      session,
    });

    // 5. create user
    const userPayload: TUser = {
      name: payload.name,
      accountId: newAccount[0]._id,
    };

    await User_Model.create([userPayload], { session });

    // 2️ User profile create
    await UserProfile_Model.create({
      accountId: newAccount[0]._id,
      name: payload.name,
    });

    // 6. COMMIT (VERY IMPORTANT)
    await session.commitTransaction();
    const userObj = newAccount[0].toObject();
    userObj.password = "";

    return userObj;
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    throw error;
  } finally {
    session.endSession();
  }
};

// login user
const login_user_from_db = async (payload: TLoginPayload) => {
  // check account info
  const isExistAccount = await isAccountExist(payload?.email);

  const isPasswordMatch = await bcrypt.compare(
    payload.password,
    isExistAccount.password,
  );
  if (!isPasswordMatch) {
    throw new AppError("Invalid password", httpStatus.UNAUTHORIZED);
  }
  const accessToken = jwtHelpers.generateToken(
    {
      email: isExistAccount.email,
      activeRole: isExistAccount.activeRole,
    },
    configs.jwt.access_token as Secret,
    configs.jwt.access_expires as string,
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      email: isExistAccount.email,
      activeRole: isExistAccount.activeRole,
    },
    configs.jwt.refresh_token as Secret,
    configs.jwt.refresh_expires as string,
  );
  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
    activeRole: isExistAccount.activeRole,
  };
};

const get_my_profile_from_db = async (email: string) => {
  const isExistAccount = await isAccountExist(email);
  const accountProfile = await User_Model.findOne({
    accountId: isExistAccount._id,
  });
  isExistAccount.password = "";
  return {
    account: isExistAccount,
    profile: accountProfile,
  };
};

const refresh_token_from_db = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(
      token,
      configs.jwt.refresh_token as Secret,
    );
  } catch (err) {
    throw new Error("You are not authorized!");
  }

  const userData = await Account_Model.findOne({
    email: decodedData.email,
    status: "ACTIVE",
    isDeleted: false,
  });

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData!.email,
      role: userData!.role,
    },
    configs.jwt.access_token as Secret,
    configs.jwt.access_expires as string,
  );

  return accessToken;
};

const change_password_from_db = async (
  user: JwtPayloadType,
  payload: {
    email: string;
    oldPassword: string;
    newPassword: string;
    currentPassword: string;
  },
) => {
  const isExistAccount = await isAccountExist(user?.email);

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    isExistAccount.password,
  );

  if (!isCorrectPassword) {
    throw new AppError("Old password is incorrect", httpStatus.UNAUTHORIZED);
  }
  if (isCorrectPassword && payload.oldPassword === payload.newPassword) {
    throw new AppError(
      "Old password and new password can not be same",
      httpStatus.BAD_REQUEST,
    );
  }
  if (payload.newPassword !== payload.currentPassword) {
    throw new AppError(
      "New password and confirm password do not match",
      httpStatus.BAD_REQUEST,
    );
  }

  const hashedPassword: string = await bcrypt.hash(payload.newPassword, 10);
  await Account_Model.findOneAndUpdate(
    { email: isExistAccount.email },
    {
      password: hashedPassword,
      lastPasswordChange: Date(),
    },
  );
  return "Password changed successful.";
};

const forget_password_from_db = async (email: string) => {
  const isAccountExists = await isAccountExist(email);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await Account_Model.findByIdAndUpdate(isAccountExists._id, {
    resetPasswordCode: otp,
    resetPasswordExpire: new Date(Date.now() + 10 * 60 * 1000), // 10 min
  });

  const resetToken = jwtHelpers.generateToken(
    {
      email: isAccountExists.email,
      activeRole: isAccountExists.activeRole,
    },
    configs.jwt.reset_secret as Secret,
    configs.jwt.reset_expires as string,
  );

  const resetPasswordLink = `${configs.jwt.front_end_url}/reset?token=${resetToken}&email=${isAccountExists.email}`;
  const emailTemplate = `<p>Click the link below to reset your password:</p><a href="${resetPasswordLink}">Reset Password</a>
  <p>This link will expire in 10 minutes.</p>
  <p>If you did not request a password reset, please ignore this email.</p>
  <br/>
  <p>Alternatively, you can use the following OTP to reset your password:</p>
  <h3>${otp}</h3>
  <p>This OTP is valid for 10 minutes.</p>
  `;

  await sendMail({
    to: email,
    subject: "Password Reset Code!",
    textBody: "Your password is successfully reset.",
    htmlBody: emailTemplate,
  });

  return "Verification code sent to your email";
};
const verify_reset_code_from_db = async (email: string, code: string) => {
  const account = await Account_Model.findOne({ email });

  if (!account) throw new AppError("Account not found", httpStatus.NOT_FOUND);

  if (
    account.resetPasswordCode !== code ||
    !account.resetPasswordExpire ||
    account.resetPasswordExpire < new Date()
  ) {
    throw new AppError("Invalid or expired code", httpStatus.BAD_REQUEST);
  }

  const resetToken = jwtHelpers.generateToken(
    { email },
    configs.jwt.reset_secret as Secret,
    "10m",
  );

  return { resetToken };
};

const reset_password_into_db = async (
  token: string,
  email: string,
  newPassword: string,
  confirmPassword: string,
) => {
  let decodedData: JwtPayload;
  try {
    decodedData = jwtHelpers.verifyToken(
      token,
      configs.jwt.reset_secret as Secret,
    );
  } catch (err) {
    throw new AppError(
      "Your reset link is expire. Submit new link request!!",
      httpStatus.UNAUTHORIZED,
    );
  }

  if (newPassword !== confirmPassword) {
    throw new AppError(
      "New password and confirm password do not match",
      httpStatus.BAD_REQUEST,
    );
  }
  const isAccountExists = await isAccountExist(email);

  const hashedPassword: string = await bcrypt.hash(newPassword, 10);

  await Account_Model.findOneAndUpdate(
    { email: isAccountExists.email },
    {
      password: hashedPassword,
      lastPasswordChange: Date(),
    },
  );
  return "Password reset successfully!";
};

const verified_account_into_db = async (token: string) => {
  try {
    const { email } = jwtHelpers.verifyToken(
      token,
      configs.jwt.verified_token as string,
    );
    // check account is already verified or blocked
    const isExistAccount = await Account_Model.findOne({ email });
    // check account
    if (!isExistAccount) {
      throw new AppError("Account not found!!", httpStatus.NOT_FOUND);
    }
    if (isExistAccount.isDeleted) {
      throw new AppError("Account deleted !!", httpStatus.BAD_REQUEST);
    }
    const result = await Account_Model.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true },
    );

    return result;
  } catch (error) {
    throw new AppError("Invalid or Expired token!!!", httpStatus.BAD_REQUEST);
  }
};

const get_new_verification_link_from_db = async (email: string) => {
  const isExistAccount = await isAccountExist(email);

  const verifiedToken = jwtHelpers.generateToken(
    {
      email,
    },
    configs.jwt.verified_token as Secret,
    "5m",
  );
  const verificationLink = `${configs.jwt.front_end_url}/verified?token=${verifiedToken}`;
  await sendMail({
    to: email,
    subject: "New Verification link",
    textBody: `New Account verification link is successfully created on ${new Date().toLocaleDateString()}`,
    htmlBody: `
            <p>Thanks for creating an account with us. We’re excited to have you on board! Click the button below to
                verify your email and activate your account:</p>


            <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationLink}" target="_blank"
                    style="background-color: #4CAF50; color: #ffffff; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block; font-size: 18px;"
                    class="btn">
                    Verify My Email
                </a>
            </div>

            <p>If you did not create this account, please ignore this email.</p>
            `,
  });

  return null;
};

// DELETE ACCOUNT
const delete_account_from_db = async (
  user: JwtPayloadType,
  currentPassword: string,
) => {
  const account = await Account_Model.findOne({
    email: user.email,
  });
  if (!account) {
    throw new AppError("Account not found", httpStatus.NOT_FOUND);
  }

  const isPasswordMatch = await bcrypt.compare(
    currentPassword,
    account.password,
  );

  if (!isPasswordMatch) {
    throw new AppError(
      "Current password is incorrect",
      httpStatus.UNAUTHORIZED,
    );
  }

  await User_Model.findOneAndDelete({ accountId: account._id });
  await Account_Model.findByIdAndDelete(account._id);
  return null;
};
const change_role_from_db = async (user: JwtPayloadType, role: any) => {
  const account = await Account_Model.findOne({
    email: user.email,
  });

  if (!account) {
    throw new AppError("Account not found", httpStatus.NOT_FOUND);
  }

  // optional: prevent same role
  if (account.activeRole === role) {
    throw new AppError("Role already active", httpStatus.BAD_REQUEST);
  }

  account.activeRole = role;
  await account.save();

  // 🔥 generate new access token
  const accessToken = jwtHelpers.generateToken(
    {
      email: account.email,
      activeRole: role,
    },
    configs.jwt.access_token as Secret,
    configs.jwt.access_expires as string,
  );

  return { accessToken, activeRole: role };
};

export const auth_services = {
  register_user_into_db,
  login_user_from_db,
  get_my_profile_from_db,
  refresh_token_from_db,
  change_password_from_db,
  forget_password_from_db,
  reset_password_into_db,
  verified_account_into_db,
  get_new_verification_link_from_db,
  verify_reset_code_from_db,
  delete_account_from_db,
  change_role_from_db,
};
