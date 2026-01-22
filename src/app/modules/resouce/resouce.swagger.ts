export const resouceSwaggerDocs = {
  "/api/resouce/create": {
    post: {
      tags: ["resouce"],
      summary: "resouce create",
      description: "This is auto generated resouce create API",
      requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["name"], properties: { name: { type: "string", example: "John Doe" } } } } } },
      responses: { 201: { description: "resouce created successfully" }, 400: { description: "Validation error" } }
    }
  }
};