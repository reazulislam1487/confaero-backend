export const posterSwaggerDocs = {
  "/api/v1/poster/upload-file": {
    post: {
      tags: ["Poster"],
      summary: "Upload single file",
      description: "Upload a single file (banner/PDF/image) for poster submission.",
      security: [{ AuthorizationToken: [] }],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["file"],
              properties: {
                file: { type: "string", format: "binary", description: "File to upload" },
              },
            },
          },
        },
      },
      responses: { 200: { description: "File uploaded successfully" }, 400: { description: "Validation error" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/poster/upload-files": {
    post: {
      tags: ["Poster"],
      summary: "Upload multiple files",
      description: "Upload multiple files (attachments) for poster submission.",
      security: [{ AuthorizationToken: [] }],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["files"],
              properties: {
                files: { type: "array", items: { type: "string", format: "binary" }, description: "Files to upload (max 10)" },
              },
            },
          },
        },
      },
      responses: { 200: { description: "Files uploaded successfully" }, 400: { description: "Validation error" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/poster/create/{eventId}": {
    post: {
      tags: ["Poster"],
      summary: "Create poster",
      description: "Create a new poster submission for an event.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" }],
      requestBody: {
        required: true,
        content: { "application/json": { schema: { type: "object", properties: { title: { type: "string" }, abstract: { type: "string" }, fileIds: { type: "array", items: { type: "string" } } } } } },
      },
      responses: { 201: { description: "Poster created successfully" }, 400: { description: "Validation error" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/poster/accepted": {
    get: {
      tags: ["Poster"],
      summary: "Get accepted posters",
      description: "Get all accepted poster submissions (public endpoint).",
      responses: { 200: { description: "Accepted posters retrieved successfully" } },
    },
  },

  "/api/v1/poster/revised": {
    get: {
      tags: ["Poster"],
      summary: "Get revised posters",
      description: "Get poster submissions that require revision.",
      security: [{ AuthorizationToken: [] }],
      responses: { 200: { description: "Revised posters retrieved successfully" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/poster/author/attachments/{attachmentId}": {
    patch: {
      tags: ["Poster"],
      summary: "Update attachment",
      description: "Update a revised attachment (author only).",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "attachmentId", in: "path", required: true, schema: { type: "string" }, description: "Attachment ID" }],
      requestBody: {
        required: true,
        content: { "application/json": { schema: { type: "object", properties: { fileUrl: { type: "string" } } } } },
      },
      responses: { 200: { description: "Attachment updated successfully" }, 400: { description: "Validation error" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/poster/accepted/{posterId}": {
    get: {
      tags: ["Poster"],
      summary: "Get single accepted poster",
      description: "Get a specific accepted poster (public endpoint).",
      parameters: [{ name: "posterId", in: "path", required: true, schema: { type: "string" }, description: "Poster ID" }],
      responses: { 200: { description: "Poster retrieved successfully" }, 404: { description: "Poster not found" } },
    },
  },
};
