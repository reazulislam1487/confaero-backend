import httpStatus from "http-status";
import { booth_model, booth_staff_model } from "./booth.schema";
import { T_Booth } from "./booth.interface";
import { AppError } from "../../utils/app_error";
import { Account_Model } from "../auth/auth.schema";

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

const get_my_booth_from_db = async (userId: string) => {
  const boothAsExhibitor = await booth_model.findOne({
    exhibitorId: userId,
    status: "active",
    isAccepted: true,
  });

  if (boothAsExhibitor) {
    return boothAsExhibitor;
  }

  const staff = await booth_staff_model.findOne({ userId }).populate("boothId");

  if (
    !staff ||
    !staff.boothId ||
    (staff.boothId as any).status !== "active" ||
    (staff.boothId as any).isAccepted !== true
  ) {
    throw new AppError("Booth not found or not active", httpStatus.NOT_FOUND);
  }

  return staff.boothId;
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
// add more service functions as needed
const add_staff_by_email_into_db = async (
  exhibitorId: string,
  email: string,
) => {
  const booth = await booth_model.findOne({ exhibitorId });

  if (!booth) {
    throw new AppError("Booth not found", httpStatus.NOT_FOUND);
  }

  const user = await Account_Model.findOne({ email });

  if (!user) {
    throw new AppError("User not registered", httpStatus.NOT_FOUND);
  }

  if (user.activeRole !== "ATTENDEE") {
    throw new AppError(
      "User is not eligible as booth staff" +
        `(user role is ${user.activeRole})`,
      httpStatus.BAD_REQUEST,
    );
  }

  const staff = await booth_staff_model.create({
    boothId: booth._id,
    userId: user._id,
    addedBy: exhibitorId,
  });
  await Account_Model.findByIdAndUpdate(
    user._id,
    {
      $addToSet: { role: "STAFF" },
      activeRole: "STAFF",
    },
    { new: true },
  );
  return staff;
};

export const booth_service = {
  get_my_booth_from_db,
  update_my_booth_into_db,
  create_new_booth_into_db,
  add_staff_by_email_into_db,
};
