import api from "../lib/axiosInstance";

export interface CreateBoardPayload {
  name: string;
  description?: string | undefined;
  workspace_id: number;
}

export interface UpdateBoardPayload {
  id: number;
  name?: string;
  description?: string | null;
}

export const boardAPI = {
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

  getBoardsByWorkspaceId: (workspace_id: number) => {
    return api.get(`/board/workspace/${workspace_id}`);
  },

  getBoards: () => {
    return api.get(`/board`);
  },

  getBoard: (id: number) => {
    return api.get(`/board/${id}`);
  },

  // createBoard: (payload: CreateBoardPayload) => {
  //   return api.post(`/board`, {
  //     name: payload.name,
  //     workspace_id: payload.workspace_id,
  //     description: payload.description,
  //   });
  // },

  // updateBoard: (payload: UpdateBoardPayload) => {
  //   return api.put(`/board/${payload.id}`, {
  //     ...(payload.name !== undefined && { name: payload.name }),
  //     ...(payload.description !== undefined && {
  //       description: payload.description,
  //     }),
  //   });
  // },

  // deleteBoard: (id: number) => {
  //   return api.delete(`/board/${id}`);
  // },

  archiveBoard: (id: number) => {
    return api.post(`/board/archive/${id}`);
  },

  unarchiveBoard: (id: number) => {
    return api.post(`/board/unarchive/${id}`);
  },
};
