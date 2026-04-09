export const sponsorSwaggerDocs = {
  "/api/v1/sponsor/create": {
    post: {
      tags: ["Sponsor"],
      summary: "Create sponsor profile",
      description: "Create a new sponsor profile for an event.",
      security: [{ AuthorizationToken: [] }],
      requestBody: {
        required: true,
        content: { "application/json": { schema: { type: "object", properties: { name: { type: "string" }, description: { type: "string" }, eventId: { type: "string" }, website: { type: "string" } } } } },
      },
      responses: { 201: { description: "Sponsor profile created successfully" }, 400: { description: "Validation error" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/sponsor/get-my-sponsor/{eventId}": {
    get: {
      tags: ["Sponsor"],
      summary: "Get my sponsor profile",
      description: "Get the sponsor profile for the authenticated user in a specific event.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" }],
      responses: { 200: { description: "Sponsor profile retrieved successfully" }, 401: { description: "Unauthorized" }, 404: { description: "Profile not found" } },
    },
  },

  "/api/v1/sponsor/update/{sponsorId}": {
    patch: {
      tags: ["Sponsor"],
      summary: "Update sponsor profile",
      description: "Update the sponsor profile details.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "sponsorId", in: "path", required: true, schema: { type: "string" }, description: "Sponsor Profile ID" }],
      requestBody: {
        required: true,
        content: { "application/json": { schema: { type: "object", properties: { name: { type: "string" }, description: { type: "string" }, website: { type: "string" } } } } },
      },
      responses: { 200: { description: "Sponsor profile updated successfully" }, 400: { description: "Validation error" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/sponsor/view/{sponsorProfileId}": {
    patch: {
      tags: ["Sponsor"],
      summary: "Increment profile view",
      description: "Increment the view count for a sponsor profile.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "sponsorProfileId", in: "path", required: true, schema: { type: "string" }, description: "Sponsor Profile ID" }],
      responses: { 200: { description: "Profile view incremented successfully" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/sponsor/dashboard/{eventId}": {
    get: {
      tags: ["Sponsor"],
      summary: "Get sponsor dashboard",
      description: "Get sponsor dashboard data including stats and analytics for an event.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" }],
      responses: { 200: { description: "Sponsor dashboard retrieved successfully" }, 401: { description: "Unauthorized" } },
    },
  },
};
