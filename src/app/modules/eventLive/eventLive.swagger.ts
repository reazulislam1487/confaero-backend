export const eventLiveSwaggerDocs = {
  "/api/v1/eventLive/start/{eventid}": {
    post: {
      tags: ["Event Live"],
      summary: "Start live session",
      description: "Start a new live session for an event.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "eventid", in: "path", required: true, schema: { type: "string" }, description: "Event ID" }],
      responses: { 200: { description: "Live session started successfully" }, 401: { description: "Unauthorized" }, 400: { description: "Bad request" } },
    },
  },

  "/api/v1/eventLive/join/{eventid}": {
    post: {
      tags: ["Event Live"],
      summary: "Join live session",
      description: "Join an active live session for an event.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "eventid", in: "path", required: true, schema: { type: "string" }, description: "Event ID" }],
      responses: { 200: { description: "Joined live session successfully" }, 401: { description: "Unauthorized" }, 404: { description: "No active session found" } },
    },
  },

  "/api/v1/eventLive/end/{eventid}": {
    post: {
      tags: ["Event Live"],
      summary: "End live session",
      description: "End an active live session.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "eventid", in: "path", required: true, schema: { type: "string" }, description: "Event ID" }],
      responses: { 200: { description: "Live session ended successfully" }, 401: { description: "Unauthorized" }, 404: { description: "No active session found" } },
    },
  },

  "/api/v1/eventLive/live/{eventid}": {
    get: {
      tags: ["Event Live"],
      summary: "Get live sessions",
      description: "Get all active live sessions for an event.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "eventid", in: "path", required: true, schema: { type: "string" }, description: "Event ID" }],
      responses: { 200: { description: "Live sessions retrieved successfully" }, 401: { description: "Unauthorized" } },
    },
  },
};
