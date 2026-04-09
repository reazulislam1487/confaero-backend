export const reviewerSwaggerDocs = {
  "/api/v1/reviewer/dashboard/{eventId}": {
    get: {
      tags: ["Reviewer"],
      summary: "Get reviewer dashboard",
      description: "Get dashboard data for a reviewer including assigned submissions and stats.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" }],
      responses: { 200: { description: "Reviewer dashboard retrieved successfully" }, 401: { description: "Unauthorized" }, 403: { description: "Forbidden" } },
    },
  },

  "/api/v1/reviewer/authors/{eventId}": {
    get: {
      tags: ["Reviewer"],
      summary: "Get authors",
      description: "Get list of authors who submitted to the event.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" }],
      responses: { 200: { description: "Authors retrieved successfully" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/reviewer/authors/{authorId}/submissions": {
    get: {
      tags: ["Reviewer"],
      summary: "Get author submissions",
      description: "Get all submissions by a specific author.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "authorId", in: "path", required: true, schema: { type: "string" }, description: "Author ID" }],
      responses: { 200: { description: "Author submissions retrieved successfully" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/reviewer/attachments/{attachmentId}": {
    get: {
      tags: ["Reviewer"],
      summary: "Get attachment details",
      description: "Get details of a specific attachment for review.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "attachmentId", in: "path", required: true, schema: { type: "string" }, description: "Attachment ID" }],
      responses: { 200: { description: "Attachment details retrieved successfully" }, 401: { description: "Unauthorized" }, 404: { description: "Attachment not found" } },
    },
    patch: {
      tags: ["Reviewer"],
      summary: "Approve attachment",
      description: "Approve an attachment after review.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "attachmentId", in: "path", required: true, schema: { type: "string" }, description: "Attachment ID" }],
      responses: { 200: { description: "Attachment approved successfully" }, 401: { description: "Unauthorized" }, 404: { description: "Attachment not found" } },
    },
  },

  "/api/v1/reviewer/attachments/{attachmentId}/approve": {
    patch: {
      tags: ["Reviewer"],
      summary: "Approve attachment",
      description: "Approve an attachment after review.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "attachmentId", in: "path", required: true, schema: { type: "string" }, description: "Attachment ID" }],
      responses: { 200: { description: "Attachment approved successfully" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/reviewer/attachments/{attachmentId}/reject": {
    patch: {
      tags: ["Reviewer"],
      summary: "Reject attachment",
      description: "Reject an attachment after review.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "attachmentId", in: "path", required: true, schema: { type: "string" }, description: "Attachment ID" }],
      responses: { 200: { description: "Attachment rejected successfully" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/reviewer/attachments/{attachmentId}/revise": {
    patch: {
      tags: ["Reviewer"],
      summary: "Request revision",
      description: "Request revision for an attachment.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "attachmentId", in: "path", required: true, schema: { type: "string" }, description: "Attachment ID" }],
      requestBody: {
        required: true,
        content: { "application/json": { schema: { type: "object", properties: { comments: { type: "string" } } } } },
      },
      responses: { 200: { description: "Revision requested successfully" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/reviewer/attachments/{attachmentId}/flag-admin": {
    patch: {
      tags: ["Reviewer"],
      summary: "Flag for admin",
      description: "Flag an attachment for admin review.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "attachmentId", in: "path", required: true, schema: { type: "string" }, description: "Attachment ID" }],
      requestBody: {
        required: true,
        content: { "application/json": { schema: { type: "object", properties: { reason: { type: "string" } } } } },
      },
      responses: { 200: { description: "Attachment flagged successfully" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/reviewer/attachments/{attachmentId}/image-review": {
    post: {
      tags: ["Reviewer"],
      summary: "Review image",
      description: "Submit a review for an image attachment.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "attachmentId", in: "path", required: true, schema: { type: "string" }, description: "Attachment ID" }],
      requestBody: {
        required: true,
        content: { "application/json": { schema: { type: "object", properties: { rating: { type: "number" }, comments: { type: "string" }, status: { type: "string" } } } } },
      },
      responses: { 200: { description: "Image review submitted successfully" }, 400: { description: "Validation error" }, 401: { description: "Unauthorized" } },
    },
  },
};
