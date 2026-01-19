import path from "path";
import { configs } from "./app/configs";
import { authSwaggerDocs } from "./app/modules/auth/auth.swagger";
import { userSwaggerDocs } from "./app/modules/user/user.swagger";
import { profileSwaggerDocs } from "./app/modules/profile/profile.swagger";
import { superAdminSwaggerDocs } from "./app/modules/superAdmin/superAdmin.swagger";
import { organizerSwaggerDocs } from "./app/modules/organizer/organizer.swagger";
import { attendeeSwaggerDocs } from "./app/modules/attendee/attendee.swagger";
import { qrSwaggerDocs } from "./app/modules/qr/qr.swagger";
import { invitationSwaggerDocs } from "./app/modules/invitation/invitation.swagger";

export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Doc - Build with Express CLI",
      version: "1.0.0-Mahid",
      description: "Express API with auto-generated Swagger docs",
    },
    paths: {
      ...authSwaggerDocs,
      ...userSwaggerDocs,

      ...profileSwaggerDocs,
      ...superAdminSwaggerDocs,

      ...organizerSwaggerDocs,
      ...attendeeSwaggerDocs,
    
            ...qrSwaggerDocs,
            ...invitationSwaggerDocs,},
    servers:
      configs.env === "production"
        ? [{ url: "https://live-url.com" }, { url: "http://localhost:5000" }]
        : [{ url: "http://localhost:5000" }, { url: "https://live-url.com" }],
    components: {
      securitySchemes: {
        AuthorizationToken: {
          type: "apiKey",
          in: "header",
          name: "Authorization",
          description: "Put your accessToken here ",
        },
      },
    },
    security: [
      {
        AuthorizationToken: [],
      },
    ],
  },
  apis: ["./src/app.ts"],
};
