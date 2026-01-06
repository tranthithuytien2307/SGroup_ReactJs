import api from "../lib/axiosInstance";

export const workspaceAPI = {
  getWorkspaces: () => {
    return api.get("/workspace/byUser");
  },

  getWorkspace: (workspaceId: number) => {
    return api.get(`/workspace/${workspaceId}`);
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
    workspaceId,
  }: {
    name: string;
    description: string;
    is_active: boolean;
    workspaceId: number;
  }) => {
    return api.put(`/workspace/${workspaceId}`, {
      name,
      description,
      is_active,
    });
  },

  deleteWorkspace: (workspaceId: number) => {
    return api.delete(`/workspace/${workspaceId}`);
  },
};
