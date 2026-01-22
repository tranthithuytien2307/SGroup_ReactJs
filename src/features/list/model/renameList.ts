import { listAPI } from "../../../entities/list/api/listAPI";

export const renameList = async (listId: number, newTitle: string) => {
  if (!listId || !newTitle.trim()) return;

  try {
    await listAPI.updateList({ id: listId, name: newTitle });
  } catch (error) {
    console.error("Error renaming list: ", error);
    throw error;
  }
};
