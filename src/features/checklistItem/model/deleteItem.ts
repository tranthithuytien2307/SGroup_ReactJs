import { checklistItemAPI } from "../../../entities/checklikstItem/api/checklistItemAPI";

export const deleteItem = async (id: number) => {
  if (!id) return;

  try {
    const res = await checklistItemAPI.deleteItem(id);
    return res.data.responseObject;
  } catch (error) {
    console.error(`Error deleting checklist item ${id}: `, error);
    throw error;
  }
};
