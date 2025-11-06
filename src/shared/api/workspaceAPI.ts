import api from "../lib/axiosInstance";

export const workspaceAPI = {
  getWorkspaces: () => {
    return api.get("/workspace");
  },
};
