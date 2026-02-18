export const zegoSwaggerDocs = {
  "/api/zego/create": {
    post: {
      tags: ["zego"],
      summary: "zego create",
      description: "This is auto generated zego create API",
      requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["name"], properties: { name: { type: "string", example: "John Doe" } } } } } },
      responses: { 201: { description: "zego created successfully" }, 400: { description: "Validation error" } }
    }
  }
};