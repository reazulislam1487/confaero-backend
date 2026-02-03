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
  type: "PDF" | "IMAGE";
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
export type T_AssignedAbstract = {
  attachmentId: string;
  title: string;
  size: string;
  uploadedAt: Date;
  reviewStatus: string;
  author: {
    name: string;
    avatar?: string;
    role: string;
  };
};

export type T_PaginatedAbstractResponse = {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: T_AssignedAbstract[];
};
