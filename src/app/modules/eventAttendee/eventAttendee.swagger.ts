export const eventAttendeeSwaggerDocs = {
  "/api/eventAttendee/create": {
    post: {
      tags: ["eventAttendee"],
      summary: "eventAttendee create",
      description: "This is auto generated eventAttendee create API",
      requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["name"], properties: { name: { type: "string", example: "John Doe" } } } } } },
      responses: { 201: { description: "eventAttendee created successfully" }, 400: { description: "Validation error" } }
    }
  }
};