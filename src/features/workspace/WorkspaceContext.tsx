import {
  createContext,
  useContext,
  useEffect,
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
import { useWorkspaceStore } from "./model/workspaceStore";

export type BoardData = {
  name: string;
  description?: string;
  cover_url?: string;
  theme?: string;
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
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const setWorkspaces = useWorkspaceStore((state) => state.setWorkspaces);
  const { setSelected } = useSelectedWorkspace();

  useEffect(() => {
    void fetchWorkspaces();
  }, []);

  const createBoard = async (workspaceId: number, data: BoardData) => {
    await createBoardInModel(setWorkspace, workspaceId, data);
  };

  const updateBoard = async (boardId: number, data: BoardData) => {
    await updateBoardInModel(setWorkspace, boardId, data);
  };

  const fetchWorkspaces = async () => {
    const res = await workspaceAPI.getWorkspaces();
    const nextWorkspaces = res.data.responseObject || [];

    setWorkspaces(nextWorkspaces);

    setSelected((prev) => {
      if (prev) {
        const matchedWorkspace = nextWorkspaces.find(
          (workspace: Workspace) => workspace.id === prev.id,
        );

        if (matchedWorkspace) {
          return matchedWorkspace;
        }
      }

      return nextWorkspaces[0] ?? null;
    });
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
    const newWorkspace = await createWorkspaceInModel(
      setWorkspace,
      setSelected,
      data,
    );

    setWorkspaces([...workspaces, newWorkspace]);
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
