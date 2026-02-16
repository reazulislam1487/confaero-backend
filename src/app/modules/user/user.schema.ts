import { model, Schema } from "mongoose";
import { TUserProfile } from "./user.interface";

// const user_schema = new Schema<TUser>(
//   {
//     name: { type: String, required: true },
//     photo: { type: String, required: false },
//     accountId: { type: String, required: false, ref: "account" },
//     address: {
//       location: { type: String },
//       city: { type: String },
//       state: { type: String },
//       postCode: { type: String },
//       country: { type: String },
//       timeZone: { type: String },
//     },
//   },
//   {
//     versionKey: false,
//     timestamps: true,
//   },
// );

// export const User_Model = model("user", user_schema);

const userProfileSchema = new Schema({
  accountId: {
    type: Schema.Types.ObjectId,
    ref: "account",
    required: true,
    unique: true,
  },

  name: String,
  avatar: String,

  affiliations: [
    {
      company: String,
      position: String,
      from: String,
      to: String,
      isCurrent: Boolean,
    },
  ],

  education: [
    {
      institute: String,
      degree: String,
      major: String,
      from: String,
      to: String,
      isCurrent: Boolean,
    },
  ],

  location: {
    address: String,
    isCurrent: Boolean,
  },

  contact: {
    phone: String,
    mobile: String,
    email: String,
  },

  resume: {
    url: String,
    updatedAt: Date,
  },

  about: String,

  socialLinks: [
    {
      platform: String,
      url: String,
    },
  ],

  personalWebsites: [String],
  lastSeen: {
    type: Date,
    default: null,
  },
});
export const UserProfile_Model = model<TUserProfile>(
  "user_profile",
  userProfileSchema,
);
