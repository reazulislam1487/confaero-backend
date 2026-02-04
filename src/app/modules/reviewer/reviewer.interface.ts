export type T_ReviewerDashboardSummary = {
  totalAbstracts: number;
  totalPosters: number;
  totalAssigned: number;
  reviewed: number;
  remaining: number;
  progress: number;
};

export type T_ReviewerLatestDocument = {
  attachmentId: string;
  type: "pdf" | "image";
  title: string;
  reviewStatus: string;
  assignedAt: Date;
  url: string;
  author: {
    name: string;
    avatar?: string;
  };
};

export type T_ReviewerDashboardResponse = {
  summary: T_ReviewerDashboardSummary;
  latestDocuments: T_ReviewerLatestDocument[];
};
