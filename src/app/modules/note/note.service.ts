import { Types } from "mongoose";
import { note_model } from "./note.schema";

const create_new_note_into_db = async (
  accountId: Types.ObjectId,
  payload: { noteId?: string; content: string },
) => {
  const { noteId, content } = payload;

  // UPDATE
  if (noteId) {
    return await note_model.findOneAndUpdate(
      { _id: noteId, accountId },
      { content },
      { new: true },
    );
  }

  // CREATE
  return await note_model.create({
    accountId,
    content,
  });
};

// get all notes
const get_notes_into_db = async (accountId: Types.ObjectId) => {
  return await note_model
    .find({ accountId })
    .sort({ createdAt: -1 })
    .select("content createdAt updatedAt");
};

export const note_service = { create_new_note_into_db, get_notes_into_db };
