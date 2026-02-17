export const eventLiveSwaggerDocs = {
  "/api/eventLive/create": {
    post: {
      tags: ["eventLive"],
      summary: "eventLive create",
      description: "This is auto generated eventLive create API",
      requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["name"], properties: { name: { type: "string", example: "John Doe" } } } } } },
      responses: { 201: { description: "eventLive created successfully" }, 400: { description: "Validation error" } }
    }
  }
};