import { UserProfile_Model } from "../user/user.schema";
import { Attendance } from "./qr.schema";

export const get_volunteer_checkin_history_service = async ({
  eventId,
  volunteerId,
}: {
  eventId: any;
  volunteerId: any;
}) => {
  // total count
  const totalCheckedIn = await Attendance.countDocuments({
    eventId,
    checkedInBy: volunteerId,
  });

  // last scans (latest first)
  const attendances = await Attendance.find({
    eventId,
    checkedInBy: volunteerId,
  })
    .sort({ checkedInAt: -1 })
    .limit(20)
    .populate("attendeeId", "email activeRole");
  const userProfile = await UserProfile_Model.find({
    accountId: attendances[0]?.attendeeId,
  });

  const lastScans = attendances.map((item: any) => ({
    attendeeId: item.attendeeId._id,
    email: item.attendeeId.email,
    name: userProfile[0]?.name,
    avatar: userProfile[0]?.avatar,
    activeRole: item.attendeeId.activeRole,
    checkedInAt: item.checkedInAt,
  }));

  return {
    totalCheckedIn,
    lastScans,
  };
};
