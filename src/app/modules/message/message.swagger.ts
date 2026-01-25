export const messageSwaggerDocs = {
  "/api/message/create": {
    post: {
      tags: ["message"],
      summary: "message create",
      description: "This is auto generated message create API",
      requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["name"], properties: { name: { type: "string", example: "John Doe" } } } } } },
      responses: { 201: { description: "message created successfully" }, 400: { description: "Validation error" } }
    }
  }
};