import { Router } from 'express';
import authRoute from './app/modules/auth/auth.route';
import userRoute from './app/modules/user/user.route';
import profileRoute from './app/modules/profile/profile.route';


const appRouter = Router();

const moduleRoutes = [
    { path: "/profile", route: profileRoute },
    { path: '/auth', route: authRoute },
    { path: "/user", route: userRoute }


];

moduleRoutes.forEach(route => appRouter.use(route.path, route.route));
export default appRouter;