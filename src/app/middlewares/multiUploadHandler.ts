import { Request, Response, NextFunction } from "express";
import { upload } from "./upload";
import { uploadToS3 } from "../utils/s3";

export const multiUploadHandler =
  (fields: { name: string; maxCount?: number }[], folder = "uploads") =>
  (req: Request, _res: Response, next: NextFunction) => {
    upload.fields(fields)(req, _res, async (err) => {
      if (err) return next(err);
      if (!req.files) return next();

      const files = req.files as Record<string, Express.Multer.File[]>;
      const uploaded: Record<string, string | string[]> = {};

      for (const key of Object.keys(files)) {
        const urls = await Promise.all(
          files[key].map((f) => uploadToS3(f, folder)),
        );
        uploaded[key] = urls.length === 1 ? urls[0] : urls;
      }

      (req as any).uploadedFiles = uploaded;
      next();
    });
  };
