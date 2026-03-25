import { checklistItemAPI } from "../../../entities/checklikstItem/api/checklistItemAPI";

export const addItem = async (checklist_id: number, content: string) => {
  if (!checklist_id || !content.trim()) return;

  try {
    const res = await checklistItemAPI.addItem(checklist_id, content);
    return res.data.responseObject;
  } catch (error) {
    console.error("Error adding checklist item: ", error);
    throw error;
  }
};
