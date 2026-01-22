import api from "../../../shared/lib/axiosInstance";

export const cardAPI = {
  createCard: (listId: number, title: string) => {
    return api.post("/card", {
      list_id: listId,
      title,
    });
  },
  updateCard: (
    cardId: number,
    data: { title?: string; description?: string },
  ) => {
    return api.put(`/card/${cardId}`, data);
  },
  deleteCard: (cardId: number) => {
    return api.delete(`/card/${cardId}`);
  },
};
