import { create } from "zustand";
import type { ChecklistType } from "../../../entities/checklist/model/checklistType";
import { createChecklist } from "./createChecklist";
import { getAllChecklists } from "./getAllChecklists";
import { getChecklistDetail } from "./getChecklistDetail";
import { updateChecklistTitle } from "./updateChecklistTitle";
import { deleteChecklist as deleteChecklistService } from "./deleteChecklist";
import { useChecklistItemStore } from "../../checklistItem/model/checklistItemStore";
import { getChecklistByCardId } from "./getChecklistByCardId";

type ChecklistState = {
  checklists: ChecklistType[];
  checklistsByCardId: Record<number, ChecklistType[]>;
  loading: boolean;

  createChecklist: (cardId: number, title: string) => Promise<void>;
  fetchAllChecklists: () => Promise<void>;
  fetchChecklistsByCardId: (cardId: number) => Promise<void>;
  fetchChecklistDetail: (id: number) => Promise<ChecklistType | void>;
  updateChecklistTitle: (
    id: number,
    cardId: number,
    title: string,
  ) => Promise<void>;
  deleteChecklist: (id: number, cardId: number) => Promise<void>;

  getChecklistByCardId: (cardId: number) => ChecklistType[] | undefined;
};

export const useChecklistStore = create<ChecklistState>((set, get) => ({
  checklists: [],
  checklistsByCardId: {},
  loading: false,

  createChecklist: async (cardId, title) => {
    if (!cardId || !title) return;

    try {
      const newChecklist = await createChecklist(cardId, title);
      if (!newChecklist) return;

      set((state) => ({
        checklists: [...state.checklists, newChecklist],
        checklistsByCardId: {
          ...state.checklistsByCardId,
          [cardId]: [...(state.checklistsByCardId[cardId] || []), newChecklist],
        },
      }));
    } catch (error) {
      console.error("Failed to create checklist:", error);
    }
  },

  fetchAllChecklists: async () => {
    try {
      set({ loading: true });

      const data = await getAllChecklists();
      if (!data) return;

      const byCardId: Record<number, ChecklistType[]> = {};

      const setInitialItems = useChecklistItemStore.getState().setInitialItems;

      data.forEach((ch: any) => {
        if (!byCardId[ch.card_id]) byCardId[ch.card_id] = [];
        byCardId[ch.card_id].push(ch);

        if (ch.items?.length) {
          setInitialItems(ch.id, ch.items);
        }
      });

      set({
        checklists: data,
        checklistsByCardId: byCardId,
        loading: false,
      });
    } catch (error) {
      console.error("Failed to fetch all checklists:", error);
      set({ loading: false });
    }
  },

  fetchChecklistsByCardId: async (cardId) => {
    try {
      const data = await getChecklistByCardId(cardId);
      console.log("API DATA:", data);
      if (!data) return;

      const checklistItemStore = useChecklistItemStore.getState();
      const setInitialItems = checklistItemStore.setInitialItems;

      const newProgress: Record<number, number> = {};

      data.forEach((ch: any) => {
        if (ch.items?.length) {
          setInitialItems(ch.id, ch.items);

          const total = ch.items.length;
          const done = ch.items.filter((i: any) => i.is_completed).length;

          newProgress[ch.id] = Math.round((done / total) * 100);
        } else {
          newProgress[ch.id] = 0;
        }
      });

      useChecklistItemStore.setState((state) => ({
        progressByChecklistId: {
          ...state.progressByChecklistId,
          ...newProgress,
        },
      }));

      set((state) => ({
        checklistsByCardId: {
          ...state.checklistsByCardId,
          [cardId]: data,
        },
      }));
    } catch (e) {
      console.error("Fetch checklist by card failed:", e);
    }
  },

  getChecklistByCardId: (cardId) => {
    return get().checklistsByCardId[cardId];
  },

  fetchChecklistDetail: async (id) => {
    if (!id) return;

    try {
      set({ loading: true });
      const checklist = await getChecklistDetail(id);
      set({ loading: false });
      return checklist;
    } catch (error) {
      console.error(`Failed to fetch checklist detail ${id}`, error);
      set({ loading: false });
    }
  },

  updateChecklistTitle: async (id, cardId, title) => {
    if (!id || !title) return;

    try {
      const updatedChecklist = await updateChecklistTitle(id, title);
      if (!updatedChecklist) return;

      set((state) => ({
        checklists: state.checklists.map((c) =>
          c.id === id ? { ...c, ...updatedChecklist } : c,
        ),
        checklistsByCardId: {
          ...state.checklistsByCardId,
          [cardId]: (state.checklistsByCardId[cardId] || []).map((c) =>
            c.id === id ? { ...c, ...updatedChecklist } : c,
          ),
        },
      }));
    } catch (error) {
      console.error("Update checklist failed:", error);
    }
  },

  deleteChecklist: async (id, cardId) => {
    if (!id) return;

    try {
      await deleteChecklistService(id);

      const checklistItemStore = useChecklistItemStore.getState();

      const newProgress = {
        ...checklistItemStore.progressByChecklistId,
      };
      delete newProgress[id];

      const newItems = {
        ...checklistItemStore.itemsByChecklistId,
      };
      delete newItems[id];

      useChecklistItemStore.setState({
        progressByChecklistId: newProgress,
        itemsByChecklistId: newItems,
      });

      set((state) => ({
        checklists: state.checklists.filter((c) => c.id !== id),
        checklistsByCardId: {
          ...state.checklistsByCardId,
          [cardId]: (state.checklistsByCardId[cardId] || []).filter(
            (c) => c.id !== id,
          ),
        },
      }));
    } catch (error) {
      console.error("Delete checklist failed:", error);
    }
  },
}));
