export const invitationSwaggerDocs = {
  "/api/v1/invitation/create/{eventId}": {
    post: {
      tags: ["Invitation"],
      summary: "Send invitation",
      description: "Send a role-based invitation for an event.",
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
              required: ["email", "role"],
              properties: {
                email: { type: "string", format: "email", example: "invitee@example.com" },
                role: {
                  type: "string",
                  enum: ["SPEAKER", "EXHIBITOR", "SPONSOR", "VOLUNTEER", "ABSTRACT_REVIEWER", "TRACK_CHAIR"],
                  example: "SPEAKER",
                },
                name: { type: "string", example: "John Doe" },
              },
            },
          },
        },
      },
      responses: {
        201: { description: "Invitation sent successfully" },
        400: { description: "Validation error" },
        401: { description: "Unauthorized" },
      },
    },
  },

  "/api/v1/invitation/{invitationId}/accept/{eventId}": {
    patch: {
      tags: ["Invitation"],
      summary: "Accept invitation",
      description: "Accept an event invitation.",
      security: [{ AuthorizationToken: [] }],
      parameters: [
        {
          name: "invitationId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Invitation ID",
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
        200: { description: "Invitation accepted successfully" },
        401: { description: "Unauthorized" },
        404: { description: "Invitation not found" },
      },
    },
  },

  "/api/v1/invitation/{invitationId}/reject/{eventId}": {
    patch: {
      tags: ["Invitation"],
      summary: "Reject invitation",
      description: "Reject an event invitation.",
      security: [{ AuthorizationToken: [] }],
      parameters: [
        {
          name: "invitationId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Invitation ID",
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
        200: { description: "Invitation rejected successfully" },
        401: { description: "Unauthorized" },
        404: { description: "Invitation not found" },
      },
    },
  },

  "/api/v1/invitation/my-invitations": {
    get: {
      tags: ["Invitation"],
      summary: "Get my invitations",
      description: "Get all invitations received by the authenticated user.",
      security: [{ AuthorizationToken: [] }],
      responses: {
        200: { description: "Invitations retrieved successfully" },
        401: { description: "Unauthorized" },
      },
    },
  },

  "/api/v1/invitation/my-invitations/{invitedId}": {
    get: {
      tags: ["Invitation"],
      summary: "Get invitation details",
      description: "Get details of a specific invitation.",
      security: [{ AuthorizationToken: [] }],
      parameters: [
        {
          name: "invitedId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Invitation ID",
        },
      ],
      responses: {
        200: { description: "Invitation details retrieved successfully" },
        401: { description: "Unauthorized" },
        404: { description: "Invitation not found" },
      },
    },
  },

  "/api/v1/invitation/event/{eventId}": {
    get: {
      tags: ["Invitation"],
      summary: "Get event invitations",
      description: "Get all invitations for a specific event.",
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
        200: { description: "Event invitations retrieved successfully" },
        401: { description: "Unauthorized" },
        404: { description: "Event not found" },
      },
    },
  },

  "/api/v1/invitation/{invitationId}/resend/{eventId}": {
    post: {
      tags: ["Invitation"],
      summary: "Resend invitation",
      description: "Resend an invitation email to an invitee.",
      security: [{ AuthorizationToken: [] }],
      parameters: [
        {
          name: "invitationId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Invitation ID",
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
        200: { description: "Invitation resent successfully" },
        401: { description: "Unauthorized" },
        404: { description: "Invitation not found" },
      },
    },
  },

  "/api/v1/invitation/{invitationId}/{eventId}": {
    delete: {
      tags: ["Invitation"],
      summary: "Delete invitation",
      description: "Delete an event invitation.",
      security: [{ AuthorizationToken: [] }],
      parameters: [
        {
          name: "invitationId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Invitation ID",
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
        200: { description: "Invitation deleted successfully" },
        401: { description: "Unauthorized" },
        404: { description: "Invitation not found" },
      },
    },
  },

  "/api/v1/invitation/{eventId}/sessions": {
    get: {
      tags: ["Invitation"],
      summary: "Get event sessions",
      description: "Get all sessions for an event (for invitation management).",
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

  "/api/v1/invitation/{eventId}/make-speaker": {
    post: {
      tags: ["Invitation"],
      summary: "Make speaker directly",
      description: "Directly assign speaker role to a user without invitation flow.",
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
              required: ["email"],
              properties: {
                email: { type: "string", format: "email", example: "speaker@example.com" },
                name: { type: "string", example: "John Doe" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Speaker added successfully" },
        400: { description: "Validation error" },
        401: { description: "Unauthorized" },
      },
    },
  },
};
