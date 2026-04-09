export const boothSwaggerDocs = {
  "/api/v1/booth/create": {
    post: {
      tags: ["Booth"],
      summary: "Create booth",
      description: "Create a new exhibition booth for an event.",
      security: [{ AuthorizationToken: [] }],
      requestBody: {
        required: true,
        content: { "application/json": { schema: { type: "object", properties: { name: { type: "string" }, description: { type: "string" }, eventId: { type: "string" } } } } },
      },
      responses: { 201: { description: "Booth created successfully" }, 400: { description: "Validation error" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/booth/me": {
    get: {
      tags: ["Booth"],
      summary: "Get my booth",
      description: "Get the booth owned by the authenticated exhibitor/staff.",
      security: [{ AuthorizationToken: [] }],
      responses: { 200: { description: "Booth retrieved successfully" }, 401: { description: "Unauthorized" }, 404: { description: "Booth not found" } },
    },
    patch: {
      tags: ["Booth"],
      summary: "Update booth",
      description: "Update the exhibitor's booth details.",
      security: [{ AuthorizationToken: [] }],
      requestBody: {
        required: true,
        content: { "application/json": { schema: { type: "object", properties: { name: { type: "string" }, description: { type: "string" } } } } },
      },
      responses: { 200: { description: "Booth updated successfully" }, 400: { description: "Validation error" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/booth/staff": {
    post: {
      tags: ["Booth"],
      summary: "Add booth staff",
      description: "Add staff members to a booth by email.",
      security: [{ AuthorizationToken: [] }],
      requestBody: {
        required: true,
        content: { "application/json": { schema: { type: "object", properties: { email: { type: "string", format: "email" } } } } },
      },
      responses: { 200: { description: "Staff added successfully" }, 400: { description: "Validation error" }, 401: { description: "Unauthorized" } },
    },
    get: {
      tags: ["Booth"],
      summary: "Get booth staff list",
      description: "Get all staff members assigned to the booth.",
      security: [{ AuthorizationToken: [] }],
      responses: { 200: { description: "Staff list retrieved successfully" }, 401: { description: "Unauthorized" } },
    },
  },
};
