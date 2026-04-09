export const appContentSwaggerDocs = {
  "/api/v1/appContent/create": {
    post: {
      tags: ["App Content"],
      summary: "Create or update app content",
      description: "Create or update static app content (super admin/organizer only).",
      security: [{ AuthorizationToken: [] }],
      requestBody: {
        required: true,
        content: { "application/json": { schema: { type: "object", properties: { type: { type: "string" }, content: { type: "object" } } } } },
      },
      responses: { 200: { description: "App content created/updated successfully" }, 400: { description: "Validation error" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/appContent/all": {
    get: {
      tags: ["App Content"],
      summary: "Get all app contents",
      description: "Get all static app content (public endpoint).",
      responses: { 200: { description: "App contents retrieved successfully" } },
    },
  },

  "/api/v1/appContent/{type}": {
    get: {
      tags: ["App Content"],
      summary: "Get single app content",
      description: "Get a specific type of app content (public endpoint).",
      parameters: [{ name: "type", in: "path", required: true, schema: { type: "string" }, description: "Content type" }],
      responses: { 200: { description: "App content retrieved successfully" }, 404: { description: "Content not found" } },
    },
  },
};
