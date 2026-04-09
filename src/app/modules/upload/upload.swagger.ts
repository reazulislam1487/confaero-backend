export const uploadSwaggerDocs = {
  "/api/v1/upload/chat-attachment": {
    post: {
      tags: ["Upload"],
      summary: "Upload chat attachment",
      description: "Upload a file as a chat attachment.",
      security: [{ AuthorizationToken: [] }],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["file"],
              properties: {
                file: { type: "string", format: "binary", description: "File to upload" },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "File uploaded successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  data: {
                    type: "object",
                    properties: {
                      url: { type: "string", example: "https://..." },
                      fileName: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
        400: { description: "No file provided" },
        401: { description: "Unauthorized" },
      },
    },
  },
};
