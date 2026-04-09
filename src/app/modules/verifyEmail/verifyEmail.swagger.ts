export const verifyEmailSwaggerDocs = {
  "/api/v1/organizer/verify-email/upload": {
    post: {
      tags: ["Verify Email"],
      summary: "Upload verified emails",
      description: "Upload a CSV file containing verified email addresses for an event.",
      security: [{ AuthorizationToken: [] }],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["file"],
              properties: {
                file: { type: "string", format: "binary", description: "CSV file containing email addresses" },
              },
            },
          },
        },
      },
      responses: { 200: { description: "Emails uploaded successfully" }, 400: { description: "Invalid CSV file" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/organizer/verify-email/list/{eventId}": {
    get: {
      tags: ["Verify Email"],
      summary: "Get all verified emails",
      description: "Get all verified email addresses for an event.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" }],
      responses: { 200: { description: "Verified emails retrieved successfully" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/organizer/verify-email/{verifyEmailId}": {
    delete: {
      tags: ["Verify Email"],
      summary: "Delete verified email",
      description: "Delete a verified email entry.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "verifyEmailId", in: "path", required: true, schema: { type: "string" }, description: "Verify Email ID" }],
      responses: { 200: { description: "Email deleted successfully" }, 401: { description: "Unauthorized" }, 404: { description: "Entry not found" } },
    },
  },

  "/api/v1/organizer/verify-email/add": {
    post: {
      tags: ["Verify Email"],
      summary: "Add verified emails",
      description: "Manually add verified email addresses to the list.",
      security: [{ AuthorizationToken: [] }],
      requestBody: {
        required: true,
        content: { "application/json": { schema: { type: "object", properties: { emails: { type: "array", items: { type: "string", format: "email" } }, eventId: { type: "string" } } } } },
      },
      responses: { 200: { description: "Emails added successfully" }, 400: { description: "Validation error" }, 401: { description: "Unauthorized" } },
    },
  },
};
