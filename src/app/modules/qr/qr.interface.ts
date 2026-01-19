export type TQrPayload = {
  userId: string;
  activeRole:
    | "ORGANIZER"
    | "ATTENDEE"
    | "SPEAKER"
    | "EXHIBITOR"
    | "STAFF"
    | "SPONSOR"
    | "ABSTRACT_REVIEWER"
    | "TRACK_CHAIR";
  eventId: string;
  type: "QR_ACCESS";
};
