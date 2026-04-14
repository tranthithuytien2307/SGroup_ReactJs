import { boardAPI } from "../../../entities/board/api/boardAPI";

export const deleteBoard = async (boardId: number) => {
  if (!boardId) return;
  try {
    const res = await boardAPI.deleteBoard(boardId);
    return res.data;
  } catch (error) {
    console.error("Failed to delete board:", error);
    throw error;
  }
};
