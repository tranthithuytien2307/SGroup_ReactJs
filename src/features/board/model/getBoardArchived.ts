import { boardAPI } from "../../../entities/board/api/boardAPI";

export const getBoardArchived = async (boardId: number) => {
  if (!boardId) throw new Error("Board ID is required");
  try {
    const res = await boardAPI.getBoardArchived(boardId);
    return res.data.responseObject;
  } catch (error) {
    console.error("Failed to fetch archived items:", error);
    throw error;
  }
};
