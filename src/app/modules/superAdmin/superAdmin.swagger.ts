export const superAdminSwaggerDocs = {
  "/api/v1/superAdmin/create/organizer": {
    post: {
      tags: ["Super Admin"],
      summary: "Create new organizer",
      description: "Create a new organizer account (Super Admin only).",
      security: [{ AuthorizationToken: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "name"],
              properties: {
                email: { type: "string", format: "email", example: "organizer@example.com" },
                name: { type: "string", example: "Event Organizer Inc." },
              },
            },
          },
        },
      },
      responses: {
        201: { description: "Organizer created successfully" },
        400: { description: "Validation error" },
        401: { description: "Unauthorized" },
        403: { description: "Forbidden - Super Admin only" },
      },
    },
  },

  "/api/v1/superAdmin/organizers": {
    get: {
      tags: ["Super Admin"],
      summary: "Get all organizers",
      description: "Retrieve a list of all organizers on the platform.",
      security: [{ AuthorizationToken: [] }],
      responses: {
        200: {
          description: "Organizers retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  data: {
                    type: "array",
                    items: { type: "object" },
                  },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized" },
        403: { description: "Forbidden" },
      },
    },
  },

  "/api/v1/superAdmin/organizers/{id}": {
    get: {
      tags: ["Super Admin"],
      summary: "Get specific organizer",
      description: "Get details of a specific organizer by ID.",
      security: [{ AuthorizationToken: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Organizer ID",
        },
      ],
      responses: {
        200: { description: "Organizer details retrieved successfully" },
        404: { description: "Organizer not found" },
        401: { description: "Unauthorized" },
      },
    },
  },

  "/api/v1/superAdmin/create/event": {
    post: {
      tags: ["Super Admin"],
      summary: "Create event",
      description: "Create a new event on behalf of an organizer (Super Admin only).",
      security: [{ AuthorizationToken: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "organizerId"],
              properties: {
                name: { type: "string", example: "Tech Conference 2026" },
                description: { type: "string", example: "Annual technology conference" },
                organizerId: { type: "string", example: "507f1f77bcf86cd799439011" },
                startDate: { type: "string", format: "date", example: "2026-06-01" },
                endDate: { type: "string", format: "date", example: "2026-06-03" },
              },
            },
          },
        },
      },
      responses: {
        201: { description: "Event created successfully" },
        400: { description: "Validation error" },
        401: { description: "Unauthorized" },
      },
    },
  },

  "/api/v1/superAdmin/organizers/{id}/events": {
    get: {
      tags: ["Super Admin"],
      summary: "Get organizer events",
      description: "Get all events associated with a specific organizer.",
      security: [{ AuthorizationToken: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Organizer ID",
        },
      ],
      responses: {
        200: { description: "Events retrieved successfully" },
        401: { description: "Unauthorized" },
        404: { description: "Organizer not found" },
      },
    },
  },

  "/api/v1/superAdmin/events": {
    get: {
      tags: ["Super Admin"],
      summary: "Get all events",
      description: "Get all events on the platform (public endpoint).",
      responses: {
        200: { description: "Events retrieved successfully" },
        500: { description: "Internal server error" },
      },
    },
  },

  "/api/v1/superAdmin/events/{eventId}": {
    get: {
      tags: ["Super Admin"],
      summary: "Get event details",
      description: "Get detailed information about a specific event (public endpoint).",
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
        404: { description: "Event not found" },
      },
    },
    patch: {
      tags: ["Super Admin"],
      summary: "Update event",
      description: "Update event details (Super Admin only).",
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
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: { type: "string", example: "Updated Event Name" },
                description: { type: "string" },
                startDate: { type: "string", format: "date" },
                endDate: { type: "string", format: "date" },
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
    delete: {
      tags: ["Super Admin"],
      summary: "Delete event",
      description: "Delete an event (Super Admin only).",
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
        200: { description: "Event deleted successfully" },
        401: { description: "Unauthorized" },
        404: { description: "Event not found" },
      },
    },
  },

  "/api/v1/superAdmin/organizers/{organizerId}/events/{eventId}": {
    get: {
      tags: ["Super Admin"],
      summary: "Get specific event of organizer",
      description: "Get details of a specific event belonging to an organizer.",
      security: [{ AuthorizationToken: [] }],
      parameters: [
        {
          name: "organizerId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Organizer ID",
        },
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
        404: { description: "Event or organizer not found" },
        401: { description: "Unauthorized" },
      },
    },
  },

  "/api/v1/superAdmin/users": {
    get: {
      tags: ["Super Admin"],
      summary: "Get all users",
      description: "Get a list of all users on the platform (Super Admin only).",
      security: [{ AuthorizationToken: [] }],
      responses: {
        200: { description: "Users retrieved successfully" },
        401: { description: "Unauthorized" },
        403: { description: "Forbidden" },
      },
    },
  },

  "/api/v1/superAdmin/users/{userId}": {
    get: {
      tags: ["Super Admin"],
      summary: "Get user details",
      description: "Get detailed information about a specific user.",
      security: [{ AuthorizationToken: [] }],
      parameters: [
        {
          name: "userId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "User ID",
        },
      ],
      responses: {
        200: { description: "User details retrieved successfully" },
        404: { description: "User not found" },
        401: { description: "Unauthorized" },
      },
    },
    delete: {
      tags: ["Super Admin"],
      summary: "Delete user",
      description: "Delete a user account (Super Admin only).",
      security: [{ AuthorizationToken: [] }],
      parameters: [
        {
          name: "userId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "User ID",
        },
      ],
      responses: {
        200: { description: "User deleted successfully" },
        404: { description: "User not found" },
        401: { description: "Unauthorized" },
      },
    },
  },

  "/api/v1/superAdmin/singleEvent/{eventId}/overview": {
    get: {
      tags: ["Super Admin"],
      summary: "Get event overview",
      description: "Get comprehensive overview of a single event including stats and summaries.",
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
        200: { description: "Event overview retrieved successfully" },
        404: { description: "Event not found" },
        401: { description: "Unauthorized" },
      },
    },
  },

  "/api/v1/superAdmin/dashboard/overview": {
    get: {
      tags: ["Super Admin"],
      summary: "Get dashboard overview",
      description: "Get platform-wide dashboard statistics (Super Admin only).",
      security: [{ AuthorizationToken: [] }],
      responses: {
        200: { description: "Dashboard overview retrieved successfully" },
        401: { description: "Unauthorized" },
      },
    },
  },

  "/api/v1/superAdmin/events-trend": {
    get: {
      tags: ["Super Admin"],
      summary: "Get events trend",
      description: "Get event trend analytics across the platform (Super Admin only).",
      security: [{ AuthorizationToken: [] }],
      responses: {
        200: { description: "Events trend retrieved successfully" },
        401: { description: "Unauthorized" },
      },
    },
  },
};
