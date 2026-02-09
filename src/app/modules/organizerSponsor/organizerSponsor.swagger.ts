export const organizerSponsorSwaggerDocs = {
  "/api/organizerSponsor/create": {
    post: {
      tags: ["organizerSponsor"],
      summary: "organizerSponsor create",
      description: "This is auto generated organizerSponsor create API",
      requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["name"], properties: { name: { type: "string", example: "John Doe" } } } } } },
      responses: { 201: { description: "organizerSponsor created successfully" }, 400: { description: "Validation error" } }
    }
  }
};