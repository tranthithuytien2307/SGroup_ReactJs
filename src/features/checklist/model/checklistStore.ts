import { create } from "zustand";
import type { ChecklistType } from "../../../entities/checklist/model/checklistType";
import { createChecklist } from "./createChecklist";
import { getAllChecklists } from "./getAllChecklists";
import { getChecklistDetail } from "./getChecklistDetail";
import { updateChecklistTitle } from "./updateChecklistTitle";
import { deleteChecklist as deleteChecklistService } from "./deleteChecklist";
import { useChecklistItemStore } from "../../checklistItem/model/checklistItemStore";

type ChecklistState = {
  checklists: ChecklistType[]; // all checklists
  checklistsByCardId: Record<number, ChecklistType[]>;
  loading: boolean;

  createChecklist: (cardId: number, title: string) => Promise<void>;
  fetchAllChecklists: () => Promise<void>;
  fetchChecklistDetail: (id: number) => Promise<ChecklistType | void>;
  updateChecklistTitle: (
    id: number,
    cardId: number,
    title: string,
  ) => Promise<void>;
  deleteChecklist: (id: number, cardId: number) => Promise<void>;
};

export const useChecklistStore = create<ChecklistState>((set, get) => ({
  checklists: [],
  checklistsByCardId: {},
  loading: false,

  createChecklist: async (cardId, title) => {
    if (!cardId || !title) return;
    try {
      set({ loading: true });
      const newChecklist = await createChecklist(cardId, title);
      if (newChecklist) {
        set((state) => ({
          checklists: [...state.checklists, newChecklist],
          checklistsByCardId: {
            ...state.checklistsByCardId,
            [cardId]: [
              ...(state.checklistsByCardId[cardId] || []),
              newChecklist,
            ],
          },
          loading: false,
        }));
      }
    } catch (error) {
      console.error("Failed to create checklist:", error);
      set({ loading: false });
    }
  },

  // fetchAllChecklists: async () => {
  //   try {
  //     set({ loading: true });
  //     const data: ChecklistType[] = await getAllChecklists(); // <--- gán kiểu
  //     if (data) {
  //       const byCardId: Record<number, ChecklistType[]> = {};
  //       data.forEach((ch: ChecklistType) => {
  //         // <--- gán kiểu cho ch
  //         if (!byCardId[ch.card_id]) byCardId[ch.card_id] = [];
  //         byCardId[ch.card_id].push(ch);
  //       });

  //       set({
  //         checklists: data,
  //         checklistsByCardId: byCardId,
  //         loading: false,
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch all checklists:", error);
  //     set({ loading: false });
  //   }
  // },
  fetchAllChecklists: async () => {
    try {
      set({ loading: true });
      const data = await getAllChecklists(); // API trả về responseObject như bạn đã đưa

      if (data) {
        const byCardId: Record<number, any[]> = {};

        // Lấy hàm setInitialItems từ Store Item để dùng
        const setInitialItems =
          useChecklistItemStore.getState().setInitialItems;

        data.forEach((ch: any) => {
          // 1. Phân loại checklist theo card_id (Logic cũ của bạn)
          if (!byCardId[ch.card_id]) byCardId[ch.card_id] = [];
          byCardId[ch.card_id].push(ch);

          // 2. Nếu checklist này có items, đẩy ngay vào ChecklistItemStore (Logic mới)
          if (ch.items && ch.items.length > 0) {
            setInitialItems(ch.id, ch.items);
          }
        });

        set({
          checklists: data,
          checklistsByCardId: byCardId,
          loading: false,
        });
      }
    } catch (error) {
      console.error("Failed to fetch all checklists:", error);
      set({ loading: false });
    }
  },

  fetchChecklistDetail: async (id) => {
    if (!id) return;
    try {
      set({ loading: true });
      const checklist = await getChecklistDetail(id);
      set({ loading: false });
      return checklist;
    } catch (error) {
      console.error(`Failed to fetch checklist detail for id ${id}:`, error);
      set({ loading: false });
    }
  },

  // Trong ChecklistStore.ts
  updateChecklistTitle: async (id, cardId, title) => {
    if (!id || !title) return;
    try {
      // Tắt loading tạm thời để tránh giật lag UI khi gõ
      const updatedChecklist = await updateChecklistTitle(id, title);

      if (updatedChecklist) {
        set((state) => {
          // Log để kiểm tra xem updatedChecklist có title không
          console.log("Updated from BE:", updatedChecklist);

          const newChecklists = state.checklists.map(
            (c) => (c.id === id ? { ...c, ...updatedChecklist } : c), // Dùng spread để giữ lại data cũ
          );

          const newByCardId = {
            ...state.checklistsByCardId,
            [cardId]: (state.checklistsByCardId[cardId] || []).map((c) =>
              c.id === id ? { ...c, ...updatedChecklist } : c,
            ),
          };

          return {
            checklists: newChecklists,
            checklistsByCardId: newByCardId,
            loading: false,
          };
        });
      }
    } catch (error) {
      console.error("Update failed:", error);
      set({ loading: false });
    }
  },

  deleteChecklist: async (id, cardId) => {
    if (!id) return;
    try {
      set({ loading: true });
      await deleteChecklistService(id);
      set((state) => ({
        checklists: state.checklists.filter((c) => c.id !== id),
        checklistsByCardId: {
          ...state.checklistsByCardId,
          [cardId]: (state.checklistsByCardId[cardId] || []).filter(
            (c) => c.id !== id,
          ),
        },
        loading: false,
      }));
    } catch (error) {
      console.error(`Failed to delete checklist with id ${id}:`, error);
      set({ loading: false });
    }
  },
}));
