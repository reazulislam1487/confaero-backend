import { Types } from "mongoose";
import { document_model } from "./document.schema";
import httpStatus from "http-status";
import { AppError } from "../../utils/app_error";

const create_new_document_into_db = async (
  eventId: any,
  uploadedBy: string,
  payload: { documentType: string; documentUrl: string; documentName?: string },
) => {
  return document_model.create({
    eventId: new Types.ObjectId(eventId),
    uploadedBy: new Types.ObjectId(uploadedBy),
    documentType: payload.documentType,
    documentUrl: payload.documentUrl,
    documentName: payload.documentName,
  });
};

const get_my_documents_from_db = async (eventId: any, uploadedBy: string) => {
  return document_model.find({
    eventId,
    uploadedBy,
  });
};

const delete_my_document_from_db = async (
  documentId: any,
  uploadedBy: string,
) => {
  const document = await document_model.findOneAndDelete({
    _id: documentId,
    uploadedBy,
  });

  if (!document) {
    throw new AppError("Document not found", httpStatus.NOT_FOUND);
  }

  return document;
};

/* Organizer / Super Admin */
const get_pending_documents_from_db = async (query: any) => {
  const { eventId, status = "pending", page = 1, limit = 10 } = query;

  const skip = (Number(page) - 1) * Number(limit);

  const filter: any = { eventId };

  if (status) {
    filter.status = status;
  }

  const data = await document_model
    .find(filter)
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 })
    .populate("uploadedBy", "activeRole -_id");

  const total = await document_model.countDocuments(filter);

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
    },
    data,
  };
};

const get_all_documents_from_db = async (query: any) => {
  const { eventId, status, page = 1, limit = 10 } = query;

  const skip = (Number(page) - 1) * Number(limit);

  const filter: any = { eventId };

  if (status) {
    filter.status = status; // approved OR rejected
  } else {
    filter.status = { $in: ["approved", "rejected"] };
  }

  const data = await document_model
    .find(filter)
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 })
    .populate("uploadedBy", "activeRole -_id");

  const total = await document_model.countDocuments(filter);

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
    },
    data,
  };
};

const get_details_from_db = async (query: any) => {
  const { eventId, documentId } = query;
  const document = await document_model
    .findById(new Types.ObjectId(documentId))
    .populate("uploadedBy", "activeRole email -_id");

  if (!document) {
    throw new AppError("Document not found", httpStatus.NOT_FOUND);
  }

  if (document.eventId.toString() !== eventId) {
    throw new AppError(
      "Document does not belong to this event",
      httpStatus.BAD_REQUEST,
    );
  }

  return document;
};
const update_document_status_into_db = async (
  documentId: any,
  status: "approved" | "rejected",
) => {
  const document = await document_model.findByIdAndUpdate(
    documentId,
    { status },
    { new: true },
  );

  if (!document) {
    throw new AppError("Document not found", httpStatus.NOT_FOUND);
  }

  return document;
};
const get_all_documents_for_view_from_db = async (eventId: any, query: any) => {
  const { type, search, page = 1, limit = 10 } = query;

  const skip = (Number(page) - 1) * Number(limit);

  const filter: any = {
    eventId,
    status: "approved", // 🔥 only approved docs for public view
  };

  if (type) {
    filter.documentType = type;
  }

  if (search) {
    filter.documentType = { $regex: search, $options: "i" };
  }

  const data = await document_model
    .find(filter)
    .select("documentType documentUrl createdAt")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await document_model.countDocuments(filter);

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
    },
    data,
  };
};

export const document_service = {
  create_new_document_into_db,
  get_my_documents_from_db,
  delete_my_document_from_db,
  get_all_documents_from_db,
  update_document_status_into_db,
  get_pending_documents_from_db,
  get_details_from_db,
  get_all_documents_for_view_from_db,
};
