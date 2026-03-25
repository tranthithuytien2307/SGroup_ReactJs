import { cardAPI } from "../../../entities/card/api/cardAPI";

export const updateCardDate = async (
  card_id: number,
  start_date?: string,
  due_date?: string,
) => {
  if (!card_id) return;
  if (!start_date && !due_date) return;
  try {
    await cardAPI.updateCardDates(card_id, start_date, due_date);
  } catch (error) {
    console.error("Failed to update card dates: ", error);
    throw error;
  }
};
