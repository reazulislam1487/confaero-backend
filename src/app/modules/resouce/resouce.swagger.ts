export const resouceSwaggerDocs = {
  "/api/v1/resouce/qna/{eventId}": {
    post: {
      tags: ["Resource (QnA/Poll/Survey)"],
      summary: "Create QnA",
      description: "Create a new Q&A session for an event.",
      security: [{ AuthorizationToken: [] }],
      parameters: [
        { name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" },
      ],
      requestBody: {
        required: true,
        content: { "application/json": { schema: { type: "object", properties: { question: { type: "string" }, answer: { type: "string" } } } } },
      },
      responses: { 201: { description: "QnA created successfully" }, 400: { description: "Validation error" }, 401: { description: "Unauthorized" } },
    },
    patch: {
      tags: ["Resource (QnA/Poll/Survey)"],
      summary: "Update QnA",
      description: "Update an existing Q&A.",
      security: [{ AuthorizationToken: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" }, description: "QnA ID" },
        { name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" },
      ],
      responses: { 200: { description: "QnA updated successfully" }, 400: { description: "Validation error" }, 401: { description: "Unauthorized" } },
    },
    delete: {
      tags: ["Resource (QnA/Poll/Survey)"],
      summary: "Delete QnA",
      description: "Delete a Q&A.",
      security: [{ AuthorizationToken: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" }, description: "QnA ID" },
        { name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" },
      ],
      responses: { 200: { description: "QnA deleted successfully" }, 401: { description: "Unauthorized" }, 404: { description: "QnA not found" } },
    },
  },

  "/api/v1/resouce/poll/{eventId}": {
    post: {
      tags: ["Resource (QnA/Poll/Survey)"],
      summary: "Create poll",
      description: "Create a new poll for an event.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" }],
      requestBody: {
        required: true,
        content: { "application/json": { schema: { type: "object", properties: { question: { type: "string" }, options: { type: "array", items: { type: "string" } } } } } },
      },
      responses: { 201: { description: "Poll created successfully" }, 400: { description: "Validation error" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/resouce/poll/{pollId}/{eventId}": {
    patch: {
      tags: ["Resource (QnA/Poll/Survey)"],
      summary: "Update poll",
      description: "Update an existing poll.",
      security: [{ AuthorizationToken: [] }],
      parameters: [
        { name: "pollId", in: "path", required: true, schema: { type: "string" }, description: "Poll ID" },
        { name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" },
      ],
      responses: { 200: { description: "Poll updated successfully" }, 400: { description: "Validation error" }, 401: { description: "Unauthorized" } },
    },
    delete: {
      tags: ["Resource (QnA/Poll/Survey)"],
      summary: "Delete poll",
      description: "Delete a poll.",
      security: [{ AuthorizationToken: [] }],
      parameters: [
        { name: "pollId", in: "path", required: true, schema: { type: "string" }, description: "Poll ID" },
        { name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" },
      ],
      responses: { 200: { description: "Poll deleted successfully" }, 401: { description: "Unauthorized" }, 404: { description: "Poll not found" } },
    },
  },

  "/api/v1/resouce/poll/{pollId}/{eventId}/votes": {
    get: {
      tags: ["Resource (QnA/Poll/Survey)"],
      summary: "View poll votes",
      description: "View votes for a specific poll.",
      security: [{ AuthorizationToken: [] }],
      parameters: [
        { name: "pollId", in: "path", required: true, schema: { type: "string" }, description: "Poll ID" },
        { name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" },
      ],
      responses: { 200: { description: "Poll votes retrieved successfully" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/resouce/poll/{pollId}/{eventId}/submit": {
    post: {
      tags: ["Resource (QnA/Poll/Survey)"],
      summary: "Submit poll response",
      description: "Submit a vote for a poll.",
      security: [{ AuthorizationToken: [] }],
      parameters: [
        { name: "pollId", in: "path", required: true, schema: { type: "string" }, description: "Poll ID" },
        { name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" },
      ],
      requestBody: {
        required: true,
        content: { "application/json": { schema: { type: "object", properties: { option: { type: "string" } } } } },
      },
      responses: { 200: { description: "Poll vote submitted successfully" }, 400: { description: "Validation error" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/resouce/survey/{eventId}/submit": {
    post: {
      tags: ["Resource (QnA/Poll/Survey)"],
      summary: "Submit survey",
      description: "Submit survey responses for an event.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" }],
      requestBody: {
        required: true,
        content: { "application/json": { schema: { type: "object", properties: { responses: { type: "array", items: { type: "object" } } } } } },
      },
      responses: { 200: { description: "Survey submitted successfully" }, 400: { description: "Validation error" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/resouce/survey/{eventId}/analytics": {
    get: {
      tags: ["Resource (QnA/Poll/Survey)"],
      summary: "Get survey analytics",
      description: "Get survey analytics and results for an event.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" }],
      responses: { 200: { description: "Survey analytics retrieved successfully" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/resouce/event/qna/{eventId}": {
    get: {
      tags: ["Resource (QnA/Poll/Survey)"],
      summary: "Get event QnA",
      description: "Get all Q&As for an event.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" }],
      responses: { 200: { description: "Event QnAs retrieved successfully" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/resouce/event/poll/{eventId}": {
    get: {
      tags: ["Resource (QnA/Poll/Survey)"],
      summary: "Get event polls",
      description: "Get all polls for an event.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" }],
      responses: { 200: { description: "Event polls retrieved successfully" }, 401: { description: "Unauthorized" } },
    },
  },
};
