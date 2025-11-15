import { boardAPI } from "@/shared/api/boardAPI";
import type { Workspace } from "@/shared/types";

export const updateBoardInModel = async (
  setWorkspaces: React.Dispatch<React.SetStateAction<Workspace[]>>,
  workspaceId: number,
  boardId: number,
  data: { name: string; description?: string; cover_url?: string }
) => {
  try {
    await boardAPI.updateBoard({
      name: data.name,
      description: data.description ?? "",
      cover_url: data.cover_url ?? "",
      boardId,
    });

    setWorkspaces((prev) =>
      prev.map((ws) =>
        ws.id === workspaceId
          ? {
              ...ws,
              boards: ws.boards.map((board) =>
                board.id === boardId ? { ...board, ...data } : board
              ),
            }
          : ws
      )
    );
  } catch (error) {
    console.error("Update failed:", error);
    throw error;
  }
};

export const deleteBoardInModel = async (
  setWorkspaces: React.Dispatch<React.SetStateAction<Workspace[]>>,
  workspaceId: number,
  boardId: number
) => {
  if (!confirm("Xác nhận xóa Board?")) return;

  try {
    await boardAPI.deleteBoard(boardId);

    setWorkspaces((prev) =>
      prev.map((ws) =>
        ws.id === workspaceId
          ? {
              ...ws,
              boards: ws.boards.filter((b) => b.id !== boardId),
              countBoard: ws.countBoard - 1,
            }
          : ws
      )
    );
  } catch (error) {
    console.error("Delete failed:", error);
    throw error;
  }
};
