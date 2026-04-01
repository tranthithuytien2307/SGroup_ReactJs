import { checklistAPI } from "../../../entities/checklist/api/checklistAPI";

export const getChecklistByCardId = async (cardId: number) => {
  if (!cardId) return null;
  try {
    const response = await checklistAPI.getChecklikstByCardId(cardId);
    return response.data.responseObject;
  } catch (error) {
    console.error("Failed to get checklist by card id: ", error);
    throw error;
  }
};
