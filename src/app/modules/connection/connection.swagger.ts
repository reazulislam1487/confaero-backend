export const connectionSwaggerDocs = {
  "/api/v1/connection/request/{eventId}": {
    post: {
      tags: ["Connection"],
      summary: "Send connection request",
      description: "Send a connection request to another attendee at an event.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" }],
      requestBody: {
        required: true,
        content: { "application/json": { schema: { type: "object", required: ["receiverId"], properties: { receiverId: { type: "string" }, message: { type: "string" } } } } },
      },
      responses: { 201: { description: "Connection request sent successfully" }, 400: { description: "Validation error" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/connection/requests": {
    get: {
      tags: ["Connection"],
      summary: "Get incoming requests",
      description: "Get incoming connection requests for the authenticated user.",
      security: [{ AuthorizationToken: [] }],
      responses: { 200: { description: "Connection requests retrieved successfully" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/connection/requests/{id}/accept": {
    patch: {
      tags: ["Connection"],
      summary: "Accept connection request",
      description: "Accept an incoming connection request.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" }, description: "Connection request ID" }],
      responses: { 200: { description: "Connection request accepted successfully" }, 401: { description: "Unauthorized" }, 404: { description: "Request not found" } },
    },
  },

  "/api/v1/connection/": {
    get: {
      tags: ["Connection"],
      summary: "Get connections",
      description: "Get all connections for the authenticated user.",
      security: [{ AuthorizationToken: [] }],
      responses: { 200: { description: "Connections retrieved successfully" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/connection/{id}/bookmark": {
    patch: {
      tags: ["Connection"],
      summary: "Toggle bookmark",
      description: "Toggle bookmark status for a connection.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" }, description: "Connection ID" }],
      responses: { 200: { description: "Bookmark toggled successfully" }, 401: { description: "Unauthorized" }, 404: { description: "Connection not found" } },
    },
  },

  "/api/v1/connection/{connectionId}": {
    get: {
      tags: ["Connection"],
      summary: "Get connection details",
      description: "Get details of a specific connection.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "connectionId", in: "path", required: true, schema: { type: "string" }, description: "Connection ID" }],
      responses: { 200: { description: "Connection details retrieved successfully" }, 401: { description: "Unauthorized" }, 404: { description: "Connection not found" } },
    },
  },
};
