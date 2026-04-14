import { boardAPI } from "../../../entities/board/api/boardAPI";

export const unarchiveBoard = async (boardId: number) => {
  if (!boardId) {
    throw new Error("Board ID is required to unarchive a board.");
  }
  try {
    const response = await boardAPI.unarchiveBoard(boardId);
    return response.data.responseObject;
  } catch (error) {
    console.error("Error unarchiving board:", error);
    throw error;
  }
};
