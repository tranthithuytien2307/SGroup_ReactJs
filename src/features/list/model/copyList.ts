import { listAPI } from "../../../entities/list/api/listAPI";

export const copyList = async (listId: number, newName: string) => {
  if (!listId) {
    throw new Error("List ID is required");
  }
  try {
    const res = await listAPI.copyList(listId, newName);
    return res.data.responseObject;
  } catch (error) {
    console.error("Failed to copy list:", error);
    throw error;
  }
};
