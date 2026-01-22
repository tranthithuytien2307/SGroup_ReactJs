import api from "../../../shared/lib/axiosInstance";

export const listAPI = {
  getListsByBoardId: async (boardId: number) => {
    return api.get(`/list/board/${boardId}`);
  },

  updateList: async ({
    id,
    name,
    cover_url,
    position,
  }: {
    id: number;
    name?: string;
    cover_url?: string;
    position?: number;
  }) => {
    return api.patch(`/list/${id}`, {
      ...(name !== undefined && { name }),
      ...(cover_url !== undefined && { cover_url }),
      ...(position !== undefined && { position }),
    });
  },

  createList: (boardId: number, name: string) => {
    return api.post("/list", {
      board_id: boardId,
      name,
    });
  },

  deleteList: (listId: number) => {
    return api.delete(`/list/${listId}`);
  },
};
