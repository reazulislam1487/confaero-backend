// // file upload handler
// import multer, { FileFilterCallback } from "multer";
// import { Request, Response, NextFunction } from "express";
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import { v4 as uuidv4 } from "uuid";
// import path from "path";
// import {
//   AWS_REGION,
//   AWS_ACCESS_KEY_ID,
//   AWS_SECRET_ACCESS_KEY,
//   AWS_BUCKET_NAME,
// } from "./../config/index";

// /// Ensure environment variables are set
// if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
//   throw new Error("AWS configuration is missing. Check .env file.");
// }

// // S3 client
// export const s3Client = new S3Client({
//   region: AWS_REGION,
//   credentials: {
//     accessKeyId: AWS_ACCESS_KEY_ID,
//     secretAccessKey: AWS_SECRET_ACCESS_KEY,
//   },
// });
// // Multer memory storage
// const storage = multer.memoryStorage();

// const allowedTypes: string[] = [
//   "image/jpg",
//   "image/jpeg",
//   "image/png",
//   "image/gif",
//   "image/webp",
//   "application/pdf",
//   "video/mp4",
//   "audio/mpeg",
// ];

// const fileFilter = (
//   _req: Request,
//   file: Express.Multer.File,
//   cb: FileFilterCallback
// ) => {
//   if (allowedTypes.includes(file.mimetype)) cb(null, true);
//   else cb(new Error("File type not allowed"));
// };

// export const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 100 * 1024 * 1024 },
// });

// // Upload single file buffer to S3 and return live URL
// export const uploadToS3 = async (
//   file: Express.Multer.File
// ): Promise<string> => {
//   if (!file || !file.originalname) {
//     throw new Error("Invalid file or missing file name");
//   }

//   const ext = path.extname(file.originalname);
//   const key = `${uuidv4()}${ext}`;

//   await s3Client.send(
//     new PutObjectCommand({
//       Bucket: AWS_BUCKET_NAME!,
//       Key: key,
//       Body: file.buffer,
//       ContentType: file.mimetype,
//     })
//   );

//   return `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${key}`;
// };

// export const multiUploadHandler = (
//   fields: { name: string; maxCount?: number }[]
// ) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     upload.fields(fields)(req, res, async (err: unknown) => {
//       if (err) return next(err);

//       const files = req.files as Record<string, Express.Multer.File[]>;
//       if (files) {
//         for (const field in files) {
//           if (files[field]?.length) {
//             const file = files[field][0];
//             const fileUrl = await uploadToS3(file);
//             req.body[field] = fileUrl; // Flatten into req.body
//           }
//         }
//       }

//       next();
//     });
//   };
// };

// // Middleware to handle multiple fields (single/multiple)
// // export const multiUploadHandler =
// (fields: { name: string; maxCount?: number }[]) =>
//   async (req: Request, _res: Response, next: NextFunction) => {
//     upload.fields(fields)(req, _res, async (err) => {
//       if (err) return next(err);

//       if (!req.files) return next();

//       const files = req.files as Record<string, Express.Multer.File[]>;
//       const uploadedUrls: Record<string, string | string[]> = {};

//       for (const fieldName in files) {
//         const fileArray = files[fieldName];
//         const urls = await Promise.all(fileArray.map(uploadToS3));
//         uploadedUrls[fieldName] = urls.length === 1 ? urls[0] : urls;
//       }

//       (req.body as any).files = uploadedUrls;
//       next();
//     });
//   };

// // router
// router.patch(
//   "/update-my-profile",
//   auth("admin", "company", "mechanic"),
//   multiUploadHandler([
//     { name: "profile", maxCount: 1 },
//     { name: "back_photo", maxCount: 1 },
//     { name: "front_photo", maxCount: 1 },
//   ]),
//   UserController.updateMyProfile
// );

// //controller
// const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
//   const { id: userId, role: userRole } = req.user as JwtUserPayload;
//   const userData = { ...req.body };

//   if (userRole === "company") {
//     const file = req.file as Express.Multer.File | undefined;
//     if (file) {
//       userData.company_logo = await uploadToS3(file);
//     }
//   }

//   if (userRole === "mechanic") {
//     const files = req.files as {
//       profile?: Express.Multer.File[];
//       front_photo?: Express.Multer.File[];
//       back_photo?: Express.Multer.File[];
//     };

//     if (files?.profile?.[0]) {
//       userData.profile_url = await uploadToS3(files.profile[0]);
//     }

//     if (files?.front_photo?.[0]) {
//       userData["license.front_image"] = await uploadToS3(files.front_photo[0]);
//     }
//     if (files?.back_photo?.[0]) {
//       userData["license.back_image"] = await uploadToS3(files.back_photo[0]);
//     }
//   }

//   // Remove role from userData so users can't change their own role manually
//   delete userData.role;

//   const result = await UserService.updateMyProfile(userId, userData);

//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: "Profile updated successfully",
//     data: result,
//   });
// });

// // single file upload
// router.post(
//   "/register/company",
//   upload.single("logo"),
//   validateRequest(authValidation.registerCompanySchema),
//   AuthController.registerUser
// );

// // controller
// const file = req.file as Express.Multer.File | undefined;

// let logo: string | undefined;
// if (file) {
//   logo = await uploadToS3(file);
// }

// userData = {
//   ...userData,
//   ...(logo && { logo }),
// };
