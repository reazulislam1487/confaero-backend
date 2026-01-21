export const noteSwaggerDocs = {
  "/api/note/create": {
    post: {
      tags: ["note"],
      summary: "note create",
      description: "This is auto generated note create API",
      requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["name"], properties: { name: { type: "string", example: "John Doe" } } } } } },
      responses: { 201: { description: "note created successfully" }, 400: { description: "Validation error" } }
    }
  }
};