import { boardAPI } from "../../../entities/board/api/boardAPI";

export const getBoardCreator = async (boardId: number) => {
  if (!boardId) return;
  try {
    const res = await boardAPI.getBoardCreator(boardId);
    return res.data.responseObject;
  } catch (error) {
    console.error("Error fetching board creator:", error);
    throw error;
  }
};
