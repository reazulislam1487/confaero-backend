export const announcementSwaggerDocs = {
  "/api/announcement/create": {
    post: {
      tags: ["announcement"],
      summary: "announcement create",
      description: "This is auto generated announcement create API",
      requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["name"], properties: { name: { type: "string", example: "John Doe" } } } } } },
      responses: { 201: { description: "announcement created successfully" }, 400: { description: "Validation error" } }
    }
  }
};