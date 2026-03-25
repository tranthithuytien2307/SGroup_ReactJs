import { create } from "zustand";
import { createLabel as createLabelService } from "./createLabel";
import type { Label } from "../../../entities/label/model/labelType";
import { getLabelByCardId } from "./getLabelByCardId";
import { getLabelsByBoardId } from "./getLabelsByBoardId";
import { updateLabel } from "./updateLabel";
import { deleteLabel } from "./deleteLabel";
import { detachLabelsFromCard } from "./detachLabelsFromCard";
import { attachLabelsToCard } from "./attachLabelsToCard";

type LabelState = {
  labels: Label[];
  labelsByCardId: Record<number, Label[]>;
  labelsByBoardId: Record<number, Label[]>;
  loading: boolean;

  createLabel: (
    boardId: number,
    name: string | null,
    color: string,
  ) => Promise<void>;

  getLabelsByCardId: (cardId: number) => Promise<void>;
  getLabelsByBoardId: (boardId: number) => Promise<void>;
  updateLabel: (
    id: number,
    cardId: number,
    name: string | null,
    color: string,
  ) => Promise<void>;
  deleteLabel: (id: number, cardId: number) => Promise<void>;
  attachLabelsToCard: (cardId: number, labels: Label[]) => Promise<void>;
  detachLabelsFromCard: (cardId: number, labelIds: number[]) => Promise<void>;
};

export const useLabelStore = create<LabelState>((set) => ({
  labels: [],
  labelsByCardId: {},
  labelsByBoardId: {},
  loading: false,

  createLabel: async (boardId, name, color) => {
    try {
      const newLabel = await createLabelService(boardId, name, color);

      if (!newLabel) return;

      set((state) => ({
        labels: [...state.labels, newLabel],
      }));
    } catch (err) {
      console.error(err);
    }
  },

  getLabelsByCardId: async (cardId) => {
    if (!cardId) return;

    try {
      set({ loading: true });

      const labels = await getLabelByCardId(cardId);

      set((state) => ({
        labelsByCardId: {
          ...state.labelsByCardId,
          [cardId]: labels || [],
        },
        loading: false,
      }));
    } catch (err) {
      console.error(err);
      set({ loading: false });
    }
  },

  getLabelsByBoardId: async (boardId) => {
    if (!boardId) return;
    try {
      set({ loading: true });
      const labels = await getLabelsByBoardId(boardId);

      set((state) => ({
        labelsByBoardId: {
          ...state.labelsByBoardId,
          [boardId]: labels || [],
        },
        loading: false,
      }));
    } catch (error) {
      console.error("Failed to get labels by board id: ", error);
      set({ loading: false });
    }
  },

  updateLabel: async (id, cardId, name, color) => {
    try {
      await updateLabel(id, name, color);

      set((state) => ({
        labels: state.labels.map((l) =>
          l.id === id ? { ...l, name, color } : l,
        ),

        labelsByCardId: {
          ...state.labelsByCardId,
          [cardId]: (state.labelsByCardId[cardId] || []).map((l) =>
            l.id === id ? { ...l, name, color } : l,
          ),
        },

        labelsByBoardId: Object.fromEntries(
          Object.entries(state.labelsByBoardId).map(([bId, list]) => [
            Number(bId),
            list.map((l) => (l.id === id ? { ...l, name, color } : l)),
          ]),
        ),
      }));
    } catch (err) {
      console.error(err);
    }
  },

  deleteLabel: async (id, cardId) => {
    try {
      await deleteLabel(id);

      set((state) => ({
        labels: state.labels.filter((l) => l.id !== id),

        labelsByCardId: {
          ...state.labelsByCardId,
          [cardId]: (state.labelsByCardId[cardId] || []).filter(
            (l) => l.id !== id,
          ),
        },

        labelsByBoardId: Object.fromEntries(
          Object.entries(state.labelsByBoardId).map(([bId, list]) => [
            Number(bId),
            list.filter((l) => l.id !== id),
          ]),
        ),
      }));
    } catch (err) {
      console.error(err);
    }
  },
  attachLabelsToCard: async (cardId, labels) => {
    try {
      const ids = labels.map((l) => l.id);

      await attachLabelsToCard(cardId, ids);

      set((state) => ({
        labelsByCardId: {
          ...state.labelsByCardId,
          [cardId]: [
            ...(state.labelsByCardId[cardId] || []),
            ...labels.filter(
              (l) =>
                !(state.labelsByCardId[cardId] || []).some(
                  (existing) => existing.id === l.id,
                ),
            ),
          ],
        },
      }));
    } catch (err) {
      console.error(err);
    }
  },

  detachLabelsFromCard: async (cardId, labelIds) => {
    try {
      await detachLabelsFromCard(cardId, labelIds);

      set((state) => ({
        labelsByCardId: {
          ...state.labelsByCardId,
          [cardId]: (state.labelsByCardId[cardId] || []).filter(
            (l) => !labelIds.includes(l.id),
          ),
        },
      }));
    } catch (err) {
      console.error(err);
    }
  },
}));
