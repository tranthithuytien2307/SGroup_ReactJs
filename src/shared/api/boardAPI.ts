import api from "../lib/axiosInstance";

export const boardAPI = {
  getBoardByWorkspaceId: (workspaceId: number | string) => {
    return api.get(`/board/workspace/${workspaceId}`);
  },

  createBoard: ({
    name,
    description,
    cover_url,
    workspace_id,
  }: {
    name: string;
    description: string;
    cover_url: string;
    workspace_id: number;
  }) => {
    return api.post("/board", {
      name,
      description,
      cover_url,
      workspace_id,
    });
  },

  updateBoard: ({
    name,
    description,
    cover_url,
    boardId,
  }: {
    name: string;
    description: string;
    cover_url: string;
    boardId: number;
  }) => {
    cover_url = "https://xxxx";
    return api.put(`/board/${boardId}`, { name, cover_url, description });
  },

  deleteBoard: (boardId: number) => {
    return api.delete(`/board/${boardId}`);
  },

  getBoards: () => {
    return api.get("/board");
  },

  getBoard: (boardId: number) => {
    return api.get(`/board/${boardId}`);
  },
};
