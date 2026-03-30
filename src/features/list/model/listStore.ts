import { create } from "zustand";
// import { moveList as moveListAPI } from "./moveList";
import { listAPI } from "../../../entities/list/api/listAPI"; // Giả định đường dẫn API của bạn
import type { List } from "../../../entities/list/model/listType";

type ListState = {
  lists: List[];
  loading: boolean;
  setLists: (lists: List[]) => void;
  // moveList: (
  //   listId: number,
  //   toBoardId: number,
  //   newIndex: number,
  // ) => Promise<void>;
  renameList: (listId: number, newTitle: string) => Promise<void>;
  addList: (boardId: number, name: string) => Promise<void>;
  deleteList: (listId: number) => Promise<void>;
};

export const useListStore = create<ListState>((set, get) => ({
  lists: [],
  loading: false,

  setLists: (lists) => {
    const sortedLists = [...lists]
      .sort((a, b) => a.position - b.position)
      .map((list) => ({
        ...list,
        cards: [...list.cards].sort((a, b) => a.position - b.position),
      }));

    set({ lists: sortedLists });
  },

  // 1. MOVE LIST (Đã sửa từ trước)
  // moveList: async (listId, toBoardId, newIndex) => {
  //   const previousLists = get().lists;
  //   const newLists = [...previousLists];
  //   const listIndex = newLists.findIndex((l) => l.id === listId);
  //   if (listIndex === -1) return;

  //   const [movedList] = newLists.splice(listIndex, 1);
  //   newLists.splice(newIndex, 0, movedList);
  //   set({ lists: newLists });

  //   try {
  //     await moveListAPI(listId, toBoardId, newIndex);
  //     // Sau khi move thành công, fetch lại lists để cập nhật chính xác
  //     const response = await listAPI.getListsByBoardId(toBoardId);
  //     set((state) => ({
  //       lists: response.data.responseObject.sort(
  //         (a, b) => a.position - b.position,
  //       ),
  //     }));
  //   } catch (error) {
  //     set({ lists: previousLists });
  //     console.error("Failed to move list:", error);
  //   }
  // },

  // 2. RENAME LIST
  renameList: async (listId, newTitle) => {
    const previousLists = get().lists;
    // Cập nhật UI ngay lập tức
    set({
      lists: previousLists.map((l) =>
        l.id === listId ? { ...l, name: newTitle } : l,
      ),
    });

    try {
      await listAPI.updateList({ id: listId, name: newTitle });
    } catch (error) {
      set({ lists: previousLists }); // Rollback nếu lỗi
      console.error("Failed to rename list:", error);
    }
  },

  // 3. ADD LIST
  addList: async (boardId, name) => {
    const previousLists = get().lists;
    const tempList: List = {
      id: Date.now(), // ID tạm thời
      board_id: boardId,
      name,
      position: previousLists.length + 1,
      cards: [],
      cover_url: null,
      is_archived: false,
      archived_at: null,
    };

    set({ lists: [...previousLists, tempList] });

    try {
      await listAPI.createList(boardId, name);
      // Sau khi thêm thành công, nên fetch lại hoặc cập nhật ID thật từ server
      const response = await listAPI.getListsByBoardId(boardId);
      const freshLists = response.data.responseObject;
      set({ lists: freshLists.sort((a, b) => a.position - b.position) });
    } catch (error) {
      set({ lists: previousLists });
      console.error("Failed to add list:", error);
    }
  },

  // 4. DELETE LIST
  deleteList: async (listId) => {
    const previousLists = get().lists;
    set({ lists: previousLists.filter((l) => l.id !== listId) });

    try {
      await listAPI.deleteList(listId);
    } catch (error) {
      set({ lists: previousLists });
      console.error("Failed to delete list:", error);
    }
  },
}));
