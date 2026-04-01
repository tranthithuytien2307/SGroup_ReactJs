import { cardAPI } from "../../../entities/card/api/cardAPI";

export const getCardMembers = async (cardId: number) => {
  if (!cardId) return;

  try {
    const res = await cardAPI.getCardMembers(cardId);
    return res.data.responseObject;
  } catch (error) {
    console.error("Error fetching card members:", error);
    throw error;
  }
};
