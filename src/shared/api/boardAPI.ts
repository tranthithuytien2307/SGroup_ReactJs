import api from "../lib/axiosInstance";

export const boardAPI = {
  getBoardByWorkspaceId: (workspaceId: number | string) => {
    return api.get(`/board/workspace/${workspaceId}`);
  },

  createBoard: ({
    name,
    description,
    cover_url,
    workspaceId,
  }: {
    name: string;
    description: string;
    cover_url: string;
    workspaceId: number;
  }) => {
    return api.post("/board", { 
      name, 
      workspace_id: String(workspaceId), 
      description: description ?? null, 
      cover_url: cover_url ?? null 
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
