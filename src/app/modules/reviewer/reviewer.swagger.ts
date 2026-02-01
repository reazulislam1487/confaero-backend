export const reviewerSwaggerDocs = {
  "/api/reviewer/create": {
    post: {
      tags: ["reviewer"],
      summary: "reviewer create",
      description: "This is auto generated reviewer create API",
      requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["name"], properties: { name: { type: "string", example: "John Doe" } } } } } },
      responses: { 201: { description: "reviewer created successfully" }, 400: { description: "Validation error" } }
    }
  }
};