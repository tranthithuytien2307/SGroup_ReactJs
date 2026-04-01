import { cardAPI } from "../../../../entities/card/api/cardAPI";

export const getCommentByCardId = async (cardId: number) => {
  if (!cardId) return null;
  try {
    const response = await cardAPI.getCommentByCardId(cardId);
    return response.data.responseObject;
  } catch (error) {
    console.error("Failed to get comments by card id: ", error);
    throw error;
  }
};
