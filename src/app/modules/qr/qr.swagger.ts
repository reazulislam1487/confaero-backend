export const qrSwaggerDocs = {
  "/api/qr/create": {
    post: {
      tags: ["qr"],
      summary: "qr create",
      description: "This is auto generated qr create API",
      requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["name"], properties: { name: { type: "string", example: "John Doe" } } } } } },
      responses: { 201: { description: "qr created successfully" }, 400: { description: "Validation error" } }
    }
  }
};