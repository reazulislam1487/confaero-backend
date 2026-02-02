export const posterAssignSwaggerDocs = {
  "/api/posterAssign/create": {
    post: {
      tags: ["posterAssign"],
      summary: "posterAssign create",
      description: "This is auto generated posterAssign create API",
      requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["name"], properties: { name: { type: "string", example: "John Doe" } } } } } },
      responses: { 201: { description: "posterAssign created successfully" }, 400: { description: "Validation error" } }
    }
  }
};