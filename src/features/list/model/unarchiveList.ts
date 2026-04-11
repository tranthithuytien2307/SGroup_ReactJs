import { listAPI } from "../../../entities/list/api/listAPI";

export const unarchiveList = async (listId: number) => {
  if (!listId) return;
  try {
    const res = await listAPI.unarchiveList(listId);
    return res.data.responseObject;
  } catch (error) {
    console.error("Failed to unarchive list:", error);
    throw error;
  }
};
