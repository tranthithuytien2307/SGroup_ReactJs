import { cardAPI } from "../../../entities/card/api/cardAPI";

export const unarchiveCard = async (cardId: number) => {
  if (!cardId) return;

  try {
    await cardAPI.unarchiveCard(cardId);
  } catch (error) {
    console.error("Failed to unarchive card: ", error);
    throw error;
  }
};
