export const organizerBoothSwaggerDocs = {
  "/api/organizerBooth/create": {
    post: {
      tags: ["organizerBooth"],
      summary: "organizerBooth create",
      description: "This is auto generated organizerBooth create API",
      requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["name"], properties: { name: { type: "string", example: "John Doe" } } } } } },
      responses: { 201: { description: "organizerBooth created successfully" }, 400: { description: "Validation error" } }
    }
  }
};