export const organizerSponsorSwaggerDocs = {
  "/api/v1/organizerSponsor/all-sponsors/{eventId}": {
    get: {
      tags: ["Organizer Sponsor"],
      summary: "Get all sponsors",
      description: "Get all sponsors for a specific event.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" }],
      responses: { 200: { description: "Sponsors retrieved successfully" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/organizerSponsor/sponsor/{sponsorId}": {
    get: {
      tags: ["Organizer Sponsor"],
      summary: "Get sponsor details",
      description: "Get details of a specific sponsor.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "sponsorId", in: "path", required: true, schema: { type: "string" }, description: "Sponsor ID" }],
      responses: { 200: { description: "Sponsor details retrieved successfully" }, 401: { description: "Unauthorized" }, 404: { description: "Sponsor not found" } },
    },
  },

  "/api/v1/organizerSponsor/{sponsorId}/approve": {
    patch: {
      tags: ["Organizer Sponsor"],
      summary: "Approve sponsor",
      description: "Approve a sponsor profile (organizer only).",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "sponsorId", in: "path", required: true, schema: { type: "string" }, description: "Sponsor ID" }],
      responses: { 200: { description: "Sponsor approved successfully" }, 401: { description: "Unauthorized" }, 404: { description: "Sponsor not found" } },
    },
  },

  "/api/v1/organizerSponsor/{sponsorId}/reject": {
    patch: {
      tags: ["Organizer Sponsor"],
      summary: "Reject sponsor",
      description: "Reject a sponsor profile (organizer only).",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "sponsorId", in: "path", required: true, schema: { type: "string" }, description: "Sponsor ID" }],
      responses: { 200: { description: "Sponsor rejected successfully" }, 401: { description: "Unauthorized" }, 404: { description: "Sponsor not found" } },
    },
  },
};
