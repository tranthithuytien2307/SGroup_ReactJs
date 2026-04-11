import { cardAPI } from "../../../entities/card/api/cardAPI";

export const updateMarkComplete = async (cardId: number) => {
  if (!cardId) {
    throw new Error("Card ID is required");
  }
  try {
    const res = await cardAPI.updateMarkComplete(cardId);
    return res.data.responseObject;
  } catch (error) {
    console.error("Failed to update mark complete status:", error);
    throw error;
  }
};
