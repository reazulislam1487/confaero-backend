export const volunteerSwaggerDocs = {
  "/api/volunteer/create": {
    post: {
      tags: ["volunteer"],
      summary: "volunteer create",
      description: "This is auto generated volunteer create API",
      requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["name"], properties: { name: { type: "string", example: "John Doe" } } } } } },
      responses: { 201: { description: "volunteer created successfully" }, 400: { description: "Validation error" } }
    }
  }
};