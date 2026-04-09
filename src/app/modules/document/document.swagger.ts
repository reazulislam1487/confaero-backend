export const documentSwaggerDocs = {
  "/api/v1/document/{eventId}": {
    post: {
      tags: ["Document"],
      summary: "Upload document",
      description: "Upload a new document for an event.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" }],
      requestBody: {
        required: true,
        content: { "application/json": { schema: { type: "object", properties: { title: { type: "string" }, fileUrl: { type: "string" }, type: { type: "string" } } } } },
      },
      responses: { 201: { description: "Document uploaded successfully" }, 400: { description: "Validation error" }, 401: { description: "Unauthorized" } },
    },
    get: {
      tags: ["Document"],
      summary: "Get all documents",
      description: "Get all documents for an event (organizer/admin view).",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" }],
      responses: { 200: { description: "Documents retrieved successfully" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/document/{eventId}/my": {
    get: {
      tags: ["Document"],
      summary: "Get my documents",
      description: "Get all documents uploaded by the authenticated user for an event.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" }],
      responses: { 200: { description: "Documents retrieved successfully" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/document/my/{documentId}": {
    delete: {
      tags: ["Document"],
      summary: "Delete document",
      description: "Delete a document uploaded by the authenticated user.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "documentId", in: "path", required: true, schema: { type: "string" }, description: "Document ID" }],
      responses: { 200: { description: "Document deleted successfully" }, 401: { description: "Unauthorized" }, 404: { description: "Document not found" } },
    },
  },

  "/api/v1/document/{eventId}/pending": {
    get: {
      tags: ["Document"],
      summary: "Get pending documents",
      description: "Get all documents pending approval for an event.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" }],
      responses: { 200: { description: "Pending documents retrieved successfully" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/document/{eventId}/details/{documentId}": {
    get: {
      tags: ["Document"],
      summary: "Get document details",
      description: "Get details of a specific document.",
      security: [{ AuthorizationToken: [] }],
      parameters: [
        { name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" },
        { name: "documentId", in: "path", required: true, schema: { type: "string" }, description: "Document ID" },
      ],
      responses: { 200: { description: "Document details retrieved successfully" }, 401: { description: "Unauthorized" }, 404: { description: "Document not found" } },
    },
  },

  "/api/v1/document/status/{documentId}": {
    patch: {
      tags: ["Document"],
      summary: "Update document status",
      description: "Update the approval status of a document.",
      security: [{ AuthorizationToken: [] }],
      parameters: [{ name: "documentId", in: "path", required: true, schema: { type: "string" }, description: "Document ID" }],
      requestBody: {
        required: true,
        content: { "application/json": { schema: { type: "object", properties: { status: { type: "string", enum: ["APPROVED", "PENDING", "REJECTED"] } } } } },
      },
      responses: { 200: { description: "Document status updated successfully" }, 400: { description: "Validation error" }, 401: { description: "Unauthorized" } },
    },
  },

  "/api/v1/document/{eventId}/all": {
    get: {
      tags: ["Document"],
      summary: "Get all documents (view)",
      description: "Get all approved documents for an event (public view).",
      parameters: [{ name: "eventId", in: "path", required: true, schema: { type: "string" }, description: "Event ID" }],
      responses: { 200: { description: "Documents retrieved successfully" } },
    },
  },
};
