import { create } from "zustand";
import { listAPI } from "../../../entities/list/api/listAPI";
import type { List } from "../../../entities/list/model/listType";

type ListState = {
  lists: List[];
  loading: boolean;

  setLists: (lists: List[]) => void;

  moveList: (
    listId: number,
    toBoardId: number,
    newIndex: number,
  ) => Promise<void>;

  renameList: (listId: number, newTitle: string) => Promise<void>;

  addList: (boardId: number, name: string) => Promise<void>;

  deleteList: (listId: number) => Promise<void>;

  copyList: (listId: number, newName: string) => Promise<void>;

  archiveList: (listId: number) => Promise<void>;
  unarchiveList: (listId: number) => Promise<void>;
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

  moveList: async (listId, toBoardId, newIndex) => {
    const previousLists = get().lists;

    const listToMove = previousLists.find((l) => l.id === listId);
    if (!listToMove) return;

    const isSameBoard = listToMove.board_id === toBoardId;

    if (isSameBoard) {
      const newLists = [...previousLists];

      const oldIndex = newLists.findIndex((l) => l.id === listId);
      if (oldIndex === -1) return;

      const [movedList] = newLists.splice(oldIndex, 1);
      newLists.splice(newIndex, 0, movedList);

      const updatedLists = newLists.map((l, index) => ({
        ...l,
        position: (index + 1) * 100,
      }));

      set({ lists: updatedLists });
    } else {
      set({
        lists: previousLists.filter((l) => l.id !== listId),
      });
    }

    try {
      await listAPI.moveList(listId, toBoardId, newIndex);

      if (!isSameBoard) {
        return;
      }
    } catch (error) {
      set({ lists: previousLists });
      console.error("Failed to move list:", error);
    }
  },

  renameList: async (listId, newTitle) => {
    const previousLists = get().lists;

    set({
      lists: previousLists.map((l) =>
        l.id === listId ? { ...l, name: newTitle } : l,
      ),
    });

    try {
      await listAPI.updateList({ id: listId, name: newTitle });
    } catch (error) {
      set({ lists: previousLists });
      console.error("Failed to rename list:", error);
    }
  },

  addList: async (boardId, name) => {
    const previousLists = get().lists;

    const tempList: List = {
      id: Date.now(),
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

      const response = await listAPI.getListsByBoardId(boardId);
      const freshLists: List[] = response.data.responseObject;

      set({
        lists: freshLists.sort((a, b) => a.position - b.position),
      });
    } catch (error) {
      set({ lists: previousLists });
      console.error("Failed to add list:", error);
    }
  },

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

  copyList: async (listId, newName) => {
    const previousLists = get().lists;

    const listToCopy = previousLists.find((l) => l.id === listId);
    if (!listToCopy) return;

    const index = previousLists.findIndex((l) => l.id === listId);

    const tempList: List = {
      id: Date.now(),
      board_id: listToCopy.board_id,
      name: newName,
      position: listToCopy.position + 1,
      cover_url: null,
      is_archived: false,
      archived_at: null,
      cards: [],
    };

    const newLists = [...previousLists];
    newLists.splice(index + 1, 0, tempList);

    set({ lists: newLists });

    try {
      await listAPI.copyList(listId, newName);

      const response = await listAPI.getListsByBoardId(listToCopy.board_id);
      const freshLists: List[] = response.data.responseObject;

      set({
        lists: freshLists.sort((a, b) => a.position - b.position),
      });
    } catch (error) {
      set({ lists: previousLists });
      console.error("Failed to copy list:", error);
    }
  },
  archiveList: async (listId) => {
    const previousLists = get().lists;

    set({
      lists: previousLists.filter((l) => l.id !== listId),
    });

    try {
      await listAPI.archiveList(listId);
    } catch (error) {
      set({ lists: previousLists });
      console.error("Failed to archive list:", error);
    }
  },

  unarchiveList: async (listId) => {
    const previousLists = get().lists;

    try {
      await listAPI.unarchiveList(listId);

      const currentBoardId = previousLists[0]?.board_id;
      if (!currentBoardId) return;

      const response = await listAPI.getListsByBoardId(currentBoardId);
      const freshLists: List[] = response.data.responseObject;

      set({
        lists: freshLists.sort((a, b) => a.position - b.position),
      });
    } catch (error) {
      console.error("Failed to unarchive list:", error);
    }
  },
}));
