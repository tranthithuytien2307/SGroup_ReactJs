import { cardAPI } from "../../../entities/card/api/cardAPI";

export const removeDeadlineDate = async (card_id: number) => {
  if (!card_id) return;
  try {
    await cardAPI.removeDeadlineDate(card_id);
  } catch (error) {
    console.error("Failed to remove deadline date: ", error);
    throw error;
  }
};
