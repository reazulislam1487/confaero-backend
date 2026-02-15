export const jobSwaggerDocs = {
  "/api/job/create": {
    post: {
      tags: ["job"],
      summary: "job create",
      description: "This is auto generated job create API",
      requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["name"], properties: { name: { type: "string", example: "John Doe" } } } } } },
      responses: { 201: { description: "job created successfully" }, 400: { description: "Validation error" } }
    }
  }
};