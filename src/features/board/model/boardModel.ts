import { boardAPI } from "../../../entities/board/api/boardAPI";
import type { Workspace } from "../../../entities/workspace/model/workspaceType";

export const updateBoardInModel = async (
  setWorkspace: React.Dispatch<React.SetStateAction<Workspace | null>>,
  boardId: number,
  data: { name: string; description?: string; cover_url?: string },
) => {
  try {
    await boardAPI.updateBoard({
      name: data.name,
      description: data.description ?? "",
      cover_url: data.cover_url ?? "",
      boardId,
    });

    setWorkspace((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        boards: prev.boards.map((board) =>
          board.id === boardId ? { ...board, ...data } : board,
        ),
      };
    });
  } catch (error) {
    console.error("Update failed:", error);
    throw error;
  }
};

export const deleteBoardInModel = async (
  setWorkspace: React.Dispatch<React.SetStateAction<Workspace | null>>,
  boardId: number,
) => {
  if (!confirm("Xác nhận xóa Board?")) return;

  try {
    await boardAPI.deleteBoard(boardId);

    setWorkspace((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        boards: prev.boards.filter((b) => b.id !== boardId),
        countBoard: prev.countBoard - 1,
      };
    });
  } catch (error) {
    console.error("Delete failed:", error);
    throw error;
  }
};

export const createBoardInModel = async (
  setWorkspace: React.Dispatch<React.SetStateAction<Workspace | null>>,
  workspaceId: number,
  data: { name: string; description?: string; cover_url?: string },
) => {
  try {
    const res = await boardAPI.createBoard({
      name: data.name,
      description: data.description ?? "",
      cover_url: data.cover_url ?? "",
      workspace_id: workspaceId,
    });

    const newBoard = res.data.responseObject;

    setWorkspace((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        boards: [...prev.boards, newBoard],
        countBoard: prev.countBoard + 1,
      };
    });
  } catch (error) {
    console.error("Create board failed:", error);
    throw error;
  }
};

export const archiveBoardInModel = async (
  setWorkspace: React.Dispatch<React.SetStateAction<Workspace | null>>,
  boardId: number,
) => {
  try {
    await boardAPI.archiveBoard(boardId);

    setWorkspace((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        boards: prev.boards.filter((b) => b.id !== boardId),
        countBoard: prev.countBoard - 1,
      };
    });
  } catch (error) {
    console.error("Archive failed:", error);
    throw error;
  }
};
