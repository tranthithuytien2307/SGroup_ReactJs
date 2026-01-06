import { boardAPI } from "../api/boardAPI";
import { workspaceAPI } from "../api/workspaceAPI";
import type { Workspace } from "../types";

export const createWorkspaceInModel = async (
  setWorkspaces: React.Dispatch<React.SetStateAction<Workspace[]>>,
  data: { name: string; description?: string }
) => {
  try {
    const res = await workspaceAPI.createWorkspace({
      name: data.name,
      description: data.description ?? "",
    });

    const newWorkspace: Workspace = {
      ...res.data.responseObject,
      boards: res.data.responseObject?.boards ?? [],
      countBoard: res.data.responseObject?.countBoard ?? 0,
    };

    setWorkspaces((prev) => [...prev, newWorkspace]);
  } catch (error) {
    console.log("Create Workspace failed: ", error);
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
