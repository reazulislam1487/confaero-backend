export const messageOrganizerSwaggerDocs = {
  "/api/messageOrganizer/create": {
    post: {
      tags: ["messageOrganizer"],
      summary: "messageOrganizer create",
      description: "This is auto generated messageOrganizer create API",
      requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["name"], properties: { name: { type: "string", example: "John Doe" } } } } } },
      responses: { 201: { description: "messageOrganizer created successfully" }, 400: { description: "Validation error" } }
    }
  }
};