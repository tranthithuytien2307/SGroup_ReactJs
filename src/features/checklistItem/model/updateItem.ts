import { checklistItemAPI } from "../../../entities/checklikstItem/api/checklistItemAPI";

export const updateItem = async (item_id: number, content: string) => {
  if (!item_id || !content.trim()) return;

  try {
    const res = await checklistItemAPI.updateItem(item_id, content);
    return res.data.responseObject;
  } catch (error) {
    console.error(`Error updating checklist item ${item_id}: `, error);
    throw error;
  }
};
