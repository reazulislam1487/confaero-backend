import { Types } from "mongoose";

export type TOrganizer = {
  accountId: Types.ObjectId;
  organizationName: string;
  verifiedBySuperAdmin?: boolean;
  stripeAccountId?: string | null;
  stripeConnected?: boolean;
};
export interface T_SuperAdmin {}
