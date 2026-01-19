export const invitationSwaggerDocs = {
  "/api/invitation/create": {
    post: {
      tags: ["invitation"],
      summary: "invitation create",
      description: "This is auto generated invitation create API",
      requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["name"], properties: { name: { type: "string", example: "John Doe" } } } } } },
      responses: { 201: { description: "invitation created successfully" }, 400: { description: "Validation error" } }
    }
  }
};