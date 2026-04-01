import { cardAPI } from "../../../../entities/card/api/cardAPI";

export const deleteComment = async (commentId: number) => {
  if (!commentId) return null;
  try {
    const response = await cardAPI.deleteComment(commentId);
    return response.data.responseObject;
  } catch (error) {
    console.error("Failed to delete comment: ", error);
    throw error;
  }
};
