import { create } from "zustand";
import { updateCardDate } from "./updateCardDate";
import { removeDeadlineDate } from "./removeDeadlineDate";
import type { Card } from "../../../entities/card/model/cardType";
import { moveCard } from "./moveCard";
import { deleteCrad } from "./deleteCard";
import { updateCard } from "./updateCard";
import { createCard } from "./createCard";
import { addMemberToCard } from "./addMemberToCard";
import { removeMemberFromCard } from "./removeMemberFromCard";
import { getCardMembers } from "./getCardMembers";
import { useBoardStore } from "../../board/model/boardStore";
import { archiveCard } from "./archiveCard";
import { unarchiveCard } from "./unarchiveCard";
import { updateMarkComplete } from "./updateMarkComplete";

type CardState = {
  cards: Card[];
  loading: boolean;
  commentsByCardId: Record<number, any[]>;

  pendingArchive: Record<number, ReturnType<typeof setTimeout>>;
  archivedCards: Record<number, Card>;
  toggleComplete: (cardId: number) => Promise<void>;
  archiveCardOptimistic: (cardId: number) => void;
  undoArchive: (cardId: number) => void;

  getMembers: (cardId: number) => Promise<void>;

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
  addMember: (cardId: number, userId: number) => Promise<void>;
  removeMember: (cardId: number, userId: number) => Promise<void>;
};

export const useCardStore = create<CardState>((set, get) => ({
  cards: [],
  loading: false,
  commentsByCardId: {},
  pendingArchive: {},
  archivedCards: {},

  setCards: (cards) => set({ cards }),

  getMembers: async (cardId) => {
    try {
      const users = await getCardMembers(cardId);

      set((state) => ({
        cards: state.cards.map((card) =>
          card.id === cardId
            ? {
                ...card,
                members: users,
              }
            : card,
        ),
      }));
    } catch (error) {
      console.error("Failed to get members", error);
    }
  },

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
    set((state) => ({
      cards: state.cards.map((c) => (c.id === cardId ? { ...c, ...data } : c)),
    }));

    try {
      await updateCard(cardId, data);
    } catch (error) {
      set({ cards: previousCards });
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

      await moveCard(cardId, toBoardId, toListId, newIndex);

      set({ loading: false });
    } catch (error) {
      console.error("Failed to move card in store: ", error);
      set({ loading: false });
      throw error;
    }
  },

  addMember: async (cardId, userId) => {
    const previousCards = get().cards;
    const boardMembers = useBoardStore.getState().boardMembers;

    const foundUser = boardMembers.find((m) => m.user.id === userId)?.user;

    if (!foundUser) return;

    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === cardId
          ? {
              ...card,
              members: card.members
                ? [...card.members, foundUser]
                : foundUser
                  ? [foundUser]
                  : [],
            }
          : card,
      ),
    }));

    try {
      await addMemberToCard(cardId, userId);
    } catch (error) {
      set({ cards: previousCards });
      throw error;
    }
  },

  removeMember: async (cardId, userId) => {
    const previousCards = get().cards;

    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === cardId
          ? {
              ...card,
              members: card.members?.filter((u) => u.id !== userId),
            }
          : card,
      ),
    }));

    try {
      await removeMemberFromCard(cardId, userId);
    } catch (error) {
      set({ cards: previousCards });
      throw error;
    }
  },

  toggleComplete: async (cardId) => {
    const previousCards = get().cards;
    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === cardId
          ? { ...card, is_completed: !card.is_completed }
          : card,
      ),
    }));

    try {
      const currentCard = previousCards.find((c) => c.id === cardId);
      if (!currentCard) return;

      await updateMarkComplete(cardId);
    } catch (error) {
      console.error("Failed to toggle complete:", error);
      set({ cards: previousCards });
      throw error;
    }
  },

  archiveCardOptimistic: (cardId) => {
    const card = get().cards.find((c) => c.id === cardId);
    if (!card) return;

    const timeout = setTimeout(async () => {
      await archiveCard(cardId);

      set((state) => {
        const newPending = { ...state.pendingArchive };
        delete newPending[cardId];

        const newArchived = { ...state.archivedCards };
        delete newArchived[cardId];

        return {
          pendingArchive: newPending,
          archivedCards: newArchived,
        };
      });
    }, 4000);

    set((state) => ({
      cards: state.cards.filter((c) => c.id !== cardId),

      pendingArchive: {
        ...state.pendingArchive,
        [cardId]: timeout,
      },

      archivedCards: {
        ...state.archivedCards,
        [cardId]: card,
      },
    }));
  },
  undoArchive: async (cardId) => {
    const state = get();

    const timeout = state.pendingArchive[cardId];
    if (timeout) clearTimeout(timeout);

    const card = state.archivedCards[cardId];
    if (!card) return;

    try {
      await unarchiveCard(cardId);

      set((state) => {
        const newPending = { ...state.pendingArchive };
        delete newPending[cardId];

        const newArchived = { ...state.archivedCards };
        delete newArchived[cardId];

        return {
          pendingArchive: newPending,
          archivedCards: newArchived,
          cards: [...state.cards, card],
        };
      });
    } catch (error) {
      console.error("Undo archive failed", error);
    }
  },
}));
