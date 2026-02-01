import { Types } from "mongoose";

export type T_Attachment = {
  url: string;
  type: "pdf" | "image";
  name: string;
  size?: number;
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
  attachments: T_Attachment[];

  status: "submitted";

  createdAt: Date;
};
