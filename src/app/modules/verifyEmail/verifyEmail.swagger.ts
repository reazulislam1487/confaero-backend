export const verifyEmailSwaggerDocs = {
  "/api/verifyEmail/create": {
    post: {
      tags: ["verifyEmail"],
      summary: "verifyEmail create",
      description: "This is auto generated verifyEmail create API",
      requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["name"], properties: { name: { type: "string", example: "John Doe" } } } } } },
      responses: { 201: { description: "verifyEmail created successfully" }, 400: { description: "Validation error" } }
    }
  }
};