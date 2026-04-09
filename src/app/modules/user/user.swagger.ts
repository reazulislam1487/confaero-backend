export const userSwaggerDocs = {
  "/api/v1/user/update-profile": {
    patch: {
      tags: ["User"],
      summary: "Update user profile",
      description: "Update the authenticated user's profile information including image and resume.",
      security: [{ AuthorizationToken: [] }],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                data: {
                  type: "string",
                  description: "JSON string containing profile data",
                },
                image: {
                  type: "string",
                  format: "binary",
                  description: "Profile image file",
                },
                resume: {
                  type: "string",
                  format: "binary",
                  description: "Resume file (PDF)",
                },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Profile updated successfully" },
        400: { description: "Validation error" },
        401: { description: "Unauthorized" },
      },
    },
  },

  "/api/v1/user/update-profile/organizer": {
    patch: {
      tags: ["User"],
      summary: "Update organizer profile",
      description: "Update organizer-specific profile information with image upload.",
      security: [{ AuthorizationToken: [] }],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                data: {
                  type: "string",
                  description: "JSON string containing organizer profile data",
                },
                image: {
                  type: "string",
                  format: "binary",
                  description: "Profile image file",
                },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Organizer profile updated successfully" },
        400: { description: "Validation error" },
        401: { description: "Unauthorized" },
        403: { description: "Forbidden - Not authorized" },
      },
    },
  },

  "/api/v1/user/delete-resume": {
    delete: {
      tags: ["User"],
      summary: "Delete resume",
      description: "Delete the authenticated user's uploaded resume file.",
      security: [{ AuthorizationToken: [] }],
      responses: {
        200: { description: "Resume deleted successfully" },
        401: { description: "Unauthorized" },
        404: { description: "Resume not found" },
      },
    },
  },

  "/api/v1/user/my-profile": {
    get: {
      tags: ["User"],
      summary: "Get my profile",
      description: "Get the authenticated user's complete profile information.",
      security: [{ AuthorizationToken: [] }],
      responses: {
        200: {
          description: "Profile retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  data: { type: "object" },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized" },
      },
    },
  },

  "/api/v1/user/my-profile/organizer": {
    get: {
      tags: ["User"],
      summary: "Get organizer profile",
      description: "Get organizer-specific profile information for the authenticated user.",
      security: [{ AuthorizationToken: [] }],
      responses: {
        200: {
          description: "Organizer profile retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  data: { type: "object" },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized" },
        403: { description: "Forbidden - Not authorized" },
      },
    },
  },
};
