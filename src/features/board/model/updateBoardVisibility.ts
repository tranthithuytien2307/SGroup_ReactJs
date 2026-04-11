import { boardAPI } from "../../../entities/board/api/boardAPI";

export const updateBoardVisibility = async (
  boardId: number,
  visibility: string,
) => {
  if (!boardId) return;

  try {
    const res = await boardAPI.updateBoardVisibility(boardId, visibility);
    return res.data.responseObject;
  } catch (error) {
    console.error("Failed to update board visibility:", error);
    throw error;
  }
};
