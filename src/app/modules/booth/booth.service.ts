import httpStatus from "http-status";
import { booth_model } from "./booth.schema";
import { T_Booth } from "./booth.interface";
import { AppError } from "../../utils/app_error";

const create_new_booth_into_db = async (payload: T_Booth): Promise<T_Booth> => {
  const isBoothExist = await booth_model.findOne({
    eventId: payload.eventId,
    exhibitorId: payload.exhibitorId,
  });

  if (isBoothExist) {
    throw new AppError(
      "Booth already exists for this event",
      httpStatus.CONFLICT,
    );
  }

  const booth = await booth_model.create(payload);
  return booth;
};

const get_my_booth_from_db = async (exhibitorId: string) => {
  const booth = await booth_model.findOne({ exhibitorId });

  if (!booth) {
    throw new AppError("Booth not found", httpStatus.NOT_FOUND);
  }

  return booth;
};

const update_my_booth_into_db = async (
  exhibitorId: string,
  payload: Record<string, any>,
) => {
  const booth = await booth_model.findOneAndUpdate({ exhibitorId }, payload, {
    new: true,
  });

  if (!booth) {
    throw new AppError("Booth not found", httpStatus.NOT_FOUND);
  }

  return booth;
};

export const booth_service = {
  get_my_booth_from_db,
  update_my_booth_into_db,
  create_new_booth_into_db,
};
