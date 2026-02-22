import { T_AppContent } from "./appContent.interface";
import { AppContent } from "./appContent.schema";

const create_or_update_app_content_into_db = async (payload: T_AppContent) => {
  const existing = await AppContent.findOne({ type: payload.type });

  // 🟢 CREATE
  if (!existing) {
    return AppContent.create(payload);
  }

  // 🔵 UPDATE (safe fields only)
  const updated = await AppContent.findByIdAndUpdate(
    existing._id,
    {
      title: payload.title,
      content: payload.content,
      isActive: payload.isActive ?? existing.isActive,
      updatedBy: payload.updatedBy, // ✅ only updater changes
    },
    { new: true },
  );

  return updated;
};

const get_all_app_contents_from_db = async () => {
  return AppContent.find({ isActive: true });
};

const get_single_app_content_by_type_from_db = async (type: string) => {
  return AppContent.findOne({ type, isActive: true });
};

export const app_content_service = {
  create_or_update_app_content_into_db,
  get_all_app_contents_from_db,
  get_single_app_content_by_type_from_db,
};
