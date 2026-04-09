export const messageOrganizerSwaggerDocs = {
  "/api/v1/messageOrganizer/stats/{eventId}": {
    get: {
      tags: ["Message Organizer"],
      summary: "Get chat statistics",
      description: "Get chat statistics for an event including total, active, and unread messages.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" }],
      responses: { 200: { description: "Chat stats retrieved successfully" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/messageOrganizer/conversations/{eventId}": {
    get: {
      tags: ["Message Organizer"],
      summary: "Get conversations",
      description: "Get all conversations for an event (organizer dashboard).",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" }],
      responses: { 200: { description: "Conversations retrieved successfully" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/messageOrganizer/messages/{conversationId}/{eventId}": {
    get: {
      tags: ["Message Organizer"],
      summary: "Get messages",
      description: "Get messages from a specific conversation (organizer view).",
      security: [{ AuthorizationToken: [] }],
      parameters: [
        { name: "conversationId", in: "path", required: true, schema: { type: "string" }, description: "Conversation ID" },
        { name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" },
      ],
      responses: { 200: { description: "Messages retrieved successfully" }, 401: { description: "Unauthorized" } },
    },
    patch: {
      tags: ["Message Organizer"],
      summary: "Mark messages as seen",
      description: "Mark messages in a conversation as seen by organizer.",
      security: [{ AuthorizationToken: [] }],
      parameters: [
        { name: "conversationId", in: "path", required: true, schema: { type: "string" }, description: "Conversation ID" },
        { name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" },
      ],
      responses: { 200: { description: "Messages marked as seen" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/messageOrganizer/notifications/{eventId}": {
    get: {
      tags: ["Message Organizer"],
      summary: "Get notifications",
      description: "Get organizer notifications for an event.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" }],
      responses: { 200: { description: "Notifications retrieved successfully" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/messageOrganizer/notifications/{id}/{eventId}": {
    patch: {
      tags: ["Message Organizer"],
      summary: "Mark notification read",
      description: "Mark a notification as read.",
      security: [{ AuthorizationToken: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" }, description: "Notification ID" },
        { name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" },
      ],
      responses: { 200: { description: "Notification marked as read" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/messageOrganizer/presence/{userId}/{eventId}": {
    get: {
      tags: ["Message Organizer"],
      summary: "Get user presence",
      description: "Get user presence status for an event.",
      security: [{ AuthorizationToken: [] }],
      parameters: [
        { name: "userId", in: "path", required: true, schema: { type: "string" }, description: "User ID" },
        { name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" },
      ],
      responses: { 200: { description: "User presence retrieved successfully" }, 401: { description: "Unauthorized" } },
    },
  },
};
