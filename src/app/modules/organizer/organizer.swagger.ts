export const organizerSwaggerDocs = {
  "/api/organizer/create": {
    post: {
      tags: ["organizer"],
      summary: "organizer create",
      description: "This is auto generated organizer create API",
      requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["name"], properties: { name: { type: "string", example: "John Doe" } } } } } },
      responses: { 201: { description: "organizer created successfully" }, 400: { description: "Validation error" } }
    }
  }
};