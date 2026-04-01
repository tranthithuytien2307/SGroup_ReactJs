import { cardAPI } from "../../../../entities/card/api/cardAPI";

export const updateComment = async (commentId: number, content: string) => {
  if (!commentId || !content) return null;
  try {
    const response = await cardAPI.updateComment(commentId, content);
    return response.data.responseObject;
  } catch (error) {
    console.error("Failed to update comment: ", error);
    throw error;
  }
};
