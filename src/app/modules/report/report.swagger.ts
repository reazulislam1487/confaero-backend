export const reportSwaggerDocs = {
  "/api/report/create": {
    post: {
      tags: ["report"],
      summary: "report create",
      description: "This is auto generated report create API",
      requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["name"], properties: { name: { type: "string", example: "John Doe" } } } } } },
      responses: { 201: { description: "report created successfully" }, 400: { description: "Validation error" } }
    }
  }
};