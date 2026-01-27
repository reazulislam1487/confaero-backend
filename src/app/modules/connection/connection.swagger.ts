export const connectionSwaggerDocs = {
  "/api/connection/create": {
    post: {
      tags: ["connection"],
      summary: "connection create",
      description: "This is auto generated connection create API",
      requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["name"], properties: { name: { type: "string", example: "John Doe" } } } } } },
      responses: { 201: { description: "connection created successfully" }, 400: { description: "Validation error" } }
    }
  }
};