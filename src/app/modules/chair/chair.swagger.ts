export const chairSwaggerDocs = {
  "/api/chair/create": {
    post: {
      tags: ["chair"],
      summary: "chair create",
      description: "This is auto generated chair create API",
      requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["name"], properties: { name: { type: "string", example: "John Doe" } } } } } },
      responses: { 201: { description: "chair created successfully" }, 400: { description: "Validation error" } }
    }
  }
};