export type T_OrganizerBooth = {
  _id: string;
  eventId: string;
  exhibitorId: string;
  companyName: string;
  boothNumber?: string;
  isAccepted: boolean;
  status: "active" | "inactive";
  createdAt: Date;
};
