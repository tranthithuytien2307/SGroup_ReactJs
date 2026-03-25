import { checklistItemAPI } from "../../../entities/checklikstItem/api/checklistItemAPI";

export const toggleItem = async (item_id: number, is_completed: boolean) => {
  if (!item_id) return;

  try {
    const res = await checklistItemAPI.toggleItem(item_id, is_completed);
    return res.data.responseObject;
  } catch (error) {
    console.error(`Error toggling checklist item ${item_id}: `, error);
    throw error;
  }
};
