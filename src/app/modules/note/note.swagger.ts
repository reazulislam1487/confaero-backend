export const noteSwaggerDocs = {
  "/api/v1/note/create": {
    post: {
      tags: ["Note"],
      summary: "Create note",
      description: "Create a new personal note for the authenticated user.",
      security: [{ AuthorizationToken: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["content"],
              properties: {
                content: { type: "string", example: "My important note content" },
                eventId: { type: "string", example: "507f1f77bcf86cd799439011" },
                sessionId: { type: "string", example: "507f1f77bcf86cd799439012" },
              },
            },
          },
        },
      },
      responses: {
        201: { description: "Note created successfully" },
        400: { description: "Validation error" },
        401: { description: "Unauthorized" },
      },
    },
  },

  "/api/v1/note/notes": {
    get: {
      tags: ["Note"],
      summary: "Get my notes",
      description: "Get all personal notes for the authenticated user.",
      security: [{ AuthorizationToken: [] }],
      responses: {
        200: {
          description: "Notes retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  data: {
                    type: "array",
                    items: { type: "object" },
                  },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized" },
      },
    },
  },
};
