import { checklistAPI } from "../../../entities/checklist/api/checklistAPI";

export const createChecklist = async (card_id: number, title: string) => {
  if (!title.trim() || !card_id) return;
  try {
    const res = await checklistAPI.createChecklist(card_id, title);
    return res.data.responseObject;
  } catch (error) {
    console.error("Error creating checklist:", error);
    throw error;
  }
};
