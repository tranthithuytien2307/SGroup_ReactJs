import { boardAPI } from "../../../entities/board/api/boardAPI";

export const changeBoardName = async (boardId: number, newName: string) => {
  if (!boardId || !newName.trim()) return;

  try {
    await boardAPI.updateBoard({
      boardId,
      name: newName,
    });
  } catch (error) {
    console.error("Error changing board name:", error);
    throw error;
  }
};
