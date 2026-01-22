import { listAPI } from "../../../entities/list/api/listAPI";

export const createList = async (boardId: number, name: string) => {
  if (!boardId || !name.trim()) return;
  try {
    await listAPI.createList(boardId, name);
  } catch (error) {
    console.error("Failed to create list: ", error);
    throw error;
  }
};
