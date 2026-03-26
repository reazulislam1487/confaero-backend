import { Types } from "mongoose";
import { Event_Model } from "../modules/superAdmin/event.schema";
import { organizer_notification_model } from "../modules/messageOrganizer/messageOrganizer.schema";
import { emitEventNotification } from "../socket/emit";
import sendMail from "./mail_sender";
import { Account_Model } from "../modules/auth/auth.schema";

export const sendSessionNotification = async ({
  eventId,
  actorId,
  sessionId,
  type,
  title,
  message,
  sendToEmail = false,
}: {
  eventId: Types.ObjectId;
  actorId: Types.ObjectId;
  sessionId: Types.ObjectId;
  type: "SESSION_CREATED" | "SESSION_UPDATED";
  title: string;
  message: string;
  sendToEmail?: boolean;
}) => {
  /* 1️⃣ Load event */
  const event = await Event_Model.findById(eventId).lean();
  if (!event) return;

  /* 2️⃣ All event participants (organizer + others) */
  const participantIds = event.participants.map((p: any) =>
    p.accountId.toString(),
  );

  /* 3️⃣ Organizer IDs */
  const organizerIds = event.organizers.map((id: any) => id.toString());

  /* 4️⃣ Super admins */
  const superAdmins = await Account_Model.find(
    { role: "SUPER_ADMIN" },
    { _id: 1 },
  ).lean();

  /* 5️⃣ Final receiver list (unique) */
  const receiverIds = [
    ...new Set([
      ...participantIds,
      ...organizerIds,
      ...superAdmins.map((a: any) => a._id.toString()),
    ]),
  ];

  if (!receiverIds.length) return;

  /* 6️⃣ Load user accounts */
  const users = await Account_Model.find(
    { _id: { $in: receiverIds } },
    { _id: 1, email: 1, name: 1, emailNotificationOn: 1 },
  ).lean();

  /* ✅ 7️⃣ Create ONLY ONE in-app notification */
  await organizer_notification_model.create({
    receiverId: actorId, // required field
    eventId,
    type,
    title,
    message,
    refId: sessionId,
    sendToEmail,
    isRead: false,
  });

  /* 8️⃣ Realtime socket (GLOBAL EVENT ROOM) */
  emitEventNotification(eventId.toString(), {
    type,
    refId: sessionId.toString(),
    title,
    message,
  });

  /* 9️⃣ Email notification (SELF INCLUDED) */
  if (sendToEmail) {
    users.forEach((u: any) => {
      if (!u.email) return;
      if (u.emailNotificationOn === false) return;

      sendMail({
        to: u.email,
        subject:
          type === "SESSION_CREATED"
            ? "New Session Created"
            : "Session Updated",
        name: u.name,
        textBody: message,
        htmlBody: `
          <p>
            A session has been <strong>${
              type === "SESSION_CREATED" ? "created" : "updated"
            }</strong>
            in your event.
          </p>
          <p>Please login to your dashboard for details.</p>
        `,
      }).catch((err: any) => {
        console.error("Email send failed:", err.message);
      });
    });
  }
};
