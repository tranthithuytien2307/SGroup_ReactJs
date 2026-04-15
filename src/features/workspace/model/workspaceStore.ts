import { create } from "zustand";
import { getBoardArchiveByWorkspaceId } from "./getBoardArchiveByWorkspaceId";
import type { Workspace } from "../../../entities/workspace/model/workspaceType";
import type { Board } from "../../../entities/board/model/boardType";
import { archiveWorkspace } from "./archiveWorkspace";
import { unarchiveWorkspace } from "./unarchiveWorkspace";
import { getWorkspaceArchive } from "./getWorkspaceArchive";
import { updateWorkspace } from "./updateWorkspace";

type WorkspaceState = {
  workspaces: Workspace[];
  archivedBoards: Board[];
  loadingArchive: boolean;
  archivedWorkspaces: Workspace[];

  setWorkspaces: (data: Workspace[]) => void;

  getWorkspaceArchive: () => Promise<void>;

  getBoardArchiveByWorkspaceId: (workspaceId: number) => Promise<void>;
  archiveWorkspace: (workspaceId: number) => Promise<void>;
  unarchiveWorkspace: (workspaceId: number) => Promise<void>;
  updateWorkspace: (payload: {
    name: string;
    description: string;
    is_active: boolean;
    workspace_id: number;
  }) => Promise<void>;
};

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  workspaces: [],
  archivedBoards: [],
  loadingArchive: false,
  archivedWorkspaces: [],
  setWorkspaces: (data) => {
    set({ workspaces: data || [] });
  },

  getWorkspaceArchive: async () => {
    set({ loadingArchive: true });

    try {
      const data = await getWorkspaceArchive();

      set({
        archivedWorkspaces: data || [],
        loadingArchive: false,
      });
    } catch (error) {
      console.error("Fetch archived workspaces failed:", error);
      set({ loadingArchive: false });
      throw error;
    }
  },

  getBoardArchiveByWorkspaceId: async (workspaceId: number) => {
    if (!workspaceId) return;

    set({ loadingArchive: true });

    try {
      const data = await getBoardArchiveByWorkspaceId(workspaceId);

      set({
        archivedBoards: data || [],
        loadingArchive: false,
      });
    } catch (error) {
      console.error("Fetch archived boards failed:", error);
      set({ loadingArchive: false });
      throw error;
    }
  },

  archiveWorkspace: async (workspaceId: number) => {
    if (!workspaceId) return;

    try {
      await archiveWorkspace(workspaceId);

      set((state) => ({
        workspaces: state.workspaces.filter((ws) => ws.id !== workspaceId),
      }));

      if (get().archivedBoards.length > 0) {
        set({ archivedBoards: [] });
      }
    } catch (error) {
      console.error("Failed to archive workspace:", error);
      throw error;
    }
  },

  unarchiveWorkspace: async (workspaceId: number) => {
    if (!workspaceId) return;

    try {
      const restored = await unarchiveWorkspace(workspaceId);

      set((state) => ({
        workspaces: [...state.workspaces, restored],

        archivedWorkspaces: state.archivedWorkspaces.filter(
          (ws) => ws.id !== workspaceId,
        ),
      }));
    } catch (error) {
      console.error("Failed to unarchive workspace:", error);
      throw error;
    }
  },
  updateWorkspace: async (payload) => {
    try {
      const updated = await updateWorkspace(payload);

      set((state) => ({
        workspaces: state.workspaces.map((ws) =>
          ws.id === updated.id ? updated : ws,
        ),

        archivedWorkspaces: state.archivedWorkspaces.map((ws) =>
          ws.id === updated.id ? updated : ws,
        ),
      }));
    } catch (error) {
      console.error("Failed to update workspace:", error);
      throw error;
    }
  },
}));
