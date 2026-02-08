export const boothSwaggerDocs = {
  "/api/booth/create": {
    post: {
      tags: ["booth"],
      summary: "booth create",
      description: "This is auto generated booth create API",
      requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["name"], properties: { name: { type: "string", example: "John Doe" } } } } } },
      responses: { 201: { description: "booth created successfully" }, 400: { description: "Validation error" } }
    }
  }
};