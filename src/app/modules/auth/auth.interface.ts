export type TAccount = {
  email: string;
  password: string;
  lastPasswordChange?: Date;
  isDeleted?: boolean;
  accountStatus?: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  role?:
    | "ORGANIZER"
    | "ATTENDEE"
    | "SPEAKER"
    | "EXHIBITOR"
    | "STAFF"
    | "SPONSOR"
    | "VOLUNTEER"
    | "ABSTRACT_REVIEWER"
    | "TRACK_CHAIR";
  activeRole?: string;
  refreshToken?: string;
  isVerified?: boolean;
};

export interface TRegisterPayload extends TAccount {
  name: string;
}

export type TLoginPayload = {
  email: string;
  password: string;
};

export type TJwtUser = {
  email: string;
  activeRole?:
    | "ORGANIZER"
    | "ATTENDEE"
    | "SPEAKER"
    | "EXHIBITOR"
    | "STAFF"
    | "SPONSOR"
    | "VOLUNTEER"
    | "ABSTRACT_REVIEWER"
    | "TRACK_CHAIR";
};

export type TChangePasswordPayload = {
  email: string;
  oldPassword: string;
  newPassword: string;
  currentPassword: string;
};
