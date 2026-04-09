export const organizerBoothSwaggerDocs = {
  "/api/v1/organizerBooth/events/{eventId}/booths": {
    get: {
      tags: ["Organizer Booth"],
      summary: "Get event booths",
      description: "Get all booths for a specific event.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" }],
      responses: { 200: { description: "Booths retrieved successfully" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/organizerBooth/booths/{boothId}": {
    get: {
      tags: ["Organizer Booth"],
      summary: "Get booth details",
      description: "Get details of a specific booth.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "boothId", in: "path", required: true, schema: { type: "string" }, description: "Booth ID" }],
      responses: { 200: { description: "Booth details retrieved successfully" }, 401: { description: "Unauthorized" }, 404: { description: "Booth not found" } },
    },
  },

  "/api/v1/organizerBooth/booths/{boothId}/number": {
    patch: {
      tags: ["Organizer Booth"],
      summary: "Update booth number",
      description: "Update the booth number/identifier (organizer only).",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "boothId", in: "path", required: true, schema: { type: "string" }, description: "Booth ID" }],
      requestBody: {
        required: true,
        content: { "application/json": { schema: { type: "object", properties: { number: { type: "string" } } } } },
      },
      responses: { 200: { description: "Booth number updated successfully" }, 400: { description: "Validation error" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/organizerBooth/booths/{boothId}/accept": {
    patch: {
      tags: ["Organizer Booth"],
      summary: "Accept booth",
      description: "Accept/approve a booth (organizer only).",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "boothId", in: "path", required: true, schema: { type: "string" }, description: "Booth ID" }],
      responses: { 200: { description: "Booth accepted successfully" }, 401: { description: "Unauthorized" }, 404: { description: "Booth not found" } },
    },
  },

  "/api/v1/organizerBooth/booths/{boothId}/cancel": {
    patch: {
      tags: ["Organizer Booth"],
      summary: "Cancel booth",
      description: "Cancel/reject a booth (organizer only).",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "boothId", in: "path", required: true, schema: { type: "string" }, description: "Booth ID" }],
      responses: { 200: { description: "Booth cancelled successfully" }, 401: { description: "Unauthorized" }, 404: { description: "Booth not found" } },
    },
  },
};
