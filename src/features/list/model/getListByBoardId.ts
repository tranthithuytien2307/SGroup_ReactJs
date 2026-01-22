import { listAPI } from "../../../entities/list/api/listAPI";

export const getListByBoardId = async (boardId: number) => {
  if (!boardId) return;
  try {
    const res = await listAPI.getListsByBoardId(boardId);
    return res.data.responseObject;
  } catch (error) {
    console.log("Error fetching lists by board ID: ", error);
    throw error;
  }
};
