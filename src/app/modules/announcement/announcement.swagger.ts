export const announcementSwaggerDocs = {
  "/api/v1/announcement/{eventId}": {
    post: {
      tags: ["Announcement"],
      summary: "Create announcement",
      description: "Create a new announcement for an event. Supports file attachment.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" }],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                title: { type: "string", example: "Important Update" },
                content: { type: "string", example: "Announcement content here" },
                file: { type: "string", format: "binary", description: "Optional file attachment" },
              },
            },
          },
        },
      },
      responses: { 201: { description: "Announcement created successfully" }, 400: { description: "Validation error" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/announcement/{id}/{eventId}": {
    patch: {
      tags: ["Announcement"],
      summary: "Update announcement",
      description: "Update an existing announcement. Supports file attachment.",
      security: [{ AuthorizationToken: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" }, description: "Announcement ID" },
        { name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" },
      ],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                title: { type: "string" },
                content: { type: "string" },
                file: { type: "string", format: "binary", description: "Optional file attachment" },
              },
            },
          },
        },
      },
      responses: { 200: { description: "Announcement updated successfully" }, 400: { description: "Validation error" }, 401: { description: "Unauthorized" }, 404: { description: "Announcement not found" } },
    },
    delete: {
      tags: ["Announcement"],
      summary: "Delete announcement",
      description: "Delete an announcement.",
      security: [{ AuthorizationToken: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" }, description: "Announcement ID" },
        { name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" },
      ],
      responses: { 200: { description: "Announcement deleted successfully" }, 401: { description: "Unauthorized" }, 404: { description: "Announcement not found" } },
    },
    get: {
      tags: ["Announcement"],
      summary: "Get single announcement",
      description: "Get details of a specific announcement.",
      security: [{ AuthorizationToken: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" }, description: "Announcement ID" },
        { name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" },
      ],
      responses: { 200: { description: "Announcement retrieved successfully" }, 401: { description: "Unauthorized" }, 404: { description: "Announcement not found" } },
    },
  },

  "/api/v1/announcement/get-all/{eventId}": {
    get: {
      tags: ["Announcement"],
      summary: "Get all announcements",
      description: "Get all announcements for an event (Organizer view).",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" }],
      responses: { 200: { description: "Announcements retrieved successfully" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/announcement/event/{eventId}": {
    get: {
      tags: ["Announcement"],
      summary: "Get event announcements",
      description: "Get all announcements for an event (attendee view).",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" }],
      responses: { 200: { description: "Announcements retrieved successfully" }, 401: { description: "Unauthorized" } },
    },
  },
};
