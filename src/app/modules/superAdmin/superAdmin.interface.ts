import { Types } from "mongoose";

export type TOrganizer = {
  accountId: Types.ObjectId;
  organizationName: string;
  verifiedBySuperAdmin?: boolean;
};
export interface T_SuperAdmin {}