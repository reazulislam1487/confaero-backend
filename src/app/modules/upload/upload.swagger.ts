export const uploadSwaggerDocs = {
  "/api/upload/create": {
    post: {
      tags: ["upload"],
      summary: "upload create",
      description: "This is auto generated upload create API",
      requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["name"], properties: { name: { type: "string", example: "John Doe" } } } } } },
      responses: { 201: { description: "upload created successfully" }, 400: { description: "Validation error" } }
    }
  }
};