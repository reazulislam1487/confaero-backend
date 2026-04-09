export const photoSwaggerDocs = {
  "/api/v1/photo/events/{eventId}/photos": {
    post: {
      tags: ["Photo"],
      summary: "Create photo",
      description: "Add a new photo to an event gallery.",
      parameters: [{ name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" }],
      requestBody: {
        required: true,
        content: { "application/json": { schema: { type: "object", properties: { url: { type: "string" }, caption: { type: "string" } } } } },
      },
      responses: { 201: { description: "Photo added successfully" }, 400: { description: "Validation error" } },
    },
    get: {
      tags: ["Photo"],
      summary: "Get event photos",
      description: "Get all photos from an event gallery.",
      parameters: [{ name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" }],
      responses: { 200: { description: "Photos retrieved successfully" } },
    },
  },

  "/api/v1/photo/photos/{photoId}": {
    delete: {
      tags: ["Photo"],
      summary: "Delete photo",
      description: "Delete a photo from the event gallery.",
      parameters: [{ name: "photoId", in: "path", required: true, schema: { type: "string" }, description: "Photo ID" }],
      responses: { 200: { description: "Photo deleted successfully" }, 404: { description: "Photo not found" } },
    },
  },

  "/api/v1/photo/public/events/{eventId}/photos": {
    get: {
      tags: ["Photo"],
      summary: "Get public event photos",
      description: "Get public photos from an event gallery (public endpoint).",
      parameters: [{ name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" }],
      responses: { 200: { description: "Public photos retrieved successfully" } },
    },
  },
};
