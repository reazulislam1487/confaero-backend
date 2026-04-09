export const reportSwaggerDocs = {
  "/api/v1/report/report": {
    post: {
      tags: ["Report"],
      summary: "Report task issue",
      description: "Report an issue with a task (volunteer only).",
      security: [{ AuthorizationToken: [] }],
      requestBody: {
        required: true,
        content: { "application/json": { schema: { type: "object", required: ["taskId", "description"], properties: { taskId: { type: "string" }, description: { type: "string", example: "Issue description here" } } } } },
      },
      responses: { 201: { description: "Issue reported successfully" }, 400: { description: "Validation error" }, 401: { description: "Unauthorized" }, 403: { description: "Forbidden - Volunteer only" } },
    },
  },
};
