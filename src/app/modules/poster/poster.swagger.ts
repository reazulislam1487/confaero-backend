export const posterSwaggerDocs = {
  "/api/poster/create": {
    post: {
      tags: ["poster"],
      summary: "poster create",
      description: "This is auto generated poster create API",
      requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["name"], properties: { name: { type: "string", example: "John Doe" } } } } } },
      responses: { 201: { description: "poster created successfully" }, 400: { description: "Validation error" } }
    }
  }
};