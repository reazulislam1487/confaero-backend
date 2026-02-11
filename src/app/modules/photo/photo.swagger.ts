export const photoSwaggerDocs = {
  "/api/photo/create": {
    post: {
      tags: ["photo"],
      summary: "photo create",
      description: "This is auto generated photo create API",
      requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["name"], properties: { name: { type: "string", example: "John Doe" } } } } } },
      responses: { 201: { description: "photo created successfully" }, 400: { description: "Validation error" } }
    }
  }
};