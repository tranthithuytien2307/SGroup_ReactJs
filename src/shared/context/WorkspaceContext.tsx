import { createContext, useContext, type ReactNode } from "react";
import { useWorkspaces } from "@/shared/hooks/useWorkspaces";
import type { Workspace } from "@/shared/types";
import {
  updateBoardInModel,
  deleteBoardInModel,
} from "@/shared/model/workspaceModel";

export type BoardUpdateData = {
  name: string;
  description?: string;
  cover_url?: string;
};

type WorkspaceContextType = {
  workspaces: any[];
  loading: boolean;
  setWorkspaces: React.Dispatch<React.SetStateAction<Workspace[]>>;
  updateBoard: (
    workspaceId: number,
    boardId: number,
    data: BoardUpdateData
  ) => Promise<void>;
  deleteBoard: (workspaceId: number, boardId: number) => Promise<void>;
};

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined
);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { workspaces, setWorkspaces, loading } = useWorkspaces();

  const updateBoard = async (
    workspaceId: number,
    boardId: number,
    data: BoardUpdateData
  ) => {
    await updateBoardInModel(setWorkspaces, workspaceId, boardId, data);
  };

  const deleteBoard = async (workspaceId: number, boardId: number) => {
    await deleteBoardInModel(setWorkspaces, workspaceId, boardId);
  };

  return (
    <WorkspaceContext.Provider
      value={{ workspaces, loading, updateBoard, deleteBoard, setWorkspaces }}
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
