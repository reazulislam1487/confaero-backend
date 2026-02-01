import mongoose from "mongoose";
import httpStatus from "http-status";
import { Account_Model } from "../auth/auth.schema";
import { Organizer_Model } from "./superAdmin.schema";
import { Event_Model } from "./event.schema";
import { AppError } from "../../utils/app_error";
import { User_Model, UserProfile_Model } from "../user/user.schema";
import { isAccountExist } from "../../utils/isAccountExist";
import formatDateRange from "../../utils/formatDateRange";
import sendMail from "../../utils/mail_sender";

type TCreateOrganizerPayload = {
  email: string;
  organizationName: string;
};

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
  bannerImageUrl?: string;
  // floorMapImageUrl?: string[];
  // agenda?: string[];
};

const create_new_organizer_into_db = async (
  payload: TCreateOrganizerPayload,
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const account = await Account_Model.findOne(
      { email: payload.email },
      null,
      { session },
    );

    if (!account) {
      throw new AppError("Account not found", httpStatus.NOT_FOUND);
    }

    if (account.role?.includes("ORGANIZER")) {
      throw new AppError(
        "User is already an organizer",
        httpStatus.BAD_REQUEST,
      );
    }

    account.role!.push("ORGANIZER");
    account.activeRole = "ORGANIZER";
    await account.save({ session });

    await Organizer_Model.create(
      [
        {
          accountId: account._id,
          organizationName: payload.organizationName,
          verifiedBySuperAdmin: true,
        },
      ],
      { session },
    );

    await session.commitTransaction();

    return {
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

const create_event_by_super_admin_into_db = async (
  payload: TCreateEventPayload,
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const organizerAccountIds: mongoose.Types.ObjectId[] = [];
    const uniqueEmails = new Set<string>();

    for (const email of payload.organizerEmails) {
      if (uniqueEmails.has(email)) {
        throw new AppError(
          `Duplicate organizer email: ${email}`,
          httpStatus.BAD_REQUEST,
        );
      }
      uniqueEmails.add(email);

      const account = await Account_Model.findOne({ email }, null, {
        session,
      });

      if (!account) {
        throw new AppError(
          `Account not found for email: ${email}`,
          httpStatus.NOT_FOUND,
        );
      }

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
          { session },
        );
      }

      organizerAccountIds.push(account._id);
    }

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
          bannerImageUrl: payload.bannerImageUrl ?? "",
          // floorMapImageUrl: payload.floorMapImageUrl ?? [],
          // agenda: payload.agenda ?? [],
        },
      ],
      { session },
    );

    const dashboardUrl =
      process.env.FRONTEND_DASHBOARD_URL || "http://localhost:3000/dashboard";
    const emailTemplate = `
  <p>Your event has been successfully created.</p>

  <p>
    You can now log in to the platform using your <strong>existing email and password</strong>
    by visiting the link below:
  </p>

  <p>
    <a href="${dashboardUrl}" target="_blank">
      Go to Dashboard
    </a>
  </p>

  <p>
    From the dashboard, you will be able to manage your event details, agenda, and other settings.
  </p>

  <p>
    If you face any issues while logging in, please contact our support team.
  </p>

  <br/>

  <p>Thank you for being part of our platform.</p>
`;
    await sendMail({
      to: payload.organizerEmails[0],
      subject: "Your Event have been created",
      textBody: "Your event have been successfully created.",
      htmlBody: emailTemplate,
    });

    await session.commitTransaction();
    return event[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const get_all_organizers_from_db = async (limit?: number) => {
  const query = Organizer_Model.find()
    .populate({ path: "accountId", select: "email role activeRole" })
    .sort({ createdAt: -1 });

  if (limit) {
    query.limit(limit);
  }

  return query.lean();
};
const get_specific_organizer_from_db = async (organizerId: any) => {
  const organizer = await Organizer_Model.findById(organizerId)
    .populate({ path: "accountId", select: "email role activeRole" })
    .lean();

  if (!organizer) {
    throw new AppError("Organizer not found", httpStatus.NOT_FOUND);
  }

  return organizer;
};

const get_all_events_of_organizer_from_db = async (organizerId: any) => {
  const organizer = await Organizer_Model.findById(organizerId).lean();

  if (!organizer) {
    throw new AppError("Organizer not found", httpStatus.NOT_FOUND);
  }

  return Event_Model.find({
    organizers: organizer.accountId,
  })
    .select(
      "title location startDate endDate website expectedAttendee boothSlot",
    )
    .sort({ startDate: -1 })
    .lean();
};

const get_specific_event_of_organizer_from_db = async (
  organizerId: any,
  eventId: any,
) => {
  const organizer = await Organizer_Model.findById(organizerId).lean();

  if (!organizer) {
    throw new AppError("Organizer not found", httpStatus.NOT_FOUND);
  }

  const event = await Event_Model.findOne({
    _id: eventId,
    organizers: organizer.accountId,
  })
    .select(
      "title location startDate endDate website googleMapLink expectedAttendee boothSlot details",
    )
    .lean();

  if (!event) {
    throw new AppError(
      "Event not found or access denied",
      httpStatus.NOT_FOUND,
    );
  }

  return event;
};

const get_all_events_from_db = async (limit?: number) => {
  const query = Event_Model.find()
    .sort({ createdAt: -1 })
    .select(
      "title location startDate endDate website expectedAttendee boothSlot",
    );

  if (limit) {
    query.limit(limit);
  }

  return query.lean();
};

//
const get_event_details_from_db = async (eventId: any) => {
  const event = await Event_Model.findById(eventId).lean();

  if (!event) {
    throw new AppError("Event not found", httpStatus.NOT_FOUND);
  }

  return event;
};

type TGetAllUsersParams = {
  limit?: number;
  page?: number;
  search?: string;
};

const get_all_users_from_db = async ({
  limit,
  page,
  search,
}: TGetAllUsersParams) => {
  const accounts = await Account_Model.find()
    .select("_id email activeRole createdAt")
    .sort({ createdAt: -1 })
    .lean();

  const accountIds = accounts.map((acc) => acc._id);

  const profiles = await User_Model.find({
    accountId: { $in: accountIds },
  })
    .select("accountId name phone")
    .lean();

  const profileMap = new Map(
    profiles.map((profile) => [profile.accountId!.toString(), profile]),
  );

  return accounts.map((account) => ({
    ...account,
    profile: profileMap.get(account._id.toString()) || null,
  }));
};

const get_user_details_from_db = async (userId: any) => {
  const account = await Account_Model.findById(userId)
    .select("email role activeRole createdAt")
    .lean();

  if (!account) {
    throw new AppError("User not found", httpStatus.NOT_FOUND);
  }

  const profile = await UserProfile_Model.findOne({
    accountId: account._id,
  })
    .select("-__v")
    .lean();

  return {
    account,
    profile,
  };
};

const suspend_user_from_db = async (email: any) => {
  const account = await isAccountExist(email);

  if (!account) {
    throw new AppError("Account not found", httpStatus.NOT_FOUND);
  }
  const deleteUser = await Account_Model.findOneAndDelete({ email });

  return deleteUser;
};

const get_event_overview_from_db = async (eventId: any) => {
  const event = await Event_Model.findById(eventId)
    .select("title location startDate endDate expectedAttendee")
    .lean();

  if (!event) {
    throw new AppError("Event not found", httpStatus.NOT_FOUND);
  }

  return {
    eventInfo: {
      title: event.title,
      location: event.location,
      dateRange: {
        start: event.startDate,
        end: event.endDate,
      },
    },

    stats: {
      totalRegistrations: event.expectedAttendee || 0,
      checkedInAttendees: 0,
      exhibitors: 0,
      pendingRequests: 0,
    },

    registrationTrend: [
      { date: "2026-06-01", count: 120 },
      { date: "2026-06-02", count: 240 },
      { date: "2026-06-03", count: 180 },
    ],

    recentRegistrations: [],

    topPartners: [],
  };
};

// extra
type THeaderEvent = {
  id: string;
  title: string;
  location: string;
  dateRange: string | null;
};

type TLeanEvent = {
  _id: string;
  title: string;
  location: string;
  startDate?: Date;
  endDate?: Date;
};

// get header events
const get_header_events_from_db = async (): Promise<THeaderEvent[]> => {
  const now = new Date();

  const events = await Event_Model.find({
    $or: [
      {
        startDate: { $lte: now },
        endDate: { $gte: now },
      },
      {
        startDate: { $gt: now },
      },
    ],
  })
    .sort({ startDate: 1 })
    .limit(3)
    .select("title location startDate endDate")
    .lean<TLeanEvent[]>();

  return events.map((event) => ({
    id: event._id,
    title: event.title,
    location: event.location,
    dateRange: formatDateRange(event.startDate, event.endDate),
  }));
};

const get_dashboard_overview_from_db = async () => {
  const now = new Date();

  const [
    headerEvents,
    totalEvents,
    ongoingEvents,
    totalOrganizers,
    totalParticipants,
    recentEvents,
    latestOrganizers,
  ] = await Promise.all([
    get_header_events_from_db(),
    Event_Model.countDocuments(),
    Event_Model.countDocuments({
      startDate: { $lte: now },
      endDate: { $gte: now },
    }),
    Organizer_Model.countDocuments(),
    Account_Model.countDocuments({
      role: { $nin: ["SUPER_ADMIN", "ORGANIZER"] },
    }),
    Event_Model.find()
      .select("title location startDate endDate")
      .sort({ createdAt: -1 })
      .limit(3)
      .lean(),
    Organizer_Model.find()
      .populate({
        path: "accountId",
        select: "email",
      })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean(),
  ]);

  return {
    headerEvents,

    stats: {
      totalEvents,
      ongoingEvents,
      totalOrganizers,
      totalParticipants,
    },

    recentEvents: recentEvents.map((e: any) => ({
      id: e._id.toString(),
      title: e.title,
      location: e.location,
      dateRange: formatDateRange(e.startDate, e.endDate),
    })),

    latestOrganizers: latestOrganizers.map((o: any) => ({
      id: o._id.toString(),
      email:
        typeof o.accountId === "object" &&
        o.accountId !== null &&
        "email" in o.accountId
          ? o.accountId.email
          : null,
    })),
  };
};

const get_single_event_details_from_db = async (eventId: any) => {
  const event = await Event_Model.findById(eventId).lean();

  if (!event) {
    throw new AppError("Event not found", httpStatus.NOT_FOUND);
  }

  return event;
};
export const super_admin_service = {
  create_new_organizer_into_db,
  create_event_by_super_admin_into_db,
  get_all_organizers_from_db,
  get_specific_organizer_from_db,
  get_all_events_of_organizer_from_db,
  get_specific_event_of_organizer_from_db,
  get_all_events_from_db,
  get_user_details_from_db,
  get_all_users_from_db,
  suspend_user_from_db,
  get_event_overview_from_db,
  get_dashboard_overview_from_db,
  get_event_details_from_db,
  get_single_event_details_from_db,
};
