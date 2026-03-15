// appContent.route.ts
import { Router } from "express";
import { app_content_controller } from "./appContent.controller";
import auth from "../../middlewares/auth";

const app_content_router = Router();

/**
 * 🔒 SUPER_ADMIN + ORGANIZER
 * Same API → create or update
 */
app_content_router.post(
  "/create",
  auth("SUPER_ADMIN", "ORGANIZER"),
  app_content_controller.create_or_update_app_content,
);

/**
 * 🌍 PUBLIC APIs
 */
app_content_router.get("/all", app_content_controller.get_all_app_contents);

app_content_router.get("/:type", app_content_controller.get_single_app_content);

export default app_content_router;
