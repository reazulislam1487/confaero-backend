export const speakerSwaggerDocs = {
  "/api/speaker/create": {
    post: {
      tags: ["speaker"],
      summary: "speaker create",
      description: "This is auto generated speaker create API",
      requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["name"], properties: { name: { type: "string", example: "John Doe" } } } } } },
      responses: { 201: { description: "speaker created successfully" }, 400: { description: "Validation error" } }
    }
  }
};