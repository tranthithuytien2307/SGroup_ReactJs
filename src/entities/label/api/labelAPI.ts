import api from "../../../shared/lib/axiosInstance";

export const labelAPI = {
  createLabel: async (board_id: number, name: string | null, color: string) => {
    return api.post("/label", { board_id, name, color });
  },

  attachLabelsToCard: async (card_id: number, label_ids: number[]) => {
    return api.post("/label/attach", { card_id, label_ids });
  },

  detachLabelsFromCard: async (card_id: number, label_ids: number[]) => {
    return api.post("/label/detach", { card_id, label_ids });
  },

  getLabelsByCardId: async (card_id: number) => {
    return api.get(`/label/card/${card_id}`);
  },

  getLabelsByBoardId: async (board_id: number) => {
    return api.get(`/label/board/${board_id}`);
  },

  updateLabel: async (payload: {
    name?: string | null;
    color?: string;
    label_id: number;
  }) => {
    return api.put(`/label`, payload);
  },

  deleteLabel: async (label_id: number) => {
    return api.delete(`/label/${label_id}`);
  },
};
