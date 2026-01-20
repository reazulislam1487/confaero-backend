import { Types } from "mongoose";

export type TUser = {
  name: string;
  photo?: string;
  address?: {
    location?: string;
    city?: string;
    state?: string;
    postCode?: string;
    country?: string;
    timeZone?: string;
  };
  accountId?: Types.ObjectId;
  role?: string[];
  activeRole?: string;
};

export type TUserProfile = {
  accountId: Types.ObjectId;

  name: string;
  avatar?: string;

  affiliation?: {
    company?: string;
    role?: string;
  };

  education?: {
    institute?: string;
    degree?: string;
    field?: string;
    startYear?: number;
    endYear?: number;
  }[];

  location?: {
    country?: string;
    city?: string;
  };

  contact?: {
    phone?: string;
    email?: string;
  };

  about?: string;

  socialLinks?: {
    platform: string;
    url: string;
  }[];

  personalWebsites?: string[];
};
