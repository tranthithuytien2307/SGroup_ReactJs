import { create } from "zustand";
import { updateCardDate } from "./updateCardDate";
import { removeDeadlineDate } from "./removeDeadlineDate";
import type { Card } from "../../../entities/card/model/cardType";
import { moveCard } from "./moveCard";
import { deleteCrad } from "./deleteCard";
import { updateCard } from "./updateCard";
import { createCard } from "./createCard";

type CardState = {
  cards: Card[];
  loading: boolean;

  setCards: (cards: Card[]) => void;
  addCard: (listId: number, title: string) => Promise<void>;
  updateCardDetail: (
    cardId: number,
    data: { title?: string; description?: string },
  ) => Promise<void>;
  deleteCard: (cardId: number) => Promise<void>;

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

export const useCardStore = create<CardState>((set, get) => ({
  cards: [],
  loading: false,

  setCards: (cards) => set({ cards }),

  addCard: async (listId, title) => {
    const tempId = Date.now();
    const tempCard: Card = {
      id: tempId,
      list_id: listId,
      title,
      position: 9999,
      is_archived: false,
    } as Card;

    set((state) => ({ cards: [...state.cards, tempCard] }));

    try {
      const newCard = await createCard(listId, title);

      set((state) => ({
        cards: state.cards.map((c) =>
          c.id === tempId
            ? newCard
              ? newCard
              : { ...tempCard, id: newCard?.id || tempId }
            : c,
        ),
      }));
    } catch (error) {
      set((state) => ({ cards: state.cards.filter((c) => c.id !== tempId) }));
      throw error;
    }
  },

  updateCardDetail: async (cardId, data) => {
    const previousCards = get().cards;
    // Cập nhật UI trước
    set((state) => ({
      cards: state.cards.map((c) => (c.id === cardId ? { ...c, ...data } : c)),
    }));

    try {
      await updateCard(cardId, data);
    } catch (error) {
      set({ cards: previousCards }); // Rollback nếu lỗi
      throw error;
    }
  },

  deleteCard: async (cardId) => {
    const previousCards = get().cards;
    set((state) => ({ cards: state.cards.filter((c) => c.id !== cardId) }));

    try {
      await deleteCrad(cardId);
    } catch (error) {
      set({ cards: previousCards });
      throw error;
    }
  },

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
                list_id: toListId,
              }
            : card,
        ),
        loading: false,
      }));
    } catch (error) {
      console.error("Failed to move card in store: ", error);
      set({ loading: false });
      throw error;
    }
  },
}));
