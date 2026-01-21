import { Router } from "express";
import authRoute from "./app/modules/auth/auth.route";
import userRoute from "./app/modules/user/user.route";
import profileRoute from "./app/modules/profile/profile.route";
import superAdminRoute from "./app/modules/superAdmin/superAdmin.route";
import organizerSessionRoute from "./app/modules/organizer/organizer.session.route";
import organizerRoute from "./app/modules/organizer/organizer.route";
import attendeeRoute from "./app/modules/attendee/attendee.route";
import qrRoute from "./app/modules/qr/qr.route";
import invitationRoute from "./app/modules/invitation/invitation.route";
import noteRoute from "./app/modules/note/note.route";

const appRouter = Router();

const moduleRoutes = [
  { path: "/note", route: noteRoute },
  { path: "/invitation", route: invitationRoute },
  { path: "/qr", route: qrRoute },
  { path: "/attendee", route: attendeeRoute },
  { path: "/organizer", route: organizerRoute },
  { path: "/organizer-sessions", route: organizerSessionRoute },
  { path: "/superAdmin", route: superAdminRoute },
  { path: "/profile", route: profileRoute },
  { path: "/auth", route: authRoute },
  { path: "/user", route: userRoute },
];

moduleRoutes.forEach((route) => appRouter.use(route.path, route.route));
export default appRouter;
