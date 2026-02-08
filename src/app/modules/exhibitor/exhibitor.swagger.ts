export const exhibitorSwaggerDocs = {
  "/api/exhibitor/create": {
    post: {
      tags: ["exhibitor"],
      summary: "exhibitor create",
      description: "This is auto generated exhibitor create API",
      requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["name"], properties: { name: { type: "string", example: "John Doe" } } } } } },
      responses: { 201: { description: "exhibitor created successfully" }, 400: { description: "Validation error" } }
    }
  }
};