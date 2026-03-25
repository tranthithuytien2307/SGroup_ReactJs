import { create } from "zustand";
import type { ChecklistItemType } from "../../../entities/checklikstItem/model/checklikstItemType";
import { getChecklistProgress } from "./getChecklistProgress";
import { addItem } from "./addItem";
import { updateItem } from "./updateItem";
import { toggleItem } from "./toggleItem";
import { deleteItem } from "./deleteItem";

type ChecklistItemState = {
  itemsByChecklistId: Record<number, ChecklistItemType[]>;
  progressByChecklistId: Record<number, number>;
  loading: boolean;

  // Thêm dòng này vào Type
  setInitialItems: (checklistId: number, items: ChecklistItemType[]) => void;

  addItem: (checklistId: number, content: string) => Promise<void>;
  updateItem: (
    checklistId: number,
    itemId: number,
    content: string,
  ) => Promise<void>;
  toggleItem: (
    checklistId: number,
    itemId: number,
    isCompleted: boolean,
  ) => Promise<void>;
  deleteItem: (checklistId: number, itemId: number) => Promise<void>;
  fetchProgress: (checklistId: number) => Promise<void>;
  setItems: (checklistId: number, items: ChecklistItemType[]) => void;
};

export const useChecklistItemStore = create<ChecklistItemState>((set, get) => ({
  itemsByChecklistId: {},
  progressByChecklistId: {},
  loading: false,

  // Đồng bộ hóa dữ liệu từ ChecklistStore sang
  setInitialItems: (checklistId, items) => {
    // Kiểm tra xem dữ liệu mới có thực sự khác dữ liệu cũ không để tránh render thừa
    const currentItems = get().itemsByChecklistId[checklistId];
    if (currentItems && JSON.stringify(currentItems) === JSON.stringify(items))
      return;

    set((state) => ({
      itemsByChecklistId: {
        ...state.itemsByChecklistId,
        [checklistId]: items,
      },
    }));
  },

  setItems: (checklistId, items) => {
    set((state) => ({
      itemsByChecklistId: {
        ...state.itemsByChecklistId,
        [checklistId]: items,
      },
    }));
  },
  
  fetchProgress: async (checklistId) => {
    // Nếu đang loading thì thôi
    if (get().loading) return;

    try {
      const data = await getChecklistProgress(checklistId);
      if (data) {
        const currentProgress = get().progressByChecklistId[checklistId];
        if (currentProgress !== data.progress) {
          set((state) => ({
            progressByChecklistId: {
              ...state.progressByChecklistId,
              [checklistId]: data.progress,
            },
          }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  },

  addItem: async (checklistId, content) => {
    try {
      const newItem = await addItem(checklistId, content);
      if (!newItem) return;

      set((state) => ({
        itemsByChecklistId: {
          ...state.itemsByChecklistId,
          [checklistId]: [
            ...(state.itemsByChecklistId[checklistId] || []),
            newItem,
          ],
        },
      }));

      // Gọi fetchProgress sau khi add thành công
      await get().fetchProgress(checklistId);
    } catch (err) {
      console.error(err);
    }
  },

  updateItem: async (checklistId, itemId, content) => {
    try {
      await updateItem(itemId, content);

      set((state) => ({
        itemsByChecklistId: {
          ...state.itemsByChecklistId,
          [checklistId]: (state.itemsByChecklistId[checklistId] || []).map(
            (item) => (item.id === itemId ? { ...item, content } : item),
          ),
        },
      }));
    } catch (err) {
      console.error(err);
    }
  },

  toggleItem: async (checklistId, itemId, isCompleted) => {
    try {
      set((state) => ({
        itemsByChecklistId: {
          ...state.itemsByChecklistId,
          [checklistId]: (state.itemsByChecklistId[checklistId] || []).map(
            (item) =>
              item.id === itemId
                ? { ...item, is_completed: isCompleted }
                : item,
          ),
        },
      }));

      await toggleItem(itemId, isCompleted);
      await get().fetchProgress(checklistId);
    } catch (err) {
      console.error(err);
    }
  },

  deleteItem: async (checklistId, itemId) => {
    try {
      await deleteItem(itemId);

      set((state) => ({
        itemsByChecklistId: {
          ...state.itemsByChecklistId,
          [checklistId]: (state.itemsByChecklistId[checklistId] || []).filter(
            (item) => item.id !== itemId,
          ),
        },
      }));

      await get().fetchProgress(checklistId);
    } catch (err) {
      console.error(err);
    }
  },
}));
