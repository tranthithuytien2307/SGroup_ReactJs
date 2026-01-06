import { createContext, useContext, type ReactNode } from "react";
import { useWorkspaces } from "@/shared/hooks/useWorkspaces";
import type { Workspace } from "@/shared/types";
import {
  updateBoardInModel,
  deleteBoardInModel,
  createBoardInModel,
} from "@/shared/model/boardModel";
import {
  createWorkspaceInModel,
  archiveBoardInModel,
} from "../model/workspaceModel";

export type BoardData = {
  name: string;
  description?: string;
};

type WorkspaceContextType = {
  workspaces: any[];
  loading: boolean;
  setWorkspaces: React.Dispatch<React.SetStateAction<Workspace[]>>;
  createBoard: (
    workspace_id: number,
    data: { name: string; description?: string }
  ) => Promise<void>;
  updateBoard: (
    workspaceId: number,
    boardId: number,
    data: BoardData
  ) => Promise<void>;
  deleteBoard: (workspaceId: number, boardId: number) => Promise<void>;
  createWorkspace: (data: {
    name: string;
    description?: string;
  }) => Promise<void>;
  archiveBoard: (workspace_id: number, id: number) => Promise<void>;
};

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined
);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { workspaces, setWorkspaces, loading } = useWorkspaces();

  const updateBoard = async (
    workspaceId: number,
    boardId: number,
    data: BoardData
  ) => {
    await updateBoardInModel(setWorkspaces, workspaceId, boardId, data);
  };

  const createBoard = async (workspaceId: number, data: BoardData) => {
    await createBoardInModel(setWorkspaces, workspaceId, data);
  };

  const deleteBoard = async (workspaceId: number, boardId: number) => {
    await deleteBoardInModel(setWorkspaces, workspaceId, boardId);
    const updateBoard = async (
      workspace_id: number,
      id: number,
      data: BoardData
    ) => {
      await updateBoardInModel(setWorkspaces, workspace_id, id, data);
    };

    const deleteBoard = async (workspace_id: number, id: number) => {
      await deleteBoardInModel(setWorkspaces, workspace_id, id);
    };

    const archiveBoard = async (workspace_id: number, id: number) => {
      await archiveBoardInModel(setWorkspaces, workspace_id, id);
    };

    const createWorkspace = async (data: {
      name: string;
      description?: string;
    }) => {
      await createWorkspaceInModel(setWorkspaces, data);
    };

    return (
      <WorkspaceContext.Provider
        value={{
          workspaces,
          loading,
          createBoard,
          updateBoard,
          deleteBoard,
          archiveBoard,
          setWorkspaces,
          createWorkspace,
        }}
      >
        {children}
      </WorkspaceContext.Provider>
    );
  };
}

export const useWorkspace = (): WorkspaceContextType => {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) {
    throw new Error("useWorkspace must be used within WorkspaceProvider");
  }
  return ctx;
};
