import csv from "csvtojson";
import httpStatus from "http-status";
import { Event_Model } from "../superAdmin/event.schema";
import { AppError } from "../../utils/app_error";
import { verify_email_model } from "./verifyEmail.schema";

const create_new_verify_email_into_db = async (
  user: any,
  eventId: any,
  file: Express.Multer.File,
) => {
  if (!file) {
    throw new AppError("CSV file is required", httpStatus.BAD_REQUEST);
  }

  // organizer must own event
  const event = await Event_Model.findOne({
    _id: eventId,
    organizerEmails: user.email,
  });

  if (!event) {
    throw new AppError("Event not found", httpStatus.NOT_FOUND);
  }

  let rows: any[];
  try {
    rows = await csv().fromString(file.buffer.toString());
  } catch {
    throw new AppError("Invalid CSV format", httpStatus.BAD_REQUEST);
  }

  if (!rows.length) {
    throw new AppError("CSV file is empty", httpStatus.BAD_REQUEST);
  }

  const docs = rows.map((row, index) => {
    if (!row.email) {
      throw new AppError(
        `Email missing at row ${index + 1}`,
        httpStatus.BAD_REQUEST,
      );
    }

    return {
      event: eventId,
      email: String(row.email).toLowerCase().trim(),
    };
  });

  // insert (ignore duplicates safely)
  await verify_email_model.insertMany(docs, { ordered: false });

  return {
    inserted: docs.length,
  };
};
//
const get_all_verify_emails_from_db = async (user: any, eventId: any) => {
  // organizer ownership check
  const event = await Event_Model.findOne({
    _id: eventId,
    organizerEmails: user.email,
  });

  if (!event) {
    throw new AppError("Event not found", httpStatus.NOT_FOUND);
  }

  const emails = await verify_email_model
    .find({ event: eventId }, { email: 1, isUsed: 1, usedAt: 1 })
    .sort({ createdAt: -1 });

  return emails;
};

const delete_verify_email_from_db = async (
  user: any,
  eventId: any,
  verifyEmailId: any,
) => {
  // organizer ownership check
  const event = await Event_Model.findOne({
    _id: eventId,
    organizerEmails: user.email,
  });

  if (!event) {
    throw new AppError("Event not found", httpStatus.NOT_FOUND);
  }

  const verifyEmail = await verify_email_model.findOne({
    _id: verifyEmailId,
    event: eventId,
  });

  if (!verifyEmail) {
    throw new AppError("Verified email not found", httpStatus.NOT_FOUND);
  }

  // optional safety: prevent deleting already-used email
  if (verifyEmail.isUsed) {
    throw new AppError(
      "This email has already been used and cannot be deleted",
      httpStatus.BAD_REQUEST,
    );
  }

  await verifyEmail.deleteOne();

  return { id: verifyEmailId };
};
const add_verified_emails_into_db = async (
  user: any,
  eventId: string | any,
  emails: string[],
) => {
  // organizer ownership check
  const event = await Event_Model.findOne({
    _id: eventId,
    organizerEmails: user.email,
  });

  if (!event) {
    throw new AppError("Event not found", httpStatus.NOT_FOUND);
  }

  // normalize emails
  const normalizedEmails = emails.map((e) => e.toLowerCase().trim());

  // find existing emails
  const existing = await verify_email_model.find({
    event: eventId,
    email: { $in: normalizedEmails },
  });

  const existingSet = new Set(existing.map((e) => e.email));

  // filter new emails only
  const newEmails = normalizedEmails.filter((email) => !existingSet.has(email));

  if (!newEmails.length) {
    throw new AppError(
      "All provided emails already exist",
      httpStatus.BAD_REQUEST,
    );
  }

  const docs = newEmails.map((email) => ({
    event: eventId,
    email,
  }));

  await verify_email_model.insertMany(docs);

  return {
    added: docs.length,
    skipped: existingSet.size,
  };
};

export const verify_email_service = {
  create_new_verify_email_into_db,
  get_all_verify_emails_from_db,
  delete_verify_email_from_db,
  add_verified_emails_into_db,
};
