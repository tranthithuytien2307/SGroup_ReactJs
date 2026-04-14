import { listAPI } from "../../../entities/list/api/listAPI";

export const renameList = async (
  listId: number,
  newTitle: string,
  version: number,
) => {
  if (!listId || !newTitle.trim() || version === undefined) return;

  try {
    await listAPI.updateList({ id: listId, version, name: newTitle });
  } catch (error) {
    console.error("Error renaming list: ", error);
    throw error;
  }
};
