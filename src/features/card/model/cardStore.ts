import { create } from "zustand";
import { updateCardDate } from "./updateCardDate";
import { removeDeadlineDate } from "./removeDeadlineDate";
import type { Card } from "../../../entities/card/model/cardType";
import { moveCard } from "./moveCard";

type CardState = {
  cards: Card[];
  loading: boolean;

  setCards: (cards: Card[]) => void;

  updateCardDates: (
    cardId: number,
    start_date?: string,
    due_date?: string,
  ) => Promise<void>;

  removeDeadline: (cardId: number) => Promise<void>;
  moveCard: (
    cardId: number,
    toBoardId: number,
    toListId: number,
    newIndex: number,
  ) => Promise<void>;
};

export const useCardStore = create<CardState>((set) => ({
  cards: [],
  loading: false,

  setCards: (cards) => set({ cards }),

  updateCardDates: async (cardId, start_date, due_date) => {
    if (!cardId) return;

    try {
      set({ loading: true });

      await updateCardDate(cardId, start_date, due_date);

      set((state) => ({
        cards: state.cards.map((card) =>
          card.id === cardId
            ? {
                ...card,
                start_date: start_date ?? card.start_date,
                deadline_date: due_date ?? card.deadline_date,
              }
            : card,
        ),
        loading: false,
      }));
    } catch (error) {
      console.error("Failed to update card dates: ", error);
      set({ loading: false });
    }
  },

  removeDeadline: async (cardId) => {
    if (!cardId) return;

    try {
      set({ loading: true });

      await removeDeadlineDate(cardId);

      set((state) => ({
        cards: state.cards.map((card) =>
          card.id === cardId
            ? {
                ...card,
                deadline_date: null,
                start_date: null,
              }
            : card,
        ),
        loading: false,
      }));
    } catch (error) {
      console.error("Failed to remove deadline: ", error);
      set({ loading: false });
    }
  },
  moveCard: async (cardId, toBoardId, toListId, newIndex) => {
    if (!cardId) return;

    try {
      set({ loading: true });

      // Gọi API moveCard
      await moveCard(cardId, toBoardId, toListId, newIndex);

      // Cập nhật State cục bộ
      set((state) => ({
        cards: state.cards.map((card) =>
          card.id === cardId
            ? {
                ...card,
                list_id: toListId, // Cập nhật ID list mới cho card
                // Bạn có thể cập nhật thêm board_id nếu card được chuyển sang board khác
              }
            : card,
        ),
        loading: false,
      }));
    } catch (error) {
      console.error("Failed to move card in store: ", error);
      set({ loading: false });
      throw error; // Quăng lỗi để UI có thể handle (VD: hoàn tác kéo thả nếu lỗi)
    }
  },
}));
