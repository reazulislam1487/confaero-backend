import { Types } from "mongoose";

export type TOrganizer = {
  accountId: Types.ObjectId;
  organizationName: string;
  verifiedBySuperAdmin?: boolean;
  stripeAccountId?: string | null;
  stripeConnected?: boolean;
  stripeChargesEnabled?: boolean;
  stripePayoutsEnabled?: boolean;
};
export interface T_SuperAdmin {}
