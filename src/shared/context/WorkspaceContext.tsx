import { createContext, useContext, type ReactNode } from "react";
import { useWorkspaces } from "@/shared/hooks/useWorkspaces";
import type { Workspace } from "@/shared/types";
import {
  updateBoardInModel,
  deleteBoardInModel,
  createBoardInModel,
  archiveBoardInModel
} from "@/shared/model/workspaceModel";

export type BoardUpdateData = {
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
    workspace_id: number,
    id: number,
    data: BoardUpdateData
  ) => Promise<void>;
  deleteBoard: (workspace_id: number, id: number) => Promise<void>;
  archiveBoard: (workspace_id: number, id: number) => Promise<void>;
};

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined
);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { workspaces, setWorkspaces, loading } = useWorkspaces();

  const createBoard = async (
    workspace_id: number,
    data: { name: string; description?: string }
  ) => {
    await createBoardInModel(setWorkspaces, workspace_id, data);
  };

  const updateBoard = async (
    workspace_id: number,
    id: number,
    data: BoardUpdateData
  ) => {
    await updateBoardInModel(setWorkspaces, workspace_id, id, data);
  };

  const deleteBoard = async (workspace_id: number, id: number) => {
    await deleteBoardInModel(setWorkspaces, workspace_id, id);
  };

  const archiveBoard = async (workspace_id: number, id: number) => {
    await archiveBoardInModel(setWorkspaces, workspace_id, id);
  };

  return (
    <WorkspaceContext.Provider
      value={{ workspaces, loading, createBoard, updateBoard, deleteBoard, archiveBoard, setWorkspaces }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export const useWorkspace = (): WorkspaceContextType => {
  const ctx = useContext(WorkspaceContext);
  if (!ctx)
    throw new Error("useWorkspace must be used within WorkspaceProvider");
  return ctx;
};
