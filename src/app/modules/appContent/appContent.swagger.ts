export const appContentSwaggerDocs = {
  "/api/appContent/create": {
    post: {
      tags: ["appContent"],
      summary: "appContent create",
      description: "This is auto generated appContent create API",
      requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["name"], properties: { name: { type: "string", example: "John Doe" } } } } } },
      responses: { 201: { description: "appContent created successfully" }, 400: { description: "Validation error" } }
    }
  }
};