import { Types } from "mongoose";

export type Status =
  | "pending"
  | "assigned"
  | "accepted"
  | "revised"
  | "reviewed"
  | "flagged"
  | "rejected";
export type T_Attachment = {
  url: string;
  type: "pdf" | "image";
  name: string;
  size?: number;
  reviewStatus: Status;
  reviewReason?: string;
  reviewScore?: {
    originality: number;
    scientificRigor: number;
    clarity: number;
    visualDesign: number;
    impact: number;
    presentation: number;
    overall: boolean;
  };
  _id: string;
};

export type T_Presenter = {
  name: string;
  role?: string;
};

export type T_Poster = {
  eventId: Types.ObjectId;
  authorId: Types.ObjectId;

  title: string;
  abstract: string;
  banner: string;

  tags: string[];
  presenters: T_Presenter[];

  videoLink?: string;
  dueDate: string;
  attachments: T_Attachment[];

  status: Status;

  createdAt: Date;
};
