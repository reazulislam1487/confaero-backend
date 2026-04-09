export const organizerSessionSwaggerDocs = {
  "/api/v1/organizer-sessions/events/{eventId}/sessions": {
    get: {
      tags: ["Organizer Sessions"],
      summary: "Get sessions",
      description: "Get all sessions for a specific event (Organizer/Super Admin only).",
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
        200: { description: "Sessions retrieved successfully" },
        401: { description: "Unauthorized" },
        404: { description: "Event not found" },
      },
    },
    post: {
      tags: ["Organizer Sessions"],
      summary: "Add session",
      description: "Add a new session to an event. Supports floor map image upload.",
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
                title: { type: "string", example: "Opening Keynote" },
                description: { type: "string" },
                startTime: { type: "string", format: "date-time" },
                endTime: { type: "string", format: "date-time" },
                location: { type: "string" },
                floorMap: { type: "string", format: "binary", description: "Floor map image file" },
              },
            },
          },
        },
      },
      responses: {
        201: { description: "Session added successfully" },
        400: { description: "Validation error" },
        401: { description: "Unauthorized" },
      },
    },
  },

  "/api/v1/organizer-sessions/events/{eventId}/sessions/{sessionId}": {
    get: {
      tags: ["Organizer Sessions"],
      summary: "Get single session",
      description: "Get details of a specific session.",
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
          name: "sessionId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Session ID",
        },
      ],
      responses: {
        200: { description: "Session details retrieved successfully" },
        401: { description: "Unauthorized" },
        404: { description: "Session not found" },
      },
    },
    patch: {
      tags: ["Organizer Sessions"],
      summary: "Update session",
      description: "Update session details. Supports floor map image upload.",
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
          name: "sessionId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Session ID",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                title: { type: "string" },
                description: { type: "string" },
                startTime: { type: "string", format: "date-time" },
                endTime: { type: "string", format: "date-time" },
                location: { type: "string" },
                floorMap: { type: "string", format: "binary", description: "Floor map image file" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Session updated successfully" },
        400: { description: "Validation error" },
        401: { description: "Unauthorized" },
        404: { description: "Session not found" },
      },
    },
    delete: {
      tags: ["Organizer Sessions"],
      summary: "Delete session",
      description: "Delete a specific session from an event.",
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
          name: "sessionId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Session ID",
        },
      ],
      responses: {
        200: { description: "Session deleted successfully" },
        401: { description: "Unauthorized" },
        404: { description: "Session not found" },
      },
    },
  },

  "/api/v1/organizer-sessions/events/{eventId}/sessions/upload-csv": {
    post: {
      tags: ["Organizer Sessions"],
      summary: "Upload sessions via CSV",
      description: "Bulk upload sessions using a CSV file.",
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
              required: ["file"],
              properties: {
                file: { type: "string", format: "binary", description: "CSV file containing session data" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Sessions uploaded successfully" },
        400: { description: "Invalid CSV file" },
        401: { description: "Unauthorized" },
      },
    },
  },

  "/api/v1/organizer-sessions/events/{eventId}/agenda": {
    get: {
      tags: ["Organizer Sessions"],
      summary: "Get all sessions (agenda view)",
      description: "Get all sessions for agenda view (event attendees with event access).",
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
        200: { description: "Agenda sessions retrieved successfully" },
        401: { description: "Unauthorized" },
        403: { description: "Forbidden - No event access" },
      },
    },
  },

  "/api/v1/organizer-sessions/events/{eventId}/my-agenda": {
    get: {
      tags: ["Organizer Sessions"],
      summary: "Get my agenda",
      description: "Get sessions bookmarked by the authenticated user.",
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
        200: { description: "My agenda retrieved successfully" },
        401: { description: "Unauthorized" },
      },
    },
  },

  "/api/v1/organizer-sessions/events/{eventId}/my-agenda/{sessionIndex}": {
    post: {
      tags: ["Organizer Sessions"],
      summary: "Add to my agenda",
      description: "Bookmark a session to add it to user's personal agenda.",
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
          name: "sessionIndex",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Session index identifier",
        },
      ],
      responses: {
        200: { description: "Session added to agenda successfully" },
        401: { description: "Unauthorized" },
        404: { description: "Session not found" },
      },
    },
    delete: {
      tags: ["Organizer Sessions"],
      summary: "Remove from my agenda",
      description: "Remove a bookmarked session from user's personal agenda.",
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
          name: "sessionIndex",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Session index identifier",
        },
      ],
      responses: {
        200: { description: "Session removed from agenda successfully" },
        401: { description: "Unauthorized" },
        404: { description: "Session not found" },
      },
    },
  },

  "/api/v1/organizer-sessions/events/{eventId}/agenda/{sessionIndex}": {
    get: {
      tags: ["Organizer Sessions"],
      summary: "Get single agenda session",
      description: "Get details of a specific session in agenda view.",
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
          name: "sessionIndex",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Session index identifier",
        },
      ],
      responses: {
        200: { description: "Session details retrieved successfully" },
        401: { description: "Unauthorized" },
        404: { description: "Session not found" },
      },
    },
  },

  "/api/v1/organizer-sessions/events/{eventId}/speakers/{speakerId}": {
    get: {
      tags: ["Organizer Sessions"],
      summary: "Get speaker profile",
      description: "Get profile information of a specific speaker for an event.",
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
          name: "speakerId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Speaker ID",
        },
      ],
      responses: {
        200: { description: "Speaker profile retrieved successfully" },
        401: { description: "Unauthorized" },
        404: { description: "Speaker not found" },
      },
    },
  },

  "/api/v1/organizer-sessions/agenda/{eventId}/{sessionIndex}/toggle-like": {
    patch: {
      tags: ["Organizer Sessions"],
      summary: "Toggle like agenda session",
      description: "Toggle like status for a session in the agenda.",
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
          name: "sessionIndex",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Session index identifier",
        },
      ],
      responses: {
        200: { description: "Like status toggled successfully" },
        401: { description: "Unauthorized" },
        404: { description: "Session not found" },
      },
    },
  },

  "/api/v1/organizer-sessions/events/{eventId}/agenda/{sessionIndex}/speakers/{speakerId}": {
    post: {
      tags: ["Organizer Sessions"],
      summary: "Assign speaker to session",
      description: "Assign a speaker to a specific session.",
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
          name: "sessionIndex",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Session index identifier",
        },
        {
          name: "speakerId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Speaker ID",
        },
      ],
      responses: {
        200: { description: "Speaker assigned successfully" },
        400: { description: "Validation error" },
        401: { description: "Unauthorized" },
      },
    },
    delete: {
      tags: ["Organizer Sessions"],
      summary: "Remove speaker from session",
      description: "Remove a speaker from a specific session.",
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
          name: "sessionIndex",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Session index identifier",
        },
        {
          name: "speakerId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Speaker ID",
        },
      ],
      responses: {
        200: { description: "Speaker removed successfully" },
        401: { description: "Unauthorized" },
        404: { description: "Session or speaker not found" },
      },
    },
  },

  "/api/v1/organizer-sessions/event/{eventId}/speakers/search": {
    get: {
      tags: ["Organizer Sessions"],
      summary: "Search speaker by email",
      description: "Search for speakers by email address for an event.",
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
          name: "email",
          in: "query",
          required: true,
          schema: { type: "string", format: "email" },
          description: "Speaker email to search",
        },
      ],
      responses: {
        200: { description: "Search results retrieved successfully" },
        401: { description: "Unauthorized" },
      },
    },
  },
};
