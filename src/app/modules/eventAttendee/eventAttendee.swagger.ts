export const eventAttendeeSwaggerDocs = {
  "/api/v1/eventAttendee/events/{eventId}/attendees": {
    get: {
      tags: ["Event Attendee"],
      summary: "Get event attendees",
      description: "Get all attendees for a specific event.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" }],
      responses: { 200: { description: "Attendees retrieved successfully" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/eventAttendee/events/{eventId}/attendees/{accountId}": {
    get: {
      tags: ["Event Attendee"],
      summary: "Get attendee detail",
      description: "Get details of a specific attendee at an event.",
      security: [{ AuthorizationToken: [] }],
      parameters: [
        { name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" },
        { name: "accountId", in: "path", required: true, schema: { type: "string" }, description: "Account ID" },
      ],
      responses: { 200: { description: "Attendee details retrieved successfully" }, 401: { description: "Unauthorized" }, 404: { description: "Attendee not found" } },
    },
    patch: {
      tags: ["Event Attendee"],
      summary: "Toggle bookmark",
      description: "Toggle bookmark status for an attendee.",
      security: [{ AuthorizationToken: [] }],
      parameters: [
        { name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" },
        { name: "accountId", in: "path", required: true, schema: { type: "string" }, description: "Account ID" },
      ],
      responses: { 200: { description: "Bookmark toggled successfully" }, 401: { description: "Unauthorized" }, 404: { description: "Attendee not found" } },
    },
  },
};
