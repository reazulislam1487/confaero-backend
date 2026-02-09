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
import { noteSwaggerDocs } from "./app/modules/note/note.swagger";
import { resouceSwaggerDocs } from "./app/modules/resouce/resouce.swagger";
import { announcementSwaggerDocs } from "./app/modules/announcement/announcement.swagger";
import { messageSwaggerDocs } from "./app/modules/message/message.swagger";
import { connectionSwaggerDocs } from "./app/modules/connection/connection.swagger";
import { eventAttendeeSwaggerDocs } from "./app/modules/eventAttendee/eventAttendee.swagger";
import { messageOrganizerSwaggerDocs } from "./app/modules/messageOrganizer/messageOrganizer.swagger";
import { uploadSwaggerDocs } from "./app/modules/upload/upload.swagger";
import { posterSwaggerDocs } from "./app/modules/poster/poster.swagger";
import { reviewerSwaggerDocs } from "./app/modules/reviewer/reviewer.swagger";
import { posterAssignSwaggerDocs } from "./app/modules/posterAssign/posterAssign.swagger";
import { boothSwaggerDocs } from "./app/modules/booth/booth.swagger";
import { organizerBoothSwaggerDocs } from "./app/modules/organizerBooth/organizerBooth.swagger";
import { sponsorSwaggerDocs } from "./app/modules/sponsor/sponsor.swagger";

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
      ...invitationSwaggerDocs,
      ...noteSwaggerDocs,
      ...resouceSwaggerDocs,
      ...announcementSwaggerDocs,
      ...messageSwaggerDocs,
      ...connectionSwaggerDocs,
      ...eventAttendeeSwaggerDocs,
      ...messageOrganizerSwaggerDocs,
      ...uploadSwaggerDocs,
      ...posterSwaggerDocs,
      ...reviewerSwaggerDocs,
      ...posterAssignSwaggerDocs,
    
            ...boothSwaggerDocs,
            ...organizerBoothSwaggerDocs,
            ...sponsorSwaggerDocs,},
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
