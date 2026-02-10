export const documentSwaggerDocs = {
  "/api/document/create": {
    post: {
      tags: ["document"],
      summary: "document create",
      description: "This is auto generated document create API",
      requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["name"], properties: { name: { type: "string", example: "John Doe" } } } } } },
      responses: { 201: { description: "document created successfully" }, 400: { description: "Validation error" } }
    }
  }
};