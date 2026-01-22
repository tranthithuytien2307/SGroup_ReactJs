import { listAPI } from "../../../entities/list/api/listAPI";

export const deleteList = async (listId: number) => {
  if (!listId) return;
  try {
    await listAPI.deleteList(listId);
  } catch (error) {
    console.error("Failed to detele list: ", error);
  }
};
