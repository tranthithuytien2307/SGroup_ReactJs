import { cardAPI } from "../../../../entities/card/api/cardAPI";

export const createCommentCard = async (cardId: number, content: string) => {
  if (!cardId || !content) return null;
  try {
    const response = await cardAPI.commentCard(cardId, content);
    return response.data.responseObject;
  } catch (error) {
    console.error("Failed to create comment: ", error);
    throw error;
  }
};
