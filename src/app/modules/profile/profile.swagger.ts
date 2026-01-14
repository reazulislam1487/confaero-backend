export const profileSwaggerDocs = {
  "/api/profile/create": {
    post: {
      tags: ["profile"],
      summary: "profile create",
      description: "This is auto generated profile create API",
      requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["name"], properties: { name: { type: "string", example: "John Doe" } } } } } },
      responses: { 201: { description: "profile created successfully" }, 400: { description: "Validation error" } }
    }
  }
};