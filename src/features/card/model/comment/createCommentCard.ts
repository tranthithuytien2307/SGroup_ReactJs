import { cardAPI } from "../../../../entities/card/api/cardAPI";

export const createCommentCard = async (
  cardId: number,
  content: string,
  clientId: number,
) => {
  if (!cardId || !content) return null;
  try {
    const response = await cardAPI.commentCard(cardId, content, clientId);
    return response.data.responseObject;
  } catch (error) {
    console.error("Failed to create comment: ", error);
    throw error;
  }
};
