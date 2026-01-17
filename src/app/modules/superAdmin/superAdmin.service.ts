import mongoose from "mongoose";
import httpStatus from "http-status";
import { Account_Model } from "../auth/auth.schema";
import { AppError } from "../../utils/app_error";
import { Organizer_Model } from "./superAdmin.schema";
import { Event_Model } from "./event.schema";

type TCreateOrganizerPayload = {
  email: string;
  organizationName: string;
};

const create_new_organizer_into_db = async (
  payload: TCreateOrganizerPayload
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { email, organizationName } = payload;

    //  Find account
    const account = await Account_Model.findOne({ email: email }, null, {
      session,
    });

    if (!account) {
      throw new AppError("Account not found", httpStatus.NOT_FOUND);
    }

    //  Check already organizer
    if (account.role!.includes("ORGANIZER")) {
      throw new AppError(
        "User is already an organizer",
        httpStatus.BAD_REQUEST
      );
    }

    //  Add organizer role
    account.role!.push("ORGANIZER");
    account.activeRole = "ORGANIZER";
    await account.save({ session });

    //  Create organizer partial profile
    await Organizer_Model.create(
      [
        {
          accountId: account._id,
          organizationName,
          verifiedBySuperAdmin: true,
        },
      ],
      { session }
    );

    // Commit transaction
    await session.commitTransaction();

    return {
      message: "Organizer created successfully",
      email: account.email,
      role: account.role,
      activeRole: account.activeRole,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// type TCreateEventPayload = {
//   title: string;
//   website?: string;
//   organizerEmails: string[];
//   location: string;
//   googleMapLink?: string;
//   startDate: string;
//   endDate: string;
//   expectedAttendee?: number;
//   boothSlot?: number;
//   details?: string;
// };

// const create_event_by_super_admin_into_db = async (
//   payload: TCreateEventPayload
// ) => {
//   const session = await mongoose.startSession();

//   try {
//     session.startTransaction();

//     const organizers: mongoose.Types.ObjectId[] = [];
//     const pendingOrganizerEmails: string[] = [];

//     //  resolve organizers
//     for (const email of payload.organizerEmails) {
//       const account = await Account_Model.findOne({ email }, null, {
//         session,
//       });

//       if (account && account.role?.includes("ORGANIZER")) {
//         organizers.push(account._id);
//       } else {
//         pendingOrganizerEmails.push(email);
//       }
//     }

//     //  create event
//     const event = await Event_Model.create(
//       [
//         {
//           title: payload.title,
//           website: payload.website,
//           location: payload.location,
//           googleMapLink: payload.googleMapLink,
//           startDate: new Date(payload.startDate),
//           endDate: new Date(payload.endDate),
//           expectedAttendee: payload.expectedAttendee,
//           boothSlot: payload.boothSlot,
//           details: payload.details,
//           organizers,
//           organizerEmails: payload.organizerEmails,
//         },
//       ],
//       { session }
//     );

//     await session.commitTransaction();

//     return event[0];
//   } catch (error) {
//     await session.abortTransaction();
//     throw error;
//   } finally {
//     session.endSession();
//   }
// };
type TCreateEventPayload = {
  title: string;
  organizerEmails: string[];
  location: string;
  startDate: string;
  endDate: string;
  website?: string;
  googleMapLink?: string;
  expectedAttendee?: number;
  boothSlot?: number;
  details?: string;
};

const create_event_by_super_admin_into_db = async (
  payload: TCreateEventPayload
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const organizerAccountIds: mongoose.Types.ObjectId[] = [];
    const uniqueEmails = new Set<string>();

    for (const email of payload.organizerEmails) {
      if (uniqueEmails.has(email)) {
        throw new AppError(
          `Duplicate organizer email found: ${email}`,
          httpStatus.BAD_REQUEST
        );
      }
      uniqueEmails.add(email);

      const account = await Account_Model.findOne({ email }, null, {
        session,
      });

      if (!account) {
        throw new AppError(
          `Account not found for email: ${email}`,
          httpStatus.NOT_FOUND
        );
      }

      //  If not organizer → make organizer
      if (!account.role?.includes("ORGANIZER")) {
        account.role!.push("ORGANIZER");
        account.activeRole = "ORGANIZER";
        await account.save({ session });

        await Organizer_Model.create(
          [
            {
              accountId: account._id,
              organizationName: payload.title,
              verifiedBySuperAdmin: true,
            },
          ],
          { session }
        );
      }

      organizerAccountIds.push(account._id);
    }

    //  Create Event (organizerEmails stored for audit/reference)
    const event = await Event_Model.create(
      [
        {
          title: payload.title,
          website: payload.website,
          location: payload.location,
          googleMapLink: payload.googleMapLink,
          startDate: new Date(payload.startDate),
          endDate: new Date(payload.endDate),
          expectedAttendee: payload.expectedAttendee,
          boothSlot: payload.boothSlot,
          details: payload.details,

          organizers: organizerAccountIds,
          organizerEmails: payload.organizerEmails,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    return event[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
export const super_admin_service = {
  create_new_organizer_into_db,
  create_event_by_super_admin_into_db,
};
