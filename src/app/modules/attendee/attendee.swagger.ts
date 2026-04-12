export const attendeeSwaggerDocs = {
  "/api/v1/attendee/events": {
    get: {
      tags: ["Attendee"],
      summary: "Get upcoming events",
      description:
        "Get all upcoming events available for registration (non-organizer roles).",
      security: [{ AuthorizationToken: [] }],
      responses: {
        200: { description: "Upcoming events retrieved successfully" },
        401: { description: "Unauthorized" },
      },
    },
  },

  "/api/v1/attendee/events/{eventId}/initiate-registration": {
    post: {
      tags: ["Attendee"],
      summary: "Register for event",
      description:
        "Initiate registration process for an event. May include payment integration.",
      security: [{ AuthorizationToken: [] }],
      parameters: [
        {
          name: "eventId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Event ID",
        },
      ],
      responses: {
        200: { description: "Registration initiated successfully" },
        400: { description: "Validation error" },
        401: { description: "Unauthorized" },
        404: { description: "Event not found" },
      },
    },
  },

  // "/api/v1/attendee/my-event": {
  //   get: {
  //     tags: ["Attendee"],
  //     summary: "Get my registered events",
  //     description: "Get all events the user is registered for.",
  //     security: [{ AuthorizationToken: [] }],
  //     responses: {
  //       200: { description: "Registered events retrieved successfully" },
  //       401: { description: "Unauthorized" },
  //     },
  //   },
  // },

  "/api/v1/attendee/my-event": {
    get: {
      tags: ["Attendee"],
      summary: "Get my events and invitations",
      description:
        "Get all events where the user is registered OR invited. Returns a unified list with status field (REGISTERED or INVITED). No duplicates.",
      security: [{ AuthorizationToken: [] }],
      responses: {
        200: {
          description: "Events and invitations fetched successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean" },
                  message: { type: "string" },
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        event: {
                          type: "object",
                          properties: {
                            _id: { type: "string" },
                            title: { type: "string" },
                            startDate: { type: "string", format: "date-time" },
                            endDate: { type: "string", format: "date-time" },
                            bannerImageUrl: { type: "string" },
                            location: { type: "string" },
                          },
                        },
                        status: {
                          type: "string",
                          enum: ["REGISTERED", "INVITED"],
                          description:
                            "REGISTERED = user joined, INVITED = pending invitation",
                        },
                        invitationRole: {
                          type: "string",
                          description:
                            "Only present if status is INVITED. The role invited (SPEAKER, STAFF, etc.)",
                        },
                      },
                    },
                  },
                },
              },
              examples: {
                success: {
                  value: {
                    success: true,
                    message: "My events and invitations fetched successfully",
                    data: [
                      {
                        event: {
                          _id: "event123",
                          title: "Tech Conference 2026",
                          startDate: "2026-05-01T09:00:00.000Z",
                          endDate: "2026-05-03T18:00:00.000Z",
                          bannerImageUrl: "https://example.com/banner.jpg",
                          location: "New York",
                        },
                        status: "REGISTERED",
                      },
                      {
                        event: {
                          _id: "event456",
                          title: "AI Summit",
                          startDate: "2026-06-10T09:00:00.000Z",
                          endDate: "2026-06-12T18:00:00.000Z",
                          bannerImageUrl: "https://example.com/ai-banner.jpg",
                          location: "San Francisco",
                        },
                        status: "INVITED",
                        invitationRole: "SPEAKER",
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized" },
      },
    },
  },

  "/api/v1/attendee/my-events/{eventId}": {
    get: {
      tags: ["Attendee"],
      summary: "Get my event details",
      description:
        "Get details of a specific event the user is registered for.",
      security: [{ AuthorizationToken: [] }],
      parameters: [
        {
          name: "eventId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Event ID",
        },
      ],
      responses: {
        200: { description: "Event details retrieved successfully" },
        401: { description: "Unauthorized" },
        404: { description: "Event not found" },
      },
    },
  },

  "/api/v1/attendee/events/{eventId}": {
    get: {
      tags: ["Attendee"],
      summary: "Get single event",
      description: "Get details of a specific event.",
      security: [{ AuthorizationToken: [] }],
      parameters: [
        {
          name: "eventId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Event ID",
        },
      ],
      responses: {
        200: { description: "Event details retrieved successfully" },
        401: { description: "Unauthorized" },
        404: { description: "Event not found" },
      },
    },
  },

  "/api/v1/attendee/events/{eventId}/sessions": {
    get: {
      tags: ["Attendee"],
      summary: "Get event sessions",
      description: "Get all sessions for a specific event.",
      security: [{ AuthorizationToken: [] }],
      parameters: [
        {
          name: "eventId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Event ID",
        },
      ],
      responses: {
        200: { description: "Event sessions retrieved successfully" },
        401: { description: "Unauthorized" },
      },
    },
  },

  "/api/v1/attendee/events/{eventId}/home": {
    get: {
      tags: ["Attendee"],
      summary: "Get event home data",
      description:
        "Get home page data for a specific event including announcements, sessions, etc.",
      security: [{ AuthorizationToken: [] }],
      parameters: [
        {
          name: "eventId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Event ID",
        },
      ],
      responses: {
        200: { description: "Event home data retrieved successfully" },
        401: { description: "Unauthorized" },
      },
    },
  },

  "/api/v1/attendee/events/{eventId}/qr-token": {
    get: {
      tags: ["Attendee"],
      summary: "Generate QR token",
      description: "Generate a QR code token for event check-in.",
      security: [{ AuthorizationToken: [] }],
      parameters: [
        {
          name: "eventId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Event ID",
        },
      ],
      responses: {
        200: { description: "QR token generated successfully" },
        401: { description: "Unauthorized" },
      },
    },
  },

  "/api/v1/attendee/event/{eventId}/join": {
    patch: {
      tags: ["Attendee"],
      summary: "Join event",
      description: "Join an event session.",
      security: [{ AuthorizationToken: [] }],
      parameters: [
        {
          name: "eventId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Event ID",
        },
      ],
      responses: {
        200: { description: "Joined event successfully" },
        401: { description: "Unauthorized" },
        404: { description: "Event not found" },
      },
    },
  },
};
