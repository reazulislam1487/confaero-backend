export const organizerSwaggerDocs = {
  "/api/v1/organizer/events": {
    get: {
      tags: ["Organizer"],
      summary: "Get my events",
      description: "Get all events managed by the authenticated organizer.",
      security: [{ AuthorizationToken: [] }],
      responses: {
        200: {
          description: "Events retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  data: { type: "array", items: { type: "object" } },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized" },
      },
    },
  },

  "/api/v1/organizer/all-register/{eventId}": {
    get: {
      tags: ["Organizer"],
      summary: "Get all registered users",
      description: "Get all users registered for a specific event.",
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
        200: { description: "Registered users retrieved successfully" },
        401: { description: "Unauthorized" },
        404: { description: "Event not found" },
      },
    },
  },

  "/api/v1/organizer/events/{eventId}": {
    patch: {
      tags: ["Organizer"],
      summary: "Update event",
      description: "Update event details including banner and floor map images.",
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
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                name: { type: "string", example: "Updated Event Name" },
                description: { type: "string" },
                banner: { type: "string", format: "binary", description: "Banner image file" },
                floorMapImage: { type: "string", format: "binary", description: "Floor map image file" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Event updated successfully" },
        400: { description: "Validation error" },
        401: { description: "Unauthorized" },
        404: { description: "Event not found" },
      },
    },
  },

  "/api/v1/organizer/events/{eventId}/floormaps": {
    get: {
      tags: ["Organizer"],
      summary: "Get event floor maps",
      description: "Get all floor maps for a specific event.",
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
        200: { description: "Floor maps retrieved successfully" },
        401: { description: "Unauthorized" },
        404: { description: "Event not found" },
      },
    },
  },

  "/api/v1/organizer/events/{eventId}/floormaps/{floorMapId}": {
    delete: {
      tags: ["Organizer"],
      summary: "Delete floor map",
      description: "Delete a specific floor map from an event.",
      security: [{ AuthorizationToken: [] }],
      parameters: [
        {
          name: "eventId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Event ID",
        },
        {
          name: "floorMapId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Floor map ID",
        },
      ],
      responses: {
        200: { description: "Floor map deleted successfully" },
        401: { description: "Unauthorized" },
        404: { description: "Floor map not found" },
      },
    },
  },

  "/api/v1/organizer/attendee/{eventId}/{accountId}": {
    delete: {
      tags: ["Organizer"],
      summary: "Remove attendee",
      description: "Remove an attendee from a specific event.",
      security: [{ AuthorizationToken: [] }],
      parameters: [
        {
          name: "eventId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Event ID",
        },
        {
          name: "accountId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Attendee account ID",
        },
      ],
      responses: {
        200: { description: "Attendee removed successfully" },
        401: { description: "Unauthorized" },
        404: { description: "Attendee not found" },
      },
    },
    get: {
      tags: ["Organizer"],
      summary: "Get attendee details",
      description: "Get detailed information about a specific attendee.",
      security: [{ AuthorizationToken: [] }],
      parameters: [
        {
          name: "eventId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Event ID",
        },
        {
          name: "accountId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Attendee account ID",
        },
      ],
      responses: {
        200: { description: "Attendee details retrieved successfully" },
        401: { description: "Unauthorized" },
        404: { description: "Attendee not found" },
      },
    },
  },

  "/api/v1/organizer/stripe/status": {
    get: {
      tags: ["Organizer"],
      summary: "Get Stripe status",
      description: "Check the Stripe Connect account status for the organizer.",
      security: [{ AuthorizationToken: [] }],
      responses: {
        200: { description: "Stripe status retrieved successfully" },
        401: { description: "Unauthorized" },
      },
    },
  },

  "/api/v1/organizer/stripe/connect": {
    post: {
      tags: ["Organizer"],
      summary: "Connect Stripe account",
      description: "Initiate Stripe Connect account setup for the organizer.",
      security: [{ AuthorizationToken: [] }],
      responses: {
        200: { description: "Stripe connection initiated successfully" },
        400: { description: "Bad request" },
        401: { description: "Unauthorized" },
      },
    },
  },

  "/api/v1/organizer/stripe/onboarding-link": {
    get: {
      tags: ["Organizer"],
      summary: "Get Stripe onboarding link",
      description: "Get the Stripe Express onboarding URL for the organizer.",
      security: [{ AuthorizationToken: [] }],
      responses: {
        200: {
          description: "Onboarding link retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  data: {
                    type: "object",
                    properties: {
                      url: { type: "string", example: "https://connect.stripe.com/express/..." },
                    },
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
};
