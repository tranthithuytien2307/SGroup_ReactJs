import { create } from "zustand";
import type { CommentType } from "../../../entities/comment/model/commentType";
import { getCommentByCardId } from "../../card/model/comment/getCommentByCardId";
import { createCommentCard } from "../../card/model/comment/createCommentCard";
import { updateComment } from "../../card/model/comment/updateComment";
import { deleteComment } from "../../card/model/comment/deleteComment";

type CommentState = {
  commentsByCardId: Record<number, CommentType[]>;

  getComments: (cardId: number) => Promise<void>;
  addComment: (cardId: number, content: string) => Promise<void>;
  updateComment: (commentId: number, content: string) => Promise<void>;
  deleteComment: (cardId: number, commentId: number) => Promise<void>;

  addCommentRealtime: (cardId: number, comment: CommentType) => void;
  updateCommentRealtime: (updated: CommentType) => void;
  deleteCommentRealtime: (cardId: number, commentId: number) => void;
};

export const useCommentStore = create<CommentState>((set, get) => ({
  commentsByCardId: {},

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

  addComment: async (cardId, content) => {
    const clientId = Date.now();

    const tempComment: CommentType = {
      id: clientId,
      clientId,
      card_id: cardId,
      content,
      user: { name: "You" },
      created_at: new Date().toISOString(),
    } as CommentType;

    set((state) => ({
      commentsByCardId: {
        ...state.commentsByCardId,
        [cardId]: [...(state.commentsByCardId[cardId] || []), tempComment],
      },
    }));

    try {
      await createCommentCard(cardId, content, clientId);
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
      set({ commentsByCardId: previous });
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
      set({ commentsByCardId: previous });
      throw error;
    }
  },

  addCommentRealtime: (cardId, comment) => {
    set((state) => {
      const existing = state.commentsByCardId[cardId] || [];

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

      return {
        commentsByCardId: {
          ...state.commentsByCardId,
          [cardId]: [...existing, comment],
        },
      };
    });
  },

  updateCommentRealtime: (updated) => {
    set((state) => ({
      commentsByCardId: Object.fromEntries(
        Object.entries(state.commentsByCardId).map(([cardId, comments]) => [
          Number(cardId),
          comments.map((c) => (c.id === updated.id ? updated : c)),
        ]),
      ),
    }));
  },

  deleteCommentRealtime: (cardId, commentId) => {
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
