import { cardAPI } from "../../../entities/card/api/cardAPI";

export const archiveCard = async (cardId: number) => {
  if (!cardId) return;

  try {
    await cardAPI.archiveCard(cardId);
  } catch (error) {
    console.error("Failed to archive card: ", error);
    throw error;
  }
};
