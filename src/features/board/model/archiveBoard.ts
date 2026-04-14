import { boardAPI } from "../../../entities/board/api/boardAPI";

export const archiveBoard = async (boardId: number) => {
  if (!boardId) {
    throw new Error("Board ID is required to archive a board.");
  }
  try {
    const res = await boardAPI.archiveBoard(boardId);
    return res.data.responseObject;
  } catch (error) {
    console.error("Error archiving board:", error);
    throw error;
  }
};
