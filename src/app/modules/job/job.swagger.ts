export const jobSwaggerDocs = {
  "/api/v1/job/": {
    post: {
      tags: ["Job"],
      summary: "Create job",
      description: "Create a new job posting for an event.",
      security: [{ AuthorizationToken: [] }],
      requestBody: {
        required: true,
        content: { "application/json": { schema: { type: "object", properties: { title: { type: "string" }, description: { type: "string" }, eventId: { type: "string" }, company: { type: "string" }, location: { type: "string" } } } } },
      },
      responses: { 201: { description: "Job created successfully" }, 400: { description: "Validation error" }, 401: { description: "Unauthorized" } },
    },
    get: {
      tags: ["Job"],
      summary: "Get public jobs",
      description: "Get all public job postings (public endpoint).",
      responses: { 200: { description: "Jobs retrieved successfully" } },
    },
  },

  "/api/v1/job/my": {
    get: {
      tags: ["Job"],
      summary: "Get my jobs",
      description: "Get job postings created by the authenticated user.",
      security: [{ AuthorizationToken: [] }],
      responses: { 200: { description: "Jobs retrieved successfully" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/job/review": {
    get: {
      tags: ["Job"],
      summary: "Review jobs",
      description: "Get job postings pending review (organizer/super admin).",
      security: [{ AuthorizationToken: [] }],
      responses: { 200: { description: "Jobs retrieved successfully" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/job/{jobId}": {
    get: {
      tags: ["Job"],
      summary: "Get job details",
      description: "Get details of a specific job posting (public endpoint).",
      parameters: [{ name: "jobId", in: "path", required: true, schema: { type: "string" }, description: "Job ID" }],
      responses: { 200: { description: "Job details retrieved successfully" }, 404: { description: "Job not found" } },
    },
    patch: {
      tags: ["Job"],
      summary: "Update job",
      description: "Update a job posting (organizer/super admin).",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "jobId", in: "path", required: true, schema: { type: "string" }, description: "Job ID" }],
      requestBody: {
        required: true,
        content: { "application/json": { schema: { type: "object", properties: { title: { type: "string" }, description: { type: "string" }, company: { type: "string" } } } } },
      },
      responses: { 200: { description: "Job updated successfully" }, 400: { description: "Validation error" }, 401: { description: "Unauthorized" }, 404: { description: "Job not found" } },
    },
    delete: {
      tags: ["Job"],
      summary: "Delete job",
      description: "Delete a job posting (organizer/super admin).",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "jobId", in: "path", required: true, schema: { type: "string" }, description: "Job ID" }],
      responses: { 200: { description: "Job deleted successfully" }, 401: { description: "Unauthorized" }, 404: { description: "Job not found" } },
    },
  },

  "/api/v1/job/{jobId}/status": {
    patch: {
      tags: ["Job"],
      summary: "Update job status",
      description: "Update the status of a job posting (organizer/super admin).",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "jobId", in: "path", required: true, schema: { type: "string" }, description: "Job ID" }],
      requestBody: {
        required: true,
        content: { "application/json": { schema: { type: "object", properties: { status: { type: "string", enum: ["ACTIVE", "INACTIVE", "CLOSED"] } } } } },
      },
      responses: { 200: { description: "Job status updated successfully" }, 400: { description: "Validation error" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/job/my/{jobId}": {
    get: {
      tags: ["Job"],
      summary: "Get single job",
      description: "Get a specific job posting created by the authenticated user.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "jobId", in: "path", required: true, schema: { type: "string" }, description: "Job ID" }],
      responses: { 200: { description: "Job retrieved successfully" }, 401: { description: "Unauthorized" }, 404: { description: "Job not found" } },
    },
  },
};
