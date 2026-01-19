export const attendeeSwaggerDocs = {
  "/api/attendee/create": {
    post: {
      tags: ["attendee"],
      summary: "attendee create",
      description: "This is auto generated attendee create API",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name"],
              properties: { name: { type: "string", example: "John Doe" } },
            },
          },
        },
      },
      responses: {
        201: { description: "attendee created successfully" },
        400: { description: "Validation error" },
      },
    },
  },
};
