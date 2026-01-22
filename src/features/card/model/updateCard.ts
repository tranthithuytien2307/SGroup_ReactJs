import { cardAPI } from "../../../entities/card/api/cardAPI";

export const updateCard = async (
  cardId: number,
  data: { title?: string; description?: string },
) => {
  if (!cardId) return;

  try {
    await cardAPI.updateCard(cardId, data);
  } catch (error) {
    console.error("Failed to update card: ", error);
    throw error;
  }
};
