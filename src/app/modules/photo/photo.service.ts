import { Types } from "mongoose";
import httpStatus from "http-status";
import { AppError } from "../../utils/app_error";
import { photo_model } from "./photo.schema";

const create_new_photo_into_db = async ({
  eventId,
  imageUrl,
  type,
  userId,
  role,
}: {
  eventId: any;
  imageUrl: any;
  type: string;
  userId: string;
  role: string;
}) => {
 

  return await photo_model.create({
    eventId: new Types.ObjectId(eventId),
    imageUrl,
    type,
    uploadedBy: new Types.ObjectId(userId),
  });
};

const get_event_photos_from_db = async ({
  eventId,
  page,
  limit,
  type,
}: {
  eventId: any;
  page: number;
  limit: number;
  type?: string;
}) => {
  const filter: any = {
    eventId: new Types.ObjectId(eventId),
  };

  if (type) {
    filter.type = type;
  }

  const skip = (page - 1) * limit;

  const data = await photo_model
    .find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await photo_model.countDocuments(filter);

  return {
    data,
    meta: {
      page,
      limit,
      total,
    },
  };
};

const delete_photo_from_db = async ({
  photoId,
  userId,
  role,
}: {
  photoId: any;
  userId: string;
  role: string;
}) => {
 

  const photo = await photo_model.findById(photoId);

  if (!photo) {
    throw new AppError("Photo not found", httpStatus.NOT_FOUND);
  }

  await photo.deleteOne();
  return null;
};

const get_public_event_photos_from_db = async ({
  eventId,
  type,
}: {
  eventId: any;
  type?: any;
}) => {
  const filter: any = {
    eventId: new Types.ObjectId(eventId),
  };

  if (type) {
    filter.type = type;
  }

  return await photo_model
    .find(filter)
    .select("imageUrl type")
    .sort({ createdAt: -1 });
};

export const photo_service = {
  create_new_photo_into_db,
  get_event_photos_from_db,
  delete_photo_from_db,
  get_public_event_photos_from_db,
};
