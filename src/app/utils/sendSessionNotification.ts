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
  sendToEmail = false, // ✅ optional toggle
}: {
  eventId: Types.ObjectId;
  actorId: Types.ObjectId;
  sessionId: Types.ObjectId;
  type: "SESSION_CREATED" | "SESSION_UPDATED";
  title: string;
  message: string;
  sendToEmail?: boolean;
}) => {
  // 1️⃣ Load event
  const event = await Event_Model.findById(eventId).lean();
  if (!event) return;

  // 2️⃣ Event organizers
  const organizerIds = event.participants
    .filter((p: any) => p.role === "organizer")
    .map((p: any) => p.accountId.toString());

  // 3️⃣ Super admins
  const superAdmins = await Account_Model.find(
    { role: "SUPER_ADMIN" },
    { _id: 1, email: 1 },
  ).lean();

  const receiverIds = [
    ...organizerIds,
    ...superAdmins.map((a: any) => a._id.toString()),
  ];

  if (!receiverIds.length) return;

  // 4️⃣ Load users (for email)
  const users = await Account_Model.find(
    { _id: { $in: receiverIds } },
    { _id: 1, email: 1, name: 1, emailNotificationOn: 1 },
  ).lean();

  // 5️⃣ Build notifications
  const notifications = users
    .filter((u: any) => u._id.toString() !== actorId.toString()) // ❌ self notify
    .map((u: any) => ({
      receiverId: u._id,
      eventId,
      type,
      title,
      message,
      refId: sessionId,
      sendToEmail,
      email: u.email,
      name: u.name,
    }));

  if (!notifications.length) return;

  // 6️⃣ Save notifications
  const saved = await organizer_notification_model.insertMany(
    notifications.map(({ email, name, ...rest }) => rest),
  );

  // 7️⃣ Realtime socket (GLOBAL)
  emitEventNotification(eventId.toString(), {
    type,
    refId: sessionId.toString(),
    title,
    message,
  });

  // 8️⃣ Email (fire & forget)
  if (sendToEmail) {
    notifications.forEach((n: any) => {
      if (!n.email) return;
      // ❌ user globally email OFF করে রাখছে
      if (n.emailNotificationOn === false) return;
      sendMail({
        to: n.email,
        subject:
          type === "SESSION_CREATED"
            ? "New Session Created"
            : "Session Updated",
        name: n.name,
        textBody: "A session has been created or updated in your event.",
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
