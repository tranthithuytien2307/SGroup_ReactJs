import api from "../lib/axiosInstance";

export const boardAPI = {
  getBoardByWorkspaceId: (workspaceId: number | string ) => {
    return api.get(`/board/workspace/${workspaceId}`);
  },
};
