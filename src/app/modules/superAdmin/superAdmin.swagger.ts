export const superAdminSwaggerDocs = {
  "/api/superAdmin/create": {
    post: {
      tags: ["superAdmin"],
      summary: "superAdmin create",
      description: "This is auto generated superAdmin create API",
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
        201: { description: "superAdmin created successfully" },
        400: { description: "Validation error" },
      },
    },
  },
};
