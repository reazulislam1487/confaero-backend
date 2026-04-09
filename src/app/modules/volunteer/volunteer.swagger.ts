export const volunteerSwaggerDocs = {
  "/api/v1/volunteer/create": {
    post: {
      tags: ["Volunteer"],
      summary: "Create task",
      description: "Create a new volunteer task (organizer/super admin only).",
      security: [{ AuthorizationToken: [] }],
      requestBody: {
        required: true,
        content: { "application/json": { schema: { type: "object", properties: { title: { type: "string" }, description: { type: "string" }, eventId: { type: "string" }, assignedTo: { type: "string" }, dueDate: { type: "string", format: "date" } } } } },
      },
      responses: { 201: { description: "Task created successfully" }, 400: { description: "Validation error" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/volunteer/my-tasks": {
    get: {
      tags: ["Volunteer"],
      summary: "Get my tasks",
      description: "Get tasks assigned to the authenticated user.",
      security: [{ AuthorizationToken: [] }],
      responses: { 200: { description: "Tasks retrieved successfully" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/volunteer/my-task/{taskId}": {
    get: {
      tags: ["Volunteer"],
      summary: "Get task details",
      description: "Get detailed information about a specific task.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "taskId", in: "path", required: true, schema: { type: "string" }, description: "Task ID" }],
      responses: { 200: { description: "Task details retrieved successfully" }, 401: { description: "Unauthorized" }, 404: { description: "Task not found" } },
    },
  },

  "/api/v1/volunteer/{taskId}/complete": {
    patch: {
      tags: ["Volunteer"],
      summary: "Complete task",
      description: "Mark a task as completed (volunteer only).",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "taskId", in: "path", required: true, schema: { type: "string" }, description: "Task ID" }],
      responses: { 200: { description: "Task completed successfully" }, 401: { description: "Unauthorized" }, 403: { description: "Forbidden" }, 404: { description: "Task not found" } },
    },
  },

  "/api/v1/volunteer/today-progress": {
    get: {
      tags: ["Volunteer"],
      summary: "Get today's progress",
      description: "Get volunteer's task completion progress for today.",
      security: [{ AuthorizationToken: [] }],
      responses: { 200: { description: "Today's progress retrieved successfully" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/volunteer/{eventId}/volunteer/search": {
    get: {
      tags: ["Volunteer"],
      summary: "Search volunteer",
      description: "Search for volunteers by email for an event.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" }],
      responses: { 200: { description: "Search results retrieved successfully" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/volunteer/volunteers": {
    get: {
      tags: ["Volunteer"],
      summary: "Get volunteer dashboard",
      description: "Get volunteer dashboard with all volunteers and their stats.",
      security: [{ AuthorizationToken: [] }],
      responses: { 200: { description: "Volunteer dashboard retrieved successfully" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/volunteer/{reportId}": {
    get: {
      tags: ["Volunteer"],
      summary: "View single report",
      description: "View a specific task issue report.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "reportId", in: "path", required: true, schema: { type: "string" }, description: "Report ID" }],
      responses: { 200: { description: "Report retrieved successfully" }, 401: { description: "Unauthorized" }, 404: { description: "Report not found" } },
    },
  },
};
