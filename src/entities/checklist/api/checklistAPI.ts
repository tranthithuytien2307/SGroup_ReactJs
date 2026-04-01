import api from "../../../shared/lib/axiosInstance";

export const checklistAPI = {
  createChecklist: async (card_id: number, title: string) => {
    return await api.post("/checklist", { card_id, title });
  },

  getAllChecklists: async () => {
    return await api.get("/checklist");
  },

  getChecklistDetail: async (id: number) => {
    return await api.get(`/checklist/${id}`);
  },

  updateChecklistTitle: async (id: number, title: string) => {
    return await api.put(`/checklist/${id}`, { title });
  },

  deleteChecklist: async (id: number) => {
    return await api.delete(`/checklist/${id}`);
  },

  getChecklikstByCardId: async (cardId: number) => {
    return await api.get(`/checklist/${cardId}/by-card`);
  },
};
