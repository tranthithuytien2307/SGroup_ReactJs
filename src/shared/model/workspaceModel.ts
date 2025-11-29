import { boardAPI } from "@/shared/api/boardAPI";
import type { Workspace } from "@/shared/types";

export async function createBoardInModel(
  setWorkspaces: React.Dispatch<React.SetStateAction<Workspace[]>>,
  workspace_id: number,
  data: { name: string; description?: string }
) {
  const payload: any = {
    name: data.name,
    workspace_id: Number(workspace_id)
  }

  if (data.description) {
    payload.description = data.description;
  }

  const res = await boardAPI.createBoard(payload);
  const newBoard = res.data.responseObject;

  setWorkspaces(prev =>
    prev.map(ws =>
      ws.id === workspace_id
        ? { ...ws, boards: [...ws.boards, newBoard], countBoard: ws.countBoard + 1 }
        : ws
    )
  );
}

export const updateBoardInModel = async (
  setWorkspaces: React.Dispatch<React.SetStateAction<Workspace[]>>,
  workspace_id: number,
  id: number,
  data: { name: string; description?: string }
) => {
  try {
    await boardAPI.updateBoard({
      id,
      ...(data.name && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
    });

    const updatedBoardFields: Partial<Workspace["boards"][number]> = {
      name: data.name,
    };

    if (data.description !== undefined) {
      updatedBoardFields.description = data.description;
    }

    setWorkspaces((prev) =>
      prev.map((ws) =>
        ws.id === workspace_id
          ? {
              ...ws,
              boards: ws.boards.map((board) =>
                board.id === id
                  ? {
                      ...board,
                      ...updatedBoardFields,
                    }
                  : board
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
  workspace_id: number,
  id: number
) => {
  if (!confirm("Xác nhận xóa Board?")) return;

  try {
    await boardAPI.deleteBoard(id);

    setWorkspaces((prev) =>
      prev.map((ws) =>
        ws.id === workspace_id
          ? {
              ...ws,
              boards: ws.boards.filter((b) => b.id !== id),
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

export const archiveBoardInModel = async (
  setWorkspaces: any,
  workspace_id: number,
  boardId: number
) => {
  await boardAPI.archiveBoard(boardId);

  setWorkspaces((prev: any[]) =>
    prev.map((ws) =>
      ws.id === workspace_id
        ? {
            ...ws,
            boards: ws.boards.filter((b: any) => b.id !== boardId),
            countBoard: ws.countBoard - 1,
          }
        : ws
    )
  );
};
