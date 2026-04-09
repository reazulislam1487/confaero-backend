export const messageSwaggerDocs = {
  "/api/v1/message/send/{eventId}": {
    post: {
      tags: ["Message"],
      summary: "Send message",
      description: "Send a chat message to another user in an event.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" }],
      requestBody: {
        required: true,
        content: { "application/json": { schema: { type: "object", required: ["receiverId", "content"], properties: { receiverId: { type: "string" }, content: { type: "string" } } } } },
      },
      responses: { 201: { description: "Message sent successfully" }, 400: { description: "Validation error" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/message/conversations/{eventId}": {
    get: {
      tags: ["Message"],
      summary: "Get conversations",
      description: "Get all conversations for the authenticated user in an event.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" }],
      responses: { 200: { description: "Conversations retrieved successfully" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/message/{conversationId}/{eventId}": {
    get: {
      tags: ["Message"],
      summary: "Get messages",
      description: "Get messages from a specific conversation.",
      security: [{ AuthorizationToken: [] }],
      parameters: [
        { name: "conversationId", in: "path", required: true, schema: { type: "string" }, description: "Conversation ID" },
        { name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" },
      ],
      responses: { 200: { description: "Messages retrieved successfully" }, 401: { description: "Unauthorized" }, 404: { description: "Conversation not found" } },
    },
    patch: {
      tags: ["Message"],
      summary: "Mark as seen",
      description: "Mark messages in a conversation as seen.",
      security: [{ AuthorizationToken: [] }],
      parameters: [
        { name: "conversationId", in: "path", required: true, schema: { type: "string" }, description: "Conversation ID" },
        { name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" },
      ],
      responses: { 200: { description: "Messages marked as seen" }, 401: { description: "Unauthorized" }, 404: { description: "Conversation not found" } },
    },
  },
};
