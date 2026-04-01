import { create } from "zustand";
import {
  uploadBoardBackground,
  updateBoardTheme,
} from "./updateBoardBackground";
import type { Board } from "../../../entities/board/model/boardType";
import type { BoardMember } from "../../../entities/users/type/types";
import { getBoardMember } from "./getBoardMember";

type BoardState = {
  currentBoard: Board | null;
  loading: boolean;
  boardMembers: BoardMember[];

  setCurrentBoard: (board: Board) => void;

  getBoardMembers: (boardId: number) => Promise<void>;

  updateBackgroundFile: (boardId: number, file: File) => Promise<void>;

  updateBackgroundTheme: (boardId: number, colorCode: string) => Promise<void>;

  updateBoardNameLocal: (newName: string) => void;
};

export const useBoardStore = create<BoardState>((set, get) => ({
  currentBoard: null,
  loading: false,
  boardMembers: [],

  setCurrentBoard: (board) => set({ currentBoard: board }),

  getBoardMembers: async (boardId) => {
    if (!boardId) return;

    set({ loading: true });

    try {
      const members = await getBoardMember(boardId);

      set({
        boardMembers: members || [],
        loading: false,
      });
    } catch (error) {
      console.error("Failed to fetch board members:", error);
      set({ loading: false });
    }
  },

  updateBackgroundFile: async (boardId, file) => {
    if (!boardId || !file) return;

    const previousBoard = get().currentBoard;
    set({ loading: true });

    try {
      // Gọi service để upload
      const newCoverUrl = await uploadBoardBackground(boardId, file);

      if (newCoverUrl && previousBoard) {
        set({
          currentBoard: {
            ...previousBoard,
            cover_url: newCoverUrl,
            theme: null, // Khi có ảnh thì xóa màu nền
          },
          loading: false,
        });
      }
    } catch (error) {
      console.error("Failed to update background file in store:", error);
      set({ currentBoard: previousBoard, loading: false }); // Rollback nếu lỗi
      throw error;
    }
  },

  updateBackgroundTheme: async (boardId, colorCode) => {
    if (!boardId || !colorCode) return;

    const previousBoard = get().currentBoard;
    set({ loading: true });

    // Cập nhật UI trước cho mượt (Optimistic Update)
    if (previousBoard) {
      set({
        currentBoard: {
          ...previousBoard,
          theme: colorCode,
          cover_url: null, // Khi chọn màu thì xóa ảnh nền
        },
      });
    }

    try {
      const newTheme = await updateBoardTheme(boardId, colorCode);
      if (!newTheme) throw new Error("Update theme failed");

      set({ loading: false });
    } catch (error) {
      console.error("Failed to update theme in store:", error);
      set({ currentBoard: previousBoard, loading: false }); // Rollback nếu lỗi
      throw error;
    }
  },

  updateBoardNameLocal: (newName) => {
    set((state) => ({
      currentBoard: state.currentBoard
        ? { ...state.currentBoard, name: newName }
        : null,
    }));
  },
}));
