import { create } from "zustand";
import { updateCardDate } from "./updateCardDate";
import { removeDeadlineDate } from "./removeDeadlineDate";
import type { Card } from "../../../entities/card/model/cardType";
import { moveCard } from "./moveCard";
import { deleteCrad } from "./deleteCard";
import { updateCard } from "./updateCard";
import { createCard } from "./createCard";
import { boardAPI } from "../../../entities/board/api/boardAPI";
import { addMemberToCard } from "./addMemberToCard";
import { removeMemberFromCard } from "./removeMemberFromCard";
import { getCardMembers } from "./getCardMembers";
import { useBoardStore } from "../../board/model/boardStore";
import { deleteComment } from "./comment/deleteComment";
import { updateComment } from "./comment/updateComment";
import { createCommentCard } from "./comment/createCommentCard";
import { getCommentByCardId } from "./comment/getCommentByCardId";
import type { CommentType } from "../../../entities/comment/model/commentType";

type CardState = {
  cards: Card[];
  loading: boolean;
  commentsByCardId: Record<number, any[]>;

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

  getComments: (cardId: number) => Promise<void>;
  addComment: (cardId: number, content: string) => Promise<void>;
  updateComment: (commentId: number, content: string) => Promise<void>;
  deleteComment: (cardId: number, commentId: number) => Promise<void>;
  addCommentRealtime: (cardId: number, comment: CommentType) => void;
  updateCommentRealtime: (updated: CommentType) => void;
  deleteCommentRealtime: (cardId: number, commentId: number) => void;
};

export const useCardStore = create<CardState>((set, get) => ({
  cards: [],
  loading: false,
  commentsByCardId: {},

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
  getComments: async (cardId) => {
    try {
      const data = await getCommentByCardId(cardId);

      set((state) => ({
        commentsByCardId: {
          ...state.commentsByCardId,
          [cardId]: data || [],
        },
      }));
    } catch (error) {
      console.error("Failed to get comments", error);
    }
  },

  // addComment: async (cardId, content) => {
  //   const tempId = Date.now();

  //   const clientId = Date.now();

  //   const tempComment = {
  //     id: clientId,
  //     clientId,
  //     card_id: cardId,
  //     content,
  //     created_at: new Date().toISOString(),
  //   };

  //   set((state) => ({
  //     commentsByCardId: {
  //       ...state.commentsByCardId,
  //       [cardId]: [...(state.commentsByCardId[cardId] || []), tempComment],
  //     },
  //   }));

  //   try {
  //     const newComment = await await createCommentCard(
  //       cardId,
  //       content,
  //       clientId,
  //     );

  //     set((state) => ({
  //       commentsByCardId: {
  //         ...state.commentsByCardId,
  //         [cardId]: state.commentsByCardId[cardId].map((c) =>
  //           c.id === tempId ? newComment : c,
  //         ),
  //       },
  //     }));
  //   } catch (error) {
  //     // rollback
  //     set((state) => ({
  //       commentsByCardId: {
  //         ...state.commentsByCardId,
  //         [cardId]: state.commentsByCardId[cardId].filter(
  //           (c) => c.id !== tempId,
  //         ),
  //       },
  //     }));
  //     throw error;
  //   }
  // },

  addComment: async (cardId, content) => {
    const clientId = Date.now();

    const tempComment = {
      id: clientId,
      clientId,
      card_id: cardId,
      content,
      user: { name: "You" },
      created_at: new Date().toISOString(),
    };

    set((state) => ({
      commentsByCardId: {
        ...state.commentsByCardId,
        [cardId]: [...(state.commentsByCardId[cardId] || []), tempComment],
      },
    }));

    try {
      const newComment = await createCommentCard(cardId, content, clientId);

      // ❌ KHÔNG cần replace nữa → để socket xử lý
    } catch (error) {
      set((state) => ({
        commentsByCardId: {
          ...state.commentsByCardId,
          [cardId]: state.commentsByCardId[cardId].filter(
            (c) => c.clientId !== clientId,
          ),
        },
      }));
      throw error;
    }
  },

  updateComment: async (commentId, content) => {
    const previous = get().commentsByCardId;

    // update UI trước
    set((state) => ({
      commentsByCardId: Object.fromEntries(
        Object.entries(state.commentsByCardId).map(([cardId, comments]) => [
          cardId,
          comments.map((c) => (c.id === commentId ? { ...c, content } : c)),
        ]),
      ),
    }));

    try {
      await updateComment(commentId, content);
    } catch (error) {
      set({ commentsByCardId: previous }); // rollback
      throw error;
    }
  },
  deleteComment: async (cardId, commentId) => {
    const previous = get().commentsByCardId;

    set((state) => ({
      commentsByCardId: {
        ...state.commentsByCardId,
        [cardId]: state.commentsByCardId[cardId]?.filter(
          (c) => c.id !== commentId,
        ),
      },
    }));

    try {
      await deleteComment(commentId);
    } catch (error) {
      set({ commentsByCardId: previous }); // rollback
      throw error;
    }
  },

  addCommentRealtime: (cardId: number, comment: CommentType) => {
    set((state) => {
      const existing = state.commentsByCardId[cardId] || [];

      // 🔥 nếu trùng clientId → replace temp
      const index = existing.findIndex(
        (c) => c.clientId && c.clientId === comment.clientId,
      );

      if (index !== -1) {
        const updated = [...existing];
        updated[index] = comment;

        return {
          commentsByCardId: {
            ...state.commentsByCardId,
            [cardId]: updated,
          },
        };
      }

      // user khác → add bình thường
      return {
        commentsByCardId: {
          ...state.commentsByCardId,
          [cardId]: [...existing, comment],
        },
      };
    });
  },

  updateCommentRealtime: (updated: CommentType) => {
    set((state) => ({
      commentsByCardId: Object.fromEntries(
        Object.entries(state.commentsByCardId).map(([cardId, comments]) => [
          Number(cardId),
          comments.map((c) => (c.id === updated.id ? updated : c)),
        ]),
      ),
    }));
  },

  deleteCommentRealtime: (cardId: number, commentId: number) => {
    set((state) => ({
      commentsByCardId: {
        ...state.commentsByCardId,
        [cardId]: state.commentsByCardId[cardId]?.filter(
          (c) => c.id !== commentId,
        ),
      },
    }));
  },
}));
