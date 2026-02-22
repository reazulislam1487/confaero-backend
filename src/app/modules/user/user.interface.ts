import { Types } from "mongoose";


export type TUserProfile = {
  accountId: Types.ObjectId;

  name: string;
  avatar?: string;

  affiliations?: {
    company?: string;
    position?: string;
    from: string;
    to: string;
    isCurrent: boolean;
  };
  resume?: {
    url: string;
    updatedAt: Date;
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
  lastSeen: {
    type: Date;
  };

  personalWebsites?: string[];
};
