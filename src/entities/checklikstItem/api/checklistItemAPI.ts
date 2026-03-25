import api from "../../../shared/lib/axiosInstance";

export const checklistItemAPI = {
  addItem: async (checklist_id: number, content: string) => {
    return await api.post("/checklist/item", { checklist_id, content });
  },

  updateItem: async (item_id: number, content: string) => {
    return await api.put("/checklist/item", { item_id, content });
  },

  toggleItem: async (item_id: number, is_completed: boolean) => {
    return await api.patch("/checklist/item/toggle", { item_id, is_completed });
  },

  deleteItem: async (id: number) => {
    return await api.delete(`/checklist/item/${id}`);
  },

  getChecklistProgress: async (id: number) => {
    return await api.get(`/checklist/${id}/progress`);
  },
};
