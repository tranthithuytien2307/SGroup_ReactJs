import { create } from "zustand";
import {
  uploadBoardBackground,
  updateBoardTheme,
} from "./updateBoardBackground";
import type { Board } from "../../../entities/board/model/boardType";
import type { BoardMember } from "../../../entities/users/type/types";
import { getBoardMember } from "./getBoardMember";
import { getBoardCreator } from "./getBoardCreator";
import { getBoardById } from "./getBoardById";
import { updateBoardVisibility } from "./updateBoardVisibility";
import { getBoardArchived } from "./getBoardArchived";
import { getBoardByUser } from "./getBoardByUser";

type Visibility = "private" | "workspace" | "public";

type BoardState = {
  currentBoard: Board | null;
  loading: boolean;
  boardMembers: BoardMember[];
  boardCreator: any;
  archivedItems: {
    lists: any[];
    cards: any[];
  };
  boards: Board[];

  setCurrentBoard: (board: Board) => void;

  getBoardDetail: (boardId: number) => Promise<void>;

  getBoardCreator: (boardId: number) => Promise<void>;

  getBoardMembers: (boardId: number) => Promise<void>;

  getBoardArchived: (boardId: number) => Promise<void>;

  updateBackgroundFile: (boardId: number, file: File) => Promise<void>;

  updateBackgroundTheme: (boardId: number, colorCode: string) => Promise<void>;

  updateBoardNameLocal: (newName: string) => void;

  updateBoardVisibility: (
    boardId: number,
    visibility: Visibility,
  ) => Promise<void>;

  getBoardsByUser: () => Promise<void>;
};

export const useBoardStore = create<BoardState>((set, get) => ({
  currentBoard: null,
  loading: false,
  boardMembers: [],
  boardCreator: null,
  archivedItems: {
    lists: [],
    cards: [],
  },

  boards: [],

  getBoardsByUser: async () => {
    set({ loading: true });

    try {
      const data = await getBoardByUser();

      set({
        boards: data || [],
        loading: false,
      });
    } catch (error) {
      console.error("Failed to fetch boards:", error);
      set({ loading: false });
    }
  },

  setCurrentBoard: (board) => set({ currentBoard: board }),

  getBoardDetail: async (boardId) => {
    if (!boardId) return;

    set({ loading: true });

    try {
      const board = await getBoardById(boardId);

      set({
        currentBoard: board,
        boardMembers: board?.members || [],
        loading: false,
      });
    } catch (error) {
      console.error("Failed to fetch board detail:", error);
      set({ loading: false });
    }
  },

  getBoardArchived: async (boardId) => {
    if (!boardId) return;

    try {
      const data = await getBoardArchived(boardId);

      set({
        archivedItems: {
          lists: data?.lists || [],
          cards: data?.cards || [],
        },
      });
    } catch (error) {
      console.error("Failed to fetch archived items:", error);
    }
  },

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

  getBoardCreator: async (boardId) => {
    if (!boardId) return;

    set({ loading: true });

    try {
      const creator = await getBoardCreator(boardId);

      set({
        boardCreator: creator || null,
        loading: false,
      });
    } catch (error) {
      console.error("Failed to fetch board creator:", error);
      set({ loading: false });
    }
  },

  updateBoardVisibility: async (boardId, visibility: Visibility) => {
    if (!boardId || !visibility) return;

    const previousBoard = get().currentBoard;

    if (previousBoard) {
      set({
        currentBoard: {
          ...previousBoard,
          visibility,
        },
      });
    }

    set({ loading: true });

    try {
      const updatedBoard = await updateBoardVisibility(boardId, visibility);

      if (updatedBoard) {
        set({
          currentBoard: {
            ...previousBoard!,
            ...updatedBoard,
          },
          loading: false,
        });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.error("Failed to update board visibility:", error);

      set({
        currentBoard: previousBoard,
        loading: false,
      });

      throw error;
    }
  },

  updateBackgroundFile: async (boardId, file) => {
    if (!boardId || !file) return;

    const previousBoard = get().currentBoard;
    set({ loading: true });

    try {
      const newCoverUrl = await uploadBoardBackground(boardId, file);

      if (newCoverUrl && previousBoard) {
        set({
          currentBoard: {
            ...previousBoard,
            cover_url: newCoverUrl,
            theme: null,
          },
          loading: false,
        });
      }
    } catch (error) {
      console.error("Failed to update background file in store:", error);
      set({ currentBoard: previousBoard, loading: false });
      throw error;
    }
  },

  updateBackgroundTheme: async (boardId, colorCode) => {
    if (!boardId || !colorCode) return;

    const previousBoard = get().currentBoard;
    set({ loading: true });


    if (previousBoard) {
      set({
        currentBoard: {
          ...previousBoard,
          theme: colorCode,
          cover_url: null,
        },
      });
    }

    try {
      const newTheme = await updateBoardTheme(boardId, colorCode);
      if (!newTheme) throw new Error("Update theme failed");

      set({ loading: false });
    } catch (error) {
      console.error("Failed to update theme in store:", error);
      set({ currentBoard: previousBoard, loading: false }); 
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
