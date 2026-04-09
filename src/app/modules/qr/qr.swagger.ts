export const qrSwaggerDocs = {
  "/api/v1/qr/generate/{eventId}": {
    get: {
      tags: ["QR"],
      summary: "Generate QR",
      description: "Generate a QR code for event check-in.",
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
        200: {
          description: "QR code generated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  data: {
                    type: "object",
                    properties: {
                      qrCode: { type: "string", example: "data:image/png;base64,..." },
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

  "/api/v1/qr/scan/{eventId}": {
    post: {
      tags: ["QR"],
      summary: "Scan QR",
      description: "Scan a QR code for event check-in.",
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
              required: ["qrData"],
              properties: {
                qrData: { type: "string", example: "scanned-qr-token" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "QR scanned successfully" },
        400: { description: "Invalid QR code" },
        401: { description: "Unauthorized" },
      },
    },
  },

  "/api/v1/qr/volunteer/{eventId}": {
    get: {
      tags: ["QR"],
      summary: "Get volunteer check-in history",
      description: "Get check-in history for a volunteer at an event.",
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
        200: { description: "Check-in history retrieved successfully" },
        401: { description: "Unauthorized" },
        403: { description: "Forbidden - Volunteer only" },
      },
    },
  },

  "/api/v1/qr/exhibitor/{eventId}/leads": {
    get: {
      tags: ["QR"],
      summary: "Get exhibitor leads",
      description: "Get all leads captured by an exhibitor at an event.",
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
        200: { description: "Leads retrieved successfully" },
        401: { description: "Unauthorized" },
        403: { description: "Forbidden - Exhibitor/Staff only" },
      },
    },
  },

  "/api/v1/qr/exhibitor/leads/{leadId}/note": {
    patch: {
      tags: ["QR"],
      summary: "Update lead note",
      description: "Update the note for a specific lead.",
      security: [{ AuthorizationToken: [] }],
      parameters: [
        {
          name: "leadId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Lead ID",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                note: { type: "string", example: "Interested in product demo" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Lead note updated successfully" },
        401: { description: "Unauthorized" },
        404: { description: "Lead not found" },
      },
    },
  },

  "/api/v1/qr/exhibitor/leads/{leadId}/tags": {
    patch: {
      tags: ["QR"],
      summary: "Update lead tags",
      description: "Update tags for a specific lead.",
      security: [{ AuthorizationToken: [] }],
      parameters: [
        {
          name: "leadId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Lead ID",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                tags: {
                  type: "array",
                  items: { type: "string" },
                  example: ["hot", "follow-up"],
                },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Lead tags updated successfully" },
        401: { description: "Unauthorized" },
        404: { description: "Lead not found" },
      },
    },
  },
};
