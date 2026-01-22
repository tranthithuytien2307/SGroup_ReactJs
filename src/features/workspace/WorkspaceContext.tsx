import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useWorkspaces } from "./hooks/useWorkspaces";
import type { Workspace } from "../../entities/workspace/model/workspaceType";
import {
  updateBoardInModel,
  deleteBoardInModel,
  createBoardInModel,
  archiveBoardInModel,
} from "../board/model/boardModel";
import { createWorkspaceInModel } from "../workspace/model/workspaceModel";
import { workspaceAPI } from "../../entities/workspace/api/workspaceAPI";
import { useSelectedWorkspace } from "./SelectedWorkspaceContext";

export type BoardData = {
  name: string;
  description?: string;
};

type WorkspaceContextType = {
  workspace: Workspace | null;
  workspaces: Workspace[];
  loading: boolean;
  setWorkspace: React.Dispatch<React.SetStateAction<Workspace | null>>;
  fetchWorkspaces: () => Promise<void>;

  createBoard: (workspaceId: number, data: BoardData) => Promise<void>;
  updateBoard: (boardId: number, data: BoardData) => Promise<void>;
  deleteBoard: (boardId: number) => Promise<void>;
  archiveBoard: (boardId: number) => Promise<void>;

  createWorkspace: (data: {
    name: string;
    description?: string;
  }) => Promise<void>;
};

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined,
);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { workspace, setWorkspace, loading } = useWorkspaces();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const { setSelected } = useSelectedWorkspace();

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const createBoard = async (workspaceId: number, data: BoardData) => {
    await createBoardInModel(setWorkspace, workspaceId, data);
  };

  const updateBoard = async (boardId: number, data: BoardData) => {
    await updateBoardInModel(setWorkspace, boardId, data);
  };

  const fetchWorkspaces = async () => {
    const res = await workspaceAPI.getWorkspaces();
    setWorkspaces(res.data.responseObject);
  };

  const deleteBoard = async (boardId: number) => {
    await deleteBoardInModel(setWorkspace, boardId);
  };

  const archiveBoard = async (boardId: number) => {
    await archiveBoardInModel(setWorkspace, boardId);
  };

  const createWorkspace = async (data: {
    name: string;
    description?: string;
  }) => {
    await createWorkspaceInModel(setWorkspace, setSelected, data);
  };

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        fetchWorkspaces,
        workspace,
        loading,
        setWorkspace,
        createBoard,
        updateBoard,
        deleteBoard,
        archiveBoard,
        createWorkspace,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export const useWorkspace = (): WorkspaceContextType => {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) {
    throw new Error("useWorkspace must be used within WorkspaceProvider");
  }
  return ctx;
};
