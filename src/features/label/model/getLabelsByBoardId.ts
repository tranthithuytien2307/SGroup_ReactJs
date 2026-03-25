import { labelAPI } from "../../../entities/label/api/labelAPI";

export const getLabelsByBoardId = async (board_id: number) => {
  if (!board_id) return [];
  try {
    const res = await labelAPI.getLabelsByBoardId(board_id);
    return res.data.responseObject;
  } catch (error) {
    console.error("Failed to get labels by board id: ", error);
    throw error;
  }
};
