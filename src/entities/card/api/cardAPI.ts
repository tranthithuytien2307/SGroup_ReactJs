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
  updateCardDates: (
    card_id: number,
    start_date?: string,
    due_date?: string,
  ) => {
    return api.patch(`/card/date`, {
      start_date,
      deadline_date: due_date,
      card_id,
    });
  },
  removeDeadlineDate: (card_id: number) => {
    return api.patch("/card/remove-deadline", { card_id });
  },
  moveCard: (
    id: number,
    toBoardId: number,
    toListId: number,
    newIndex: number,
  ) => {
    return api.patch(`/card/${id}/move`, { toBoardId, toListId, newIndex });
  },
};
