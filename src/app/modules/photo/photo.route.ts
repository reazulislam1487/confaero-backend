import { Router } from "express";
import { photo_controller } from "./photo.controller";

const photo_router = Router();

photo_router.post("/events/:eventId/photos", photo_controller.create_new_photo);

photo_router.get("/events/:eventId/photos", photo_controller.get_event_photos);

photo_router.delete("/photos/:photoId", photo_controller.delete_photo);

photo_router.get(
  "/public/events/:eventId/photos",
  photo_controller.get_public_event_photos,
);

export default photo_router;
