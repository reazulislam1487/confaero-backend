export const sponsorSwaggerDocs = {
  "/api/sponsor/create": {
    post: {
      tags: ["sponsor"],
      summary: "sponsor create",
      description: "This is auto generated sponsor create API",
      requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["name"], properties: { name: { type: "string", example: "John Doe" } } } } } },
      responses: { 201: { description: "sponsor created successfully" }, 400: { description: "Validation error" } }
    }
  }
};