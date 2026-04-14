import api from "../../../shared/lib/axiosInstance";

export const listAPI = {
  getListsByBoardId: async (boardId: number) => {
    return api.get(`/list/board/${boardId}`);
  },

  updateList: async ({
    id,
    version,
    name,
    cover_url,
    position,
  }: {
    id: number;
    version: number;
    name?: string;
    cover_url?: string;
    position?: number;
  }) => {
    return api.patch(`/list/${id}`, {
      version,
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

  moveList: (
    listId: number,
    newBoardId: number,
    newIndex: number,
    boardVersion: number,
    targetBoardVersion?: number,
  ) => {
    return api.patch(`/list/${listId}/move`, {
      newBoardId,
      newIndex,
      board_version: boardVersion,
      ...(targetBoardVersion !== undefined && {
        target_board_version: targetBoardVersion,
      }),
    });
  },

  reorderList: (listId: number, newIndex: number, boardVersion: number) => {
    return api.patch(`/list/${listId}/reorder`, {
      newIndex,
      board_version: boardVersion,
    });
  },

  copyList: (listId: number, newName: string) => {
    return api.post(`/list/${listId}/copy`, { newName });
  },

  archiveList: (listId: number) => {
    return api.patch(`/list/${listId}/archive`);
  },

  unarchiveList: (listId: number) => {
    return api.patch(`/list/${listId}/unarchive`);
  },
};
