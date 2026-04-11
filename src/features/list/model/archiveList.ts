import { listAPI } from "../../../entities/list/api/listAPI";

export const archiveList = async (listId: number) => {
  if (!listId) return;
  try {
    const res = await listAPI.archiveList(listId);
    return res.data.responseObject;
  } catch (error) {
    console.error("Failed to archive list:", error);
    throw error;
  }
};
