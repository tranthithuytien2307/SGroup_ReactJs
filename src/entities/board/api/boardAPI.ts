import api from "../../../shared/lib/axiosInstance";

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
    boardId,
    name,
    description,
    cover_url,
    theme,
  }: {
    boardId: number;
    name?: string;
    description?: string;
    cover_url?: string;
    theme?: string;
  }) => {
    return api.put(`/board/${boardId}`, {
      ...(name ? { name } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(cover_url ? { cover_url } : {}),
      ...(theme ? { theme } : {}),
    });
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

  archiveBoard: (id: number) => {
    return api.patch(`/board/archive/${id}`);
  },

  unarchiveBoard: (id: number) => {
    return api.patch(`/board/unarchive/${id}`);
  },

  updateBackground: (
    boardId: number,
    data: { file?: File; theme?: string },
  ) => {
    const formData = new FormData();

    if (data.file) {
      formData.append("background", data.file);
    }

    if (data.theme) {
      formData.append("theme", data.theme);
    }

    return api.put(`/board/${boardId}/background`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getBoardCreator: (boardId: number) => {
    return api.get(`/board/${boardId}/creator`);
  },

  updateBoardVisibility: (boardId: number, visibility: string) => {
    return api.patch(`/board/visibility/${boardId}`, { visibility });
  },

  getBoardArchived: (boardId: number) => {
    return api.get(`/board/${boardId}/archived`);
  },

  getBoardByUserId: () => {
    return api.get(`/board/my-boards`);
  },
};
