import api from "../../../shared/lib/axiosInstance";

export const workspaceAPI = {
  getWorkspaces: () => {
    return api.get("/workspace/byUser");
  },

  getWorkspace: (workspace_id: number) => {
    return api.get(`/workspace/${workspace_id}`);
  },

  createWorkspace: ({
    name,
    description,
  }: {
    name: string;
    description: string;
  }) => {
    return api.post("/workspace", { name, description });
  },

  updatedWorkspace: ({
    name,
    description,
    is_active,
    workspace_id,
  }: {
    name: string;
    description: string;
    is_active: boolean;
    workspace_id: number;
  }) => {
    return api.put(`/workspace/${workspace_id}`, {
      name,
      description,
      is_active,
    });
  },

  deleteWorkspace: (workspace_id: number) => {
    return api.delete(`/workspace/${workspace_id}`);
  },

  getMembers: (workspace_id: number) => {
    return api.get(`/workspace-member/${workspace_id}/members`);
  },

  getBoardsArchiveByWorkspaceId: (workspace_id: number) => {
    return api.get(`/workspace/${workspace_id}/boards/archived`);
  },

  archiveWorkspace: (workspace_id: number) => {
    return api.patch(`/workspace/${workspace_id}/archive`);
  },

  unarchiveWorkspace: (workspace_id: number) => {
    return api.patch(`/workspace/${workspace_id}/unarchive`);
  },

  getWorkspaceArchive: () => {
    return api.get(`/workspace/archived`);
  },
};
